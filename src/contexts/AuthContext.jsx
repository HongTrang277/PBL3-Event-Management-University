import React, { createContext, useState, useContext, useEffect, use } from 'react';
import { authService } from '../services/api';
import { set } from 'lodash';

// Create the context
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRoles, setUserRoles] = useState([]);

//khoi tao state
  useEffect(()=>{
    const initializeAuth = async ()=>{
      const token = await authService.getToken();
      if(!token){
        setLoading(false);
        return;
      }
      try{
        //lay thong tin tu localstorage
        const storedUser = authService.getUser();
        if(storedUser){
          setUser(storedUser);

          const claims = authService.getClaims();
          let roles = [];
          
          if(claims){
            const claimRoles= claims.role || claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ;
            if(claimRoles){
              //neu claim la chuoi thi giu nguyn khong thi chuyen thanh mang
              roles = Array.isArray(claimRoles) ? claimRoles : [claimRoles];
            }

          }
          if (storedUser.id) {
            try {
              const apiRoles = await authService.getUserRoles(storedUser.id);
              if (apiRoles && apiRoles.length > 0) {
                roles = [...new Set([...roles, ...apiRoles])]; // Loại bỏ trùng lặp
              }
            } catch (roleError) {
              console.warn('Could not fetch roles from API:', roleError);
            }
          }
          
          setUserRoles(roles);

        }
        //cap nhat tu api neu co token
        try {
          const profileResponse = await authService.getProfile();
          if (profileResponse && profileResponse.data) {
            setUser(profileResponse.data);
            localStorage.setItem('user', JSON.stringify(profileResponse.data));
            
            // Lấy vai trò từ API nếu có id
            if (profileResponse.data.id) {
              const apiRoles = await authService.getUserRoles(profileResponse.data.id);
              if (apiRoles && apiRoles.length > 0) {
                setUserRoles(apiRoles);
                
              }
            }
          }
        } catch (profileError) {
          console.error('Error fetching profile:', profileError);
          // Không logout nếu có lỗi - chỉ dựa vào dữ liệu đã lưu
        }
        

      }
      catch(error){
        console.error('Error initializing auth:', error);
        setUser(null);
        setUserRoles([]);
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);
  // Kiểm tra vai trò
  const hasRole = (role) => {
    return userRoles.some(userRole => 
      userRole.toLowerCase() === role.toLowerCase()
    );
  };
  
  // Kiểm tra nhiều vai trò - trả về true nếu có bất kỳ vai trò nào khớp
  const hasAnyRole = (roles) => {
    return roles.some(role => hasRole(role));
  };
  
  // Kiểm tra nhiều vai trò - trả về true nếu có tất cả vai trò
  const hasAllRoles = (roles) => {
    return roles.every(role => hasRole(role));
  };

  const login =async (credential) => {
    try{
      const response = await authService.login(credential);
      console.log("Auth context login response: ", response);

      //lay token va giai ma
      const token =response.token || localStorage.getItem('token');
      if(token){
        //giaima token
        const claims = authService.getClaims(token);
        console.log("Claims from token:", claims);
        const userId = response.userId || response.id || claims.sub || claims.nameid || claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
      
      // Kiểm tra và log để debug
      console.log("Extracted user ID:", userId);
        const userData = {
          id: userId, 
          name: claims.name || claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
          email: claims.email || claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
          role: claims.role || claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
        };
        //fix lỗi không có id trong token
        if (!userData.id) {
        console.warn("No user ID found in token or response. Attempting to get from profile...");
        try {
          // Thử lấy thông tin user từ profile
          const profileResponse = await authService.getProfile();
          if (profileResponse && profileResponse.data && profileResponse.data.id) {
            userData.id = profileResponse.data.id;
            console.log("User ID obtained from profile:", userData.id);
          } else {
            console.error("Could not obtain user ID from profile either");
          }
        } catch (profileError) {
          console.error("Error fetching profile for ID:", profileError);
        }
      }
        console.log("User data from claims:", userData);
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));

        //confirm vai tro

        const role = userData.role;
        if(role){
          const roles= Array.isArray(role) ? role : [role];
          setUserRoles(roles);
        }
        return {
          ...response,
          user: userData
        };

      }
      return response;
    }
    catch(error){
      console.error("Login error:", error);
      throw error;
    }
  }


  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setUserRoles([]);
  };

  // Add isAuthenticated getter
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      loading,
      isAuthenticated: !!user,
      userRoles,
      hasRole,
      hasAnyRole,
      hasAllRoles

    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Add a useAuth hook that consumes the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};