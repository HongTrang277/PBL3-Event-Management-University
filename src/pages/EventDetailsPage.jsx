// Thêm imports mới
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import styled, { keyframes, ThemeProvider, css } from 'styled-components';
import { authService, eventService, registrationService, timeSlotService } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { ROLES, ATTENDANCE_TYPES } from '../utils/constants';
import { formatDateTime, extractDateInfo } from '../utils/helpers';
import Button from '../components/common/Button/Button';
import EventCard from '../components/features/Events/EventCard/EventCard';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from '../assets/marker-icon.png'; // Đảm bảo file này tồn tại
import { toast } from 'react-toastify';

// Thêm các icons cho map và feature icons
import { FaCalendarAlt, FaClock, FaUsers, FaTag, FaInfo, FaRegClock, 
  FaRegCalendarCheck, FaRegBuilding, FaArrowLeft, FaEdit, FaShareAlt, 
  FaRegBookmark, FaRegUserCircle, FaCheckCircle, FaTimes, FaCalendarDay, 
  FaStream } from 'react-icons/fa'; // Thêm FaCalendarDay và FaStream
import { is } from 'date-fns/locale';

// Fix cho Leaflet icon trong React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});
const customIcon = new L.Icon({
  iconUrl: markerIcon || 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
// Thêm helper function để geocode địa chỉ
const geocodeAddress = async (address) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
    );
    const data = await response.json();
    if (data && data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
    return [16.0544, 108.2022]; // Default: Da Nang University of Technology
  } catch (error) {
    console.error('Geocoding error:', error);
    return [16.0544, 108.2022]; // Default fallback
  }
};

// --- Cập nhật Theme với các giá trị mới ---
const themeColors = {
  colors: {
    primary: '#2563EB',
    primaryLight: '#EFF6FF',
    primaryDark: '#1E40AF',
    primaryDarkText: '#1E3A8A',
    textPrimary: '#1E293B',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
    border: '#E2E8F0',
    backgroundLight: '#F8FAFC',
    backgroundDark: '#0F172A',
    white: '#FFFFFF',
    error: '#EF4444',
    errorLight: '#FEE2E2',
    success: '#10B981',
    successLight: '#D1FAE5',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    info: '#3B82F6',
    infoLight: '#DBEAFE',
    coverPlaceholderBg: '#E2E8F0',
    'primary-3': '#1E3A8A',
    'custom-gray': {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A'
    },
    highlights: {
      blue: '#3B82F6',
      green: '#10B981',
      purple: '#8B5CF6',
      orange: '#F59E0B',
      red: '#EF4444',
      indigo: '#4F46E5'
    }
  },
  fontFamily: {
    'dm-sans': "'DM Sans', sans-serif",
    'nunito-sans': "'Nunito Sans', 'Segoe UI', Roboto, sans-serif",
    'inter': "'Inter', 'Segoe UI', Roboto, sans-serif"
  },
  borderRadius: {
    xs: '0.25rem',
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px'
  },
  boxShadow: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  }
};

// --- Keyframes với hiệu ứng mới ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeInRight = keyframes`
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const scrollVertical = keyframes`
  0% { transform: translateY(0%); }
  100% { transform: translateY(-50%); }
`;

// --- Styled Components cho Layout ---
const OverallPageContainer = styled.div`
  display: flex;
  width: 100%;
  padding: 2rem 1.5rem;
  gap: 2rem;
  background-color: ${props => props.theme.colors.backgroundLight};
  min-height: calc(100vh - 70px);
  box-sizing: border-box;
  max-width: 1800px;
  margin: 0 auto;
  
  @media (max-width: 1280px) {
    flex-direction: column;
    align-items: center;
    padding: 1.5rem 1rem;
    gap: 1.5rem;
  }
`;

const SidebarEventsColumn = styled.aside`
  flex: 0 0 300px;
  max-height: calc(100vh - 70px - 4rem);
  overflow: hidden;
  background-color: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: ${props => props.theme.boxShadow.lg};
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.02);
  animation: ${fadeInRight} 0.5s ease-out;
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: ${props => props.theme.colors.primary};
    margin: 0;
    padding: 1.25rem 1.5rem 1rem;
    border-bottom: 1px solid ${props => props.theme.colors.border};
    font-family: ${props => props.theme.fontFamily['dm-sans']};
    background-color: inherit;
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 1.5rem;
      width: 3rem;
      height: 3px;
      background-color: ${props => props.theme.colors.primary};
      border-radius: 3px;
    }
  }
  
  p.no-events-text {
    color: ${props => props.theme.colors.textMuted};
    font-size: 0.9rem;
    text-align: center;
    padding: 2rem 1rem;
  }
  
  @media (max-width: 1280px) {
    display: none;
  }
`;

// --- Các Components nâng cao cho giao diện ---
const MainEventContent = styled.main`
  flex: 1;
  min-width: 0;
  display: flex;
  justify-content: center;
  animation: ${fadeIn} 0.5s ease-out;
  
  @media (max-width: 1280px) {
    width: 100%;
  }
`;

const PageWrapper = styled.div`
  width: 100%;
  max-width: 75rem;
  background-color: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius['2xl']};
  box-shadow: ${props => props.theme.boxShadow.xl};
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.03);
  position: relative;
`;

const StatusContainer = styled.div`
  text-align: center;
  padding: 4rem 1.5rem;
  font-size: 1.125rem;
  color: ${props => props.theme.colors.textSecondary};
  animation: ${fadeIn} 0.5s ease-out;
  width: 100%;
  
  svg {
    font-size: 3rem;
    margin-bottom: 1.5rem;
    color: ${props => props.theme.colors.textMuted};
  }
`;

const ErrorStatusContainer = styled(StatusContainer)`
  color: ${props => props.theme.colors.error};
  
  p {
    margin-bottom: 1.5rem;
    font-weight: 500;
  }
`;

const CoverImageContainer = styled.div`
  height: 26rem;
  background-color: ${props => props.theme.colors.coverPlaceholderBg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.textMuted};
  font-size: 1.25rem;
  position: relative;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, 
      rgba(0,0,0,0) 0%, 
      rgba(0,0,0,0.3) 80%, 
      rgba(0,0,0,0.5) 100%
    );
    z-index: 1;
  }
  
  @media (max-width: 768px) {
    height: 18rem;
  }
`;

const CoverImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: relative;
  z-index: 0;
`;

const EventMeta = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem 3rem;
  color: white;
  z-index: 2;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const MetaTitle = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  font-family: ${props => props.theme.fontFamily['dm-sans']};
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  font-size: 1rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  
  & > span {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  svg {
    font-size: 1.125rem;
  }
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 1rem;
  }
`;

const ContentPadding = styled.div`
  padding: 2rem 3rem 3rem;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 3rem;
  position: relative;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
`;

const LogoImageContainer = styled.div`
  flex-shrink: 0;
  width: 10rem;
  height: 10rem;
  border-radius: 50%;
  border: 6px solid ${props => props.theme.colors.white};
  margin-top: -5rem;
  box-shadow: ${props => props.theme.boxShadow.lg};
  background-color: ${props => props.theme.colors.white};
  overflow: hidden;
  z-index: 3;
  
  @media (max-width: 768px) {
    margin-top: -3rem;
    width: 8rem;
    height: 8rem;
  }
`;

const LogoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const EventInfoSummary = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-top: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  
  svg {
    color: ${props => props.theme.colors.primary};
    font-size: 1.25rem;
    padding-top: 0.125rem;
  }
  
  div {
    display: flex;
    flex-direction: column;
  }
  
  h4 {
    font-size: 0.875rem;
    color: ${props => props.theme.colors.textMuted};
    margin: 0 0 0.25rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  p {
    margin: 0;
    color: ${props => props.theme.colors.textPrimary};
    font-weight: 500;
  }
`;

const Divider = styled.hr`
  border: 0;
  height: 1px;
  background-color: ${props => props.theme.colors.border};
  margin: 2.5rem 0;
`;

const EventDetailsTabs = styled.div`
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  margin-bottom: 2rem;
  overflow-x: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

// MODIFY the original Tab component to use $active instead of active
const Tab = styled.button`
  padding: 1rem 1.5rem;
  font-size: 1rem;
  font-weight: ${props => props.$active ? '600' : '500'};  // Changed this line
  color: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.textSecondary};  // Changed this line
  background: none;
  border: none;
  cursor: pointer;
  border-bottom: 3px solid ${props => props.$active ? props.theme.colors.primary : 'transparent'};  // Changed this line
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
  
  svg {
    font-size: 1.125rem;
  }
`;
const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;

  @media (min-width: 1024px) {
    grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
    gap: 3rem;
  }
`;

const DescriptionColumn = styled.div`
  animation: ${fadeIn} 0.5s ease-out 0.2s backwards;
`;

const DescriptionText = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.75;
  font-size: 1.05rem;
  
  p {
    margin-top: 0;
  }
  
  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: underline;
    font-weight: 500;
    
    &:hover {
      color: ${props => props.theme.colors.primaryDark};
    }
  }
`;

const MapAndDetailsColumn = styled.div`
  animation: ${fadeIn} 0.5s ease-out 0.3s backwards;
`;

const EventInfoCard = styled.div`
  background-color: ${props => props.theme.colors.backgroundLight};
  padding: 1.5rem;
  border-radius: ${props => props.theme.borderRadius.xl};
  border: 1px solid ${props => props.theme.colors.border};
  margin-bottom: 2rem;
  box-shadow: ${props => props.theme.boxShadow.sm};
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  line-height: 1.4;
  font-weight: 700;
  color: ${props => props.theme.colors.textPrimary};
  margin-bottom: 1.5rem;
  font-family: ${props => props.theme.fontFamily['dm-sans']};
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  svg {
    color: ${props => props.theme.colors.primary};
    font-size: 1.25rem;
  }
`;

const InfoBlock = styled.div`
  margin-bottom: 1.75rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoLabel = styled.h3`
  font-size: 0.85rem;
  line-height: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textMuted};
  margin-bottom: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.075em;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    font-size: 1rem;
  }
`;

const InfoText = styled.p`
  color: ${props => props.theme.colors.textPrimary};
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
`;

const SemiBold = styled.span`
  color: ${props => props.theme.colors.textPrimary};
  font-weight: 600;
`;

const MarqueeContainer = styled.div`
  overflow: hidden;
  position: relative;
  height: calc(100vh - 160px);
`;

const MarqueeContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  animation: ${scrollVertical} ${props => props.$duration || '60s'} linear infinite;
`;

const SidebarEventItem = styled.div`
  padding: 0.75rem;
  
  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }
`;

const EditButtonContainer = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
`;

// Now let's fix the Tab component to properly handle the "active" boolean prop



// Sửa đổi MapContainerWrapper để hiển thị bản đồ đầy đủ
const MapContainerWrapper = styled.div`
  height: 450px;
  width: 100%;
  position: relative;
  overflow: hidden;
  
  .leaflet-container {
    height: 100% !important;
    width: 100% !important;
  }
  
  .leaflet-control-container .leaflet-top {
    z-index: 999;
  }
  
  .leaflet-div-icon {
    background: transparent;
    border: none;
  }
`;

// Thêm container cho map section
const MapSection = styled.div`
  width: 100%;
  overflow: hidden;
  margin: 0 auto;
  max-width: 100%;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.boxShadow.md};
`;

const EventLocation = styled.div`
  margin: 3rem 0 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.colors.border};
  animation: ${fadeIn} 0.5s ease-out;
`;

const LocationAddress = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-top: 1.5rem;
  background-color: ${props => props.theme.colors.backgroundLight};
  padding: 1.25rem;
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryLight};
    border-color: ${props => props.theme.colors.primary}20;
  }
  
  svg {
    color: ${props => props.theme.colors.primary};
    font-size: 1.25rem;
    margin-top: 0.125rem;
    flex-shrink: 0;
  }
  
  p {
    margin: 0;
    font-size: 1.05rem;
    line-height: 1.6;
    color: ${props => props.theme.colors.textPrimary};
    font-weight: 500;
  }
  
  a {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.75rem;
    color: ${props => props.theme.colors.primary};
    font-weight: 600;
    font-size: 0.95rem;
    text-decoration: none;
    transition: all 0.2s ease;
    
    &:hover {
      color: ${props => props.theme.colors.primaryDark};
      text-decoration: underline;
    }
  }
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

const TagBadge = styled.span`
  padding: 0.5rem 1rem;
  background-color: ${props => props.theme.colors.primaryLight};
  color: ${props => props.theme.colors.primary};
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: ${props => props.theme.borderRadius.full};
  line-height: 1;
  transition: all 0.2s ease-in-out;
  cursor: default;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.white};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(37, 99, 235, 0.2);
  }
`;

const RegistrationSection = styled.div`
  margin-top: 3rem;
  padding: 2rem;
  border-radius: ${props => props.theme.borderRadius.xl};
  background: linear-gradient(to right bottom, 
    ${props => props.theme.colors.primaryLight}, 
    rgba(239, 246, 255, 0.7)
  );
  text-align: center;
  box-shadow: ${props => props.theme.boxShadow.md};
  border: 1px solid ${props => `${props.theme.colors.primary}20`};
`;

const RegistrationTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  margin: 0 0 1rem;
`;

const RegistrationInfo = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 1.5rem;
`;

const StatusMessage = styled.p`
  font-weight: 600;
  margin: 1.25rem 0;
  font-size: 1.1rem;
  color: ${props => props.theme.colors.success};
  animation: ${fadeIn} 0.3s ease-out;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    font-size: 1.25rem;
  }
`;

const ErrorRegMessage = styled(StatusMessage)`
  color: ${props => props.theme.colors.error};
`;

const BackButtonContainer = styled.div`
  margin-top: 3rem;
  text-align: center;
`;

const EventActions = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => props.$primary && css`  // Changed this line
    background-color: ${props.theme.colors.primary};
    color: white;
    border: none;
    
    &:hover {
      background-color: ${props.theme.colors.primaryDark};
      transform: translateY(-1px);
    }
  `}
  
  ${props => props.$secondary && css`  // Changed this line
    background-color: transparent;
    color: ${props.theme.colors.textSecondary};
    border: 1px solid ${props.theme.colors.border};
    
    &:hover {
      background-color: ${props.theme.colors.backgroundLight};
      color: ${props.theme.colors.textPrimary};
    }
  `}
  
  ${props => props.$success && css`  // Changed this line
    background-color: ${props.theme.colors.successLight};
    color: ${props.theme.colors.success};
    border: none;
    cursor: default;
    
    &:hover {
      background-color: ${props.theme.colors.successLight};
      transform: none;
    }
  `}
`;

const DateBadge = styled.div`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 0.75rem 1.25rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 2;
  
  .month {
    text-transform: uppercase;
    font-size: 0.75rem;
    font-weight: 700;
    color: ${props => props.theme.colors.textSecondary};
    line-height: 1;
    letter-spacing: 0.05em;
  }
  
  .day {
    font-size: 1.75rem;
    font-weight: 700;
    color: ${props => props.theme.colors.primary};
    line-height: 1.2;
  }
  
  .year {
    font-size: 0.75rem;
    font-weight: 500;
    color: ${props => props.theme.colors.textMuted};
    line-height: 1;
  }
`;

const StatusBadge = styled.div`
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 2;
  
  ${props => props.$status === 'upcoming' && css`  // Changed this line
    background-color: ${props.theme.colors.infoLight};
    color: ${props.theme.colors.info};
  `}
  
  ${props => props.$status === 'ongoing' && css`  // Changed this line
    background-color: ${props.theme.colors.successLight};
    color: ${props.theme.colors.success};
  `}
  
  ${props => props.$status === 'past' && css`  // Changed this line
    background-color: ${props.theme.colors['custom-gray'][100]};
    color: ${props.theme.colors['custom-gray'][600]};
  `}
`;

function MapUpdater({ position }) {
  const map = useMap(); // Hook để lấy instance của map
  useEffect(() => {
    if (position && position.length === 2) {
      // 1. Tính toán lại kích thước bản đồ để fix lỗi ô xám
      map.invalidateSize();
      // 2. Di chuyển map đến vị trí mới với hiệu ứng zoom
      map.flyTo(position, 16, {
        animate: true,
        duration: 1.5
      });
    }
  }, [position, map]);

  return null; // Component này không render ra bất cứ thứ gì
}

// Component chính
const EventDetailsPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userRoles, isAuthenticated } = useAuth();

  // State mới
  const [activeTab, setActiveTab] = useState('about'); // 'about', 'location'
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState('');
  const [registrationError, setRegistrationError] = useState('');
  const [isCurrentlyRegistered, setIsCurrentlyRegistered] = useState(false);
  const [eventLocation, setEventLocation] = useState([16.0544, 108.2022]); // Default: DUT
  const [otherEvents, setOtherEvents] = useState([]);
  const [loadingOtherEvents, setLoadingOtherEvents] = useState(true);
  const [eventStatus, setEventStatus] = useState('upcoming'); // 'upcoming', 'ongoing', 'past'
  const formatDaNangDateTimeString = (dateString) => {
    if (!dateString || typeof dateString !== 'string') {
      return 'Chưa xác định';
    }

    try {
      const parts = dateString.split('T');
      if (parts.length < 2) return dateString; // Trả về chuỗi gốc nếu không đúng định dạng

      const datePart = parts[0]; // "2025-06-10"
      const timePart = parts[1]; // "09:00:00"

      const [year, month, day] = datePart.split('-');
      const [hour, minute] = timePart.split(':');

      if (!day || !month || !year || !hour || !minute) return dateString;

      // Định dạng lại thành "Giờ:Phút - Ngày/Tháng/Năm"
      return `${hour}:${minute} - ${day}/${month}/${year}`;
    } catch (e) {
      console.error("Lỗi khi định dạng chuỗi thời gian:", dateString, e);
      return dateString; // Trả về chuỗi gốc nếu có lỗi
    }
  };
  const getDateInfoFromString = (dateString) => {
    if (!dateString || typeof dateString !== 'string') {
      return { day: '--', month: '---', year: '----' };
    }

    try {
      const datePart = dateString.split('T')[0];
      const [year, month, day] = datePart.split('-');

      if (!day || !month || !year) return { day: '--', month: '---', year: '----' };

      // Lấy tên tháng ngắn gọn
      const monthShortName = `Thg ${parseInt(month, 10)}`;

      return {
        day: day,
        month: monthShortName.toUpperCase(),
        year: year
      };
    } catch (error) {
      console.error("Lỗi khi trích xuất thông tin ngày:", dateString, error);
      return { day: '--', month: '---', year: '----' };
    }
  };



  // Xác định trạng thái event dựa trên thời gian
  useEffect(() => {
    const getEventLocation = async () => {
      if (event && event.attendanceType !== ATTENDANCE_TYPES.ONLINE) {
        let coords = null;

        if (event.latitude && event.longitude) {
          coords = [parseFloat(event.latitude), parseFloat(event.longitude)];
        } else if (event.location) {
          coords = await geocodeAddress(event.location);
        }

        // Chỉ cần làm một việc duy nhất: CẬP NHẬT STATE
        if (coords) {
          setEventLocation(coords);
        }
      }
    };

    getEventLocation();
  }, [event]);

  // Geocode địa điểm sự kiện
  useEffect(() => {
    const getEventLocation = async () => {
      if (event && event.attendanceType !== ATTENDANCE_TYPES.ONLINE) {
        try {
          // Ưu tiên sử dụng tọa độ đã lưu trong DB nếu có
          if (event.latitude && event.longitude) {
            console.log("Sử dụng tọa độ từ database:", event.latitude, event.longitude);
            setEventLocation([parseFloat(event.latitude), parseFloat(event.longitude)]);
          }
          // Nếu không có tọa độ lưu sẵn, thực hiện geocoding
          else if (event.location) {
            console.log("Thực hiện geocoding cho địa chỉ:", event.location);
            const coordinates = await geocodeAddress(event.location);
            setEventLocation(coordinates);
          }
        } catch (error) {
          console.error('Lỗi khi xử lý tọa độ:', error);
        }
      }
    };

    getEventLocation();
  }, [event]);


  // Fetch event details và sự kiện khác
  useEffect(() => {
    const fetchEventDetailsAndOthers = async () => {
      if (!eventId) {
        setIsLoading(false);
        setLoadingOtherEvents(false);
        setError("Không tìm thấy ID sự kiện.");
        return;
      }

      setIsLoading(true);
      setLoadingOtherEvents(true);
      setError(null);
      setEvent(null);
      setOtherEvents([]);
      setRegistrationMessage('');
      setRegistrationError('');
      setIsCurrentlyRegistered(false);

      try {
        const response = await eventService.getEvent(eventId);
        const eventData = response.data;
        setEvent(eventData);

        if (isAuthenticated && userRoles.includes(ROLES.STUDENT) && user?.id && eventData?.eventId) {
          const registeredEvents = await registrationService.getEventsUserRegisteredFor(user.id);
          if (Array.isArray(registeredEvents) && registeredEvents.some(reg =>
            (reg.event?.eventId || reg.eventId) === eventData.eventId)) {
            setIsCurrentlyRegistered(true);
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Không thể tải thông tin sự kiện.');
      } finally {
        setIsLoading(false);
      }

      try {
        const allEventsResponse = await eventService.getAllEvents();
        const allEventsData = Array.isArray(allEventsResponse) ? allEventsResponse : [];

        if (allEventsData.length > 0) {
          const filteredOtherEvents = allEventsData
            .filter(e => String(e.eventId) !== String(eventId))
            .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
            .slice(0, 10);
          setOtherEvents(filteredOtherEvents);
        }
      } catch (err) {
        console.error("Error fetching other events:", err);
      } finally {
        setLoadingOtherEvents(false);
      }
    };

    fetchEventDetailsAndOthers();

    if (location.state?.autoRegistrationSuccess && location.state?.eventId === eventId) {
      setRegistrationMessage("Sự kiện đã được tự động đăng ký thành công!");
      setIsCurrentlyRegistered(true);
      // Xóa state khỏi location
      navigate(location.pathname, { replace: true, state: {} });
    } else if (location.state?.autoRegistrationError && location.state?.eventId === eventId) {
      setRegistrationError("Tự động đăng ký sự kiện thất bại. Vui lòng thử đăng ký lại.");
      // Xóa state khỏi location
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [eventId, isAuthenticated, user?.id, userRoles, location.state, navigate]);
  //   useEffect(() => {
  //   if (mapRef.current) {
  //     setTimeout(() => {
  //       mapRef.current.invalidateSize();
  //       if (eventLocation) {
  //         mapRef.current.setView(eventLocation, 15);
  //       }
  //     }, 300);
  //   }
  // }, [eventLocation, mapRef.current]);
  // useEffect(() => {
  //   // Khi tọa độ thay đổi, cập nhật map view
  //   if (mapRef.current && eventLocation) {
  //     const map = mapRef.current;
  //     map.setView(eventLocation, 16, { animate: true });
  //   }
  // }, [eventLocation]);

  // Xử lý đăng ký sự kiện
  const handleRegister = async () => {
    if (!isAuthenticated) {
      toast.info("Vui lòng đăng nhập để đăng ký sự kiện.");
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    if (!user || !user.id || !userRoles.includes(ROLES.STUDENT)) {
      console.error("User is not authenticated or does not have the STUDENT role.");
      console.log("User roles:", userRoles);
      console.log("User object:", user);
      setRegistrationError("Chỉ sinh viên mới có thể đăng ký sự kiện.");
      toast.error("Chỉ tài khoản sinh viên mới có thể đăng ký.");
      return;
    }
    const profileUser = await authService.getProfile();
    const isProfileVerified = profileUser.fullName && profileUser.facultyId;
    console.log("Is profile verified:", isProfileVerified);
    if (!isProfileVerified) {
      console.log(isProfileVerified)
      console.log("User profile information:", profileUser);
      setRegistrationError("Bạn cần cập nhật đầy đủ thông tin cá nhân trước khi đăng ký.");
      toast.warn(
        <div>
          Vui lòng cập nhật đầy đủ thông tin (Họ tên, MSSV, Lớp, Khoa) trong trang Hồ sơ cá nhân.
          <Button
            variant="link"
            onClick={() => navigate('/profile')}
            style={{ marginLeft: '10px', textDecoration: 'underline', color: '#2563EB' }}
          >
            Đi đến trang hồ sơ
          </Button>
        </div>,
        { autoClose: 8000 } // Tăng thời gian hiển thị toast
      );
      return;
    }

    setIsRegistering(true);
    setRegistrationMessage('');
    setRegistrationError('');

    try {
      const responseData = await registrationService.registerUserForEvent(user.id, eventId);

      if (responseData && responseData.registrationId) {
        setRegistrationMessage("Đăng ký thành công! Bạn đã được thêm vào danh sách tham gia.");
        setIsCurrentlyRegistered(true);
      } else {
        setRegistrationError(responseData?.message || "Đăng ký không thành công. Vui lòng thử lại sau.");
      }
    } catch (err) {
      setRegistrationError(err.response?.data?.message || err.message || "Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setIsRegistering(false);
    }
  };

  // Thêm tiện ích
  const eventTags = useMemo(() => {
    if (!event) return [];
    return Array.isArray(event.tagsList) ? event.tagsList : (Array.isArray(event.tags) ? event.tags : []);
  }, [event]);

  const isHost = useMemo(() =>
    isAuthenticated && user?.id && event?.hostId &&
    (userRoles.includes(ROLES.EVENT_CREATOR) || userRoles.includes(ROLES.UNION)) &&
    String(user.id) === String(event.hostId),
    [isAuthenticated, user, event, userRoles]);

  // Helper function để format thông tin ngày/tháng/năm từ thời gian
  const formatDateInfo = (dateString) => {
    if (!dateString) return { day: '--', month: '---', year: '----' };

    try {
      const date = new Date(dateString);
      return {
        day: date.toLocaleDateString('vi-VN', { day: '2-digit' }),
        month: date.toLocaleDateString('vi-VN', { month: 'short' }).toUpperCase(),
        year: date.getFullYear().toString()
      };
    } catch (error) {
      return { day: '--', month: '---', year: '----' };
    }
  };

  // Xử lý các sự kiện sidebar
  const midPoint = Math.ceil(otherEvents.length / 2);
  const leftSidebarEvents = otherEvents.slice(0, midPoint);
  const rightSidebarEvents = otherEvents.slice(midPoint);

  const calculateMarqueeDuration = (eventsList) => {
    const baseSpeedPerCard = 20; // giây
    if (!eventsList || eventsList.length === 0) return '60s';
    const duration = eventsList.length * baseSpeedPerCard;
    return `${Math.max(duration, 30)}s`;
  };
  const handleRegisterForEvent = async (eventId) => {
    if (!user || !user.id) {
      toast.error("Vui lòng đăng nhập để đăng ký tham gia sự kiện");
      return;
    }

    try {
      setIsRegistering(true);
      await registrationService.registerUserForEvent(eventId, user.id);

      toast.success(
        <div>
          <strong>Đăng ký thành công!</strong>
          <p>Email xác nhận đã được gửi đến địa chỉ email của bạn.</p>
          <p>Vui lòng kiểm tra hộp thư để xem thông tin sự kiện.</p>
        </div>,
        { autoClose: 5000 }
      );

      // Update UI or redirect
      setIsRegistered(true);
    } catch (error) {
      let errorMessage = "Không thể đăng ký sự kiện. Vui lòng thử lại sau.";

      if (error.response) {
        if (error.response.status === 409 && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.status === 400) {
          errorMessage = "Bạn đã đăng ký sự kiện này trước đó.";
        }
      }

      toast.error(errorMessage);
    } finally {
      setIsRegistering(false);
    }
  };


  const renderSidebarContent = (eventsList, listKey) => {
    if (loadingOtherEvents) return <p className="no-events-text">Đang tải...</p>;
    if (!eventsList || eventsList.length === 0) return <p className="no-events-text">Không có sự kiện nào.</p>;

    const duplicatedEvents = [...eventsList, ...eventsList];

    return (
      <MarqueeContainer>
        <MarqueeContent $duration={calculateMarqueeDuration(eventsList)}>
          {duplicatedEvents.map((otherEvt, index) => (
            <SidebarEventItem key={`${otherEvt.eventId}-${index}-${listKey}`}>
              <EventCard event={otherEvt} />
            </SidebarEventItem>
          ))}
        </MarqueeContent>
      </MarqueeContainer>
    );
  };

  // Render main content
  return (
    <ThemeProvider theme={themeColors}>
      <OverallPageContainer>
        <SidebarEventsColumn>
          <h3><FaRegCalendarCheck /> Sự kiện khác</h3>
          {renderSidebarContent(leftSidebarEvents, 'left')}
        </SidebarEventsColumn>

        <MainEventContent>
          {isLoading && <StatusContainer><div>Đang tải thông tin sự kiện...</div></StatusContainer>}
          {!isLoading && error && !event && (
            <ErrorStatusContainer>
              <p>Lỗi: {error}</p>
              <Button onClick={() => navigate(-1)} variant="secondary" size="large"><FaArrowLeft /> Quay lại</Button>
            </ErrorStatusContainer>
          )}
          {!isLoading && !event && !error && <StatusContainer>Không tìm thấy thông tin sự kiện.</StatusContainer>}

          {event && (
            <PageWrapper>
              <CoverImageContainer>
                {event.coverUrl ? (
                  <CoverImage src={event.coverUrl} alt={`${event.eventName || 'Sự kiện'} cover`} onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<span>Ảnh bìa sự kiện</span>'; }} />
                ) : (
                  <span>Ảnh bìa sự kiện</span>
                )}

                {/* Date Badge - SỬ DỤNG HÀM MỚI */}
                {event.startDate && (
                  <DateBadge>
                    <span className="month">{getDateInfoFromString(event.startDate).month}</span>
                    <span className="day">{getDateInfoFromString(event.startDate).day}</span>
                    <span className="year">{getDateInfoFromString(event.startDate).year}</span>
                  </DateBadge>
                )}

                <StatusBadge $status={eventStatus}>
                  {eventStatus === 'upcoming' && <><FaRegClock /> Sắp diễn ra</>}
                  {eventStatus === 'ongoing' && <><FaCalendarAlt /> Đang diễn ra</>}
                  {eventStatus === 'past' && <><FaRegCalendarCheck /> Đã kết thúc</>}
                </StatusBadge>

                <EventMeta>
                  <MetaTitle>{event.eventName}</MetaTitle>
                  <MetaInfo>
                    <span><FaRegUserCircle /> {event.hostName || event.hostId}</span>
                    <span><FaMapMarkerAlt /> {event.location || 'Chưa cập nhật địa điểm'}</span>
                  </MetaInfo>
                </EventMeta>
              </CoverImageContainer>

              <ContentPadding>
                {event.logoUrl && (
                  <HeaderSection>
                    <LogoImageContainer>
                      <LogoImage src={event.logoUrl} alt={`${event.eventName || 'Sự kiện'} logo`} onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<span>Logo</span>'; }} />
                    </LogoImageContainer>

                    <EventInfoSummary>
                      {/* Thời gian bắt đầu - SỬ DỤNG HÀM MỚI */}
                      <InfoItem>
                        <FaCalendarAlt />
                        <div>
                          <h4>Thời gian bắt đầu</h4>
                          <p>{formatDaNangDateTimeString(event.startDate)}</p>
                        </div>
                      </InfoItem>
                      {/* Thời gian kết thúc - SỬ DỤNG HÀM MỚI */}
                      <InfoItem>
                        <FaRegClock />
                        <div>
                          <h4>Thời gian kết thúc</h4>
                          <p>{formatDaNangDateTimeString(event.endDate)}</p>
                        </div>
                      </InfoItem>
                      <InfoItem>
                        <FaUsers />
                        <div>
                          <h4>Số lượng tối đa</h4>
                          <p>{event.capacity || 'Không giới hạn'} người</p>
                        </div>
                      </InfoItem>
                      <InfoItem>
                        <FaRegBuilding />
                        <div>
                          <h4>Hình thức</h4>
                          <p>{event.attendanceType === ATTENDANCE_TYPES.ONLINE ? 'Trực tuyến (Online)' : 'Trực tiếp (Offline)'}</p>
                        </div>
                      </InfoItem>
                    </EventInfoSummary>
                    {isHost && (
                      <EditButtonContainer>
                        <RouterLink to={`/admin/edit-event/${event.eventId || eventId}`}>
                          <Button variant="outline" size="medium"><FaEdit /> Chỉnh sửa</Button>
                        </RouterLink>
                      </EditButtonContainer>
                    )}
                  </HeaderSection>
                )}
                <Divider />
                <DetailsGrid>
                  <DescriptionColumn>
                    <SectionTitle><FaInfo /> Mô tả sự kiện</SectionTitle>
                    <DescriptionText dangerouslySetInnerHTML={{ __html: event.description || "Không có mô tả cho sự kiện này." }} />
                  </DescriptionColumn>

                  <MapAndDetailsColumn>
                    <EventInfoCard>
                      <InfoBlock>
                        <InfoLabel><FaCalendarAlt /> Thời gian</InfoLabel>
                        {/* Thời gian trong card - SỬ DỤNG HÀM MỚI */}
                        <InfoText><SemiBold>Bắt đầu:</SemiBold> {formatDaNangDateTimeString(event.startDate)}</InfoText>
                        <InfoText><SemiBold>Kết thúc:</SemiBold> {formatDaNangDateTimeString(event.endDate)}</InfoText>
                      </InfoBlock>
                      <InfoBlock>
                        <InfoLabel><FaMapMarkerAlt /> Hình thức & Địa điểm</InfoLabel>
                        <InfoText>{event.attendanceType === ATTENDANCE_TYPES.ONLINE ? 'Trực tuyến (Online)' : 'Trực tiếp (Offline)'}</InfoText>
                        {event.location && <InfoText>{event.attendanceType === ATTENDANCE_TYPES.ONLINE ? 'Nền tảng: ' : 'Địa điểm: '}<SemiBold>{event.location}</SemiBold></InfoText>}
                      </InfoBlock>
                      <InfoBlock>
                        <InfoLabel><FaUsers /> Số lượng</InfoLabel>
                        <InfoText>Tối đa: <SemiBold>{event.capacity || 'Không giới hạn'} người</SemiBold></InfoText>
                      </InfoBlock>
                      {eventTags.length > 0 && (
                        <InfoBlock>
                          <InfoLabel><FaTag /> Thể loại</InfoLabel>
                          <TagContainer>
                            {eventTags.map((tag, index) => <TagBadge key={`${tag}-${index}`}>{tag}</TagBadge>)}
                          </TagContainer>
                        </InfoBlock>
                      )}
                    </EventInfoCard>
                    <EventActions>
                      <ActionButton $secondary onClick={() => navigator.clipboard.writeText(window.location.href).then(() => alert('Đã sao chép liên kết sự kiện!'))}>
                        <FaShareAlt /> Chia sẻ
                      </ActionButton>
                      <ActionButton $secondary>
                        <FaRegBookmark /> Lưu sự kiện
                      </ActionButton>
                    </EventActions>
                  </MapAndDetailsColumn>
                </DetailsGrid>

                {event.attendanceType !== ATTENDANCE_TYPES.ONLINE && (
                  <EventLocation>
                    <SectionTitle><FaMapMarkerAlt /> Bản đồ</SectionTitle>
                    <MapSection>
                      <MapContainerWrapper>
                        <MapContainer center={eventLocation} zoom={15} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true} doubleClickZoom={true} zoomControl={true}>
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
                          <Marker position={eventLocation} icon={customIcon}>
                            <Popup><b>{event.eventName}</b><br />{event.location}</Popup>
                          </Marker>
                          <MapUpdater position={eventLocation} />
                        </MapContainer>
                      </MapContainerWrapper>
                    </MapSection>
                    <LocationAddress>
                      <FaMapMarkerAlt />
                      <div>
                        <p>{event.location}</p>
                        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`} target="_blank" rel="noopener noreferrer">Xem trên Google Maps →</a>
                      </div>
                    </LocationAddress>
                  </EventLocation>
                )}

                {isAuthenticated && userRoles.includes(ROLES.STUDENT) && eventStatus !== 'past' && event.isOpenedForRegistration && (
                  <RegistrationSection>
                    <RegistrationTitle>Đăng ký tham gia</RegistrationTitle>
                    <RegistrationInfo>Đăng ký tham gia sự kiện để được cập nhật thông tin mới nhất và nhận thông báo từ ban tổ chức.</RegistrationInfo>
                    {registrationMessage ? (
                      <StatusMessage><FaCheckCircle /> {registrationMessage}</StatusMessage>
                    ) : (
                      <>
                        {registrationError && <ErrorRegMessage><FaTimes /> {registrationError}</ErrorRegMessage>}
                        <button
                          onClick={() => handleRegister()}
                          disabled={isRegistering}
                          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          {isRegistering ? (
                            <>
                              <span className="animate-spin inline-block mr-2">⟳</span>
                              Đang đăng ký...
                            </>
                          ) : (
                            "Đăng ký tham gia"
                          )}
                        </button>
                      </>
                    )}
                  </RegistrationSection>
                )}

                <BackButtonContainer>
                  <Button onClick={() => navigate('/events')} variant="secondary" size="medium"><FaArrowLeft /> Xem tất cả sự kiện</Button>
                </BackButtonContainer>
              </ContentPadding>
            </PageWrapper>
          )}
        </MainEventContent>

        <SidebarEventsColumn>
          <h3><FaRegCalendarCheck /> Có thể bạn quan tâm</h3>
          {renderSidebarContent(rightSidebarEvents, 'right')}
        </SidebarEventsColumn>
      </OverallPageContainer>
    </ThemeProvider>
  );
};

export default EventDetailsPage;