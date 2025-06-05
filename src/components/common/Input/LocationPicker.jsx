import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import styled from 'styled-components';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Known locations mapping - customize these with your frequently used locations
const knownLocations = {
  // DUT Locations
  "Trung tâm Học liệu và Truyền thông": { lat: 16.074503, lng: 108.150707, name: "Trung tâm Học liệu và Truyền thông" },
  "Hội trường F": { lat: 16.075346, lng: 108.151877, name: "Hội trường F" },
  "Sảnh khu A (gần hồ cá)": { lat: 16.075516, lng: 108.153608, name: "Sảnh khu A (gần hồ cá)" },
  "Hội trường S02.06": { lat: 16.074926, lng: 108.154097, name: "Hội trường S02.06" },
};
const normalizeText = (text) => {
  return text.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
};

const matchKeyword = (text) => {
  if (!text) return null;
  
  // Normalize the input text
  const normalizedInput = normalizeText(text);
    console.log("Normalized input:", normalizedInput);
  // Create a normalized version of the knownLocations keys for matching
  const normalizedLocations = {};
  for (const [key, value] of Object.entries(knownLocations)) {
    normalizedLocations[normalizeText(key)] = value;
  }
  console.log("Normalized locations:", normalizedLocations);
  
  
  // Try exact match first
  if (normalizedLocations[normalizedInput]) {
    return normalizedLocations[normalizedInput];
  }
  
  // Then try contains match
  for (const [key, value] of Object.entries(normalizedLocations)) {
    if (normalizedInput.includes(key) || key.includes(normalizedInput)) {
      return value;
    }
  }
  
  return null;
};


const MapWrapper = styled.div`
  height: 350px;
  width: 100%;
  margin-top: 10px;
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  position: relative;
`;

const CoordinateDisplay = styled.div`
  margin-top: 10px;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  background: ${({ theme }) => theme.colors.background};
  padding: 8px;
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const SearchButton = styled.button`
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.colors.accent};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.accentLight};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.textLight};
    cursor: not-allowed;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const KeywordSuggestion = styled.div`
  margin-top: 5px;
  padding: 4px 8px;
  background-color: ${({ theme }) => theme.colors.accentLight}20;
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.accent};
  display: inline-block;
  cursor: pointer;
  margin-right: 5px;
  margin-bottom: 5px;
  transition: all 0.2s;
  border: 1px solid ${({ theme }) => theme.colors.accentLight}40;

  &:hover {
    background-color: ${({ theme }) => theme.colors.accentLight}40;
    border-color: ${({ theme }) => theme.colors.accentLight};
  }
`;

const SuggestionsWrapper = styled.div`
  margin-top: 5px;
  margin-bottom: 10px;
`;

const KeywordMatch = styled.div`
  margin-top: 5px;
  padding: 8px;
  background-color: ${({ theme }) => theme.colors.successLight};
  border-left: 3px solid ${({ theme }) => theme.colors.success};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.success};
`;

const InstructionText = styled.p`
  margin-top: 8px;
  margin-bottom: 10px;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-style: italic;
`;

// MapController component to handle map clicks and updates
function MapController({ position, setPosition }) {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  // Center map when position changes
  const changeMapView = useCallback((newPosition) => {
    if (newPosition) {
      map.setView([newPosition.lat, newPosition.lng], 16, { animate: true });
    }
  }, [map]);

  // Update map view when position changes
  useEffect(() => {
    if (position) {
      changeMapView(position);
    }
  }, [position, changeMapView]);

  return position ? <Marker position={position} /> : null;
}

const LocationPicker = ({ latitude, longitude, onLocationChange, locationName }) => {
  // Default to DUT coordinates if not provided
  const defaultPosition = { lat: 16.075346, lng: 108.151908 };
  const [position, setPosition] = useState(
    latitude && longitude ? { lat: latitude, lng: longitude } : null
  );
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [matchedKeyword, setMatchedKeyword] = useState(null);
  const [suggestedKeywords] = useState(Object.keys(knownLocations).slice(0, 5)); // Show top 5 keywords as suggestions

  useEffect(() => {
    if (locationName) {
      const match = matchKeyword(locationName);
      setMatchedKeyword(match);
      
      // DO NOT automatically set position when the text changes
      // Uncomment only if you want automatic position setting on text change
      if (match) {
        setPosition({ lat: match.lat, lng: match.lng });
      }
    } else {
      setMatchedKeyword(null);
    }
  }, [locationName]);

  

  useEffect(() => {
    if (position) {
      onLocationChange(position.lat, position.lng);
    }
  }, [position, onLocationChange]);

  useEffect(() => {
    // Only update from props if the position is significantly different
    // or if we don't have a position yet
    if (latitude && longitude && (
      !position || 
      Math.abs(latitude - position.lat) > 0.0001 || 
      Math.abs(longitude - position.lng) > 0.0001
    )) {
      setPosition({ lat: latitude, lng: longitude });
    }
  }, [latitude, longitude]);

  const handleSetLocation = (locationData) => {
    setPosition({ lat: locationData.lat, lng: locationData.lng });
    setMatchedKeyword(locationData);
  };

  const handleSearchLocation = async () => {
  const match = matchKeyword(locationName);
  
  // If we have a keyword match, use it directly
  if (match) {
    console.log("Using matched location:", match.name);
    setPosition({ lat: match.lat, lng: match.lng });
    return;
  }
  
  if (!locationName) {
    setSearchError('Vui lòng nhập địa điểm trước khi tìm kiếm');
    return;
  }

  setIsSearching(true);
  setSearchError('');

  try {
    // Using Nominatim API for geocoding
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName + ', Vietnam')}&limit=1`
    );
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();

    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      const newPosition = { 
        lat: parseFloat(lat), 
        lng: parseFloat(lon) 
      };
      console.log("Setting position from search:", newPosition);
      setPosition(newPosition);
    } else {
      setSearchError('Không tìm thấy địa điểm. Vui lòng thử tên địa điểm khác hoặc chọn trực tiếp trên bản đồ.');
    }
  } catch (error) {
    console.error('Error searching location:', error);
    setSearchError('Lỗi khi tìm kiếm địa điểm. Vui lòng thử lại sau.');
  } finally {
    setIsSearching(false);
  }
};
function MapController({ position, setPosition }) {
    const map = useMapEvents({
      click(e) {
        // When the map is clicked, set position directly without going through props
        setPosition(e.latlng);
      },
    });

    // Center map when position changes but don't log on every render
    const changeMapView = useCallback((newPosition) => {
      if (newPosition) {
        map.setView([newPosition.lat, newPosition.lng], 16, { animate: true });
      }
    }, [map]);

    // Update map view when position changes
    useEffect(() => {
      if (position) {
        changeMapView(position);
      }
    }, [position, changeMapView]);

    return position ? <Marker position={position} /> : null;
  }
// Add a clear function to reset the position when needed
const clearPosition = () => {
  setPosition(null);
  setMatchedKeyword(null);
};
useEffect(() => {
  console.log("LocationPicker state:", {
    locationName,
    position,
    matchedKeyword,
    latitude,
    longitude
  });
}, [locationName, position, matchedKeyword, latitude, longitude]);

  return (
    <div>
      <InstructionText>
        Nhập địa chỉ và nhấn "Tìm kiếm" hoặc nhấp trực tiếp vào bản đồ để chọn vị trí chính xác.
      </InstructionText>
      
      {/* Keyword suggestions */}
      <SuggestionsWrapper>
        <small style={{ display: 'block', marginBottom: '5px', fontSize: '0.8rem' }}>Địa điểm phổ biến:</small>
        {suggestedKeywords.map(keyword => (
          <KeywordSuggestion 
            key={keyword}
            onClick={() => handleSetLocation(knownLocations[keyword])}
          >
            {knownLocations[keyword].name}
          </KeywordSuggestion>
        ))}
      </SuggestionsWrapper>
      
      {matchedKeyword && (
        <KeywordMatch>
          <strong>Đã nhận diện địa điểm:</strong> {matchedKeyword.name}
          <div style={{ marginTop: '4px', fontSize: '0.8rem' }}>
            Nhấn "Tìm kiếm" để đặt pin tự động.
          </div>
        </KeywordMatch>
      )}
      
      <SearchButton 
        onClick={handleSearchLocation}
        disabled={!locationName || isSearching}
      >
        {isSearching ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            Đang tìm...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            Tìm kiếm vị trí
          </>
        )}
      </SearchButton>
      
      {searchError && (
        <div style={{ color: 'red', fontSize: '0.85rem', marginBottom: '10px' }}>
          {searchError}
        </div>
      )}

      <MapWrapper>
        <MapContainer
          center={position || defaultPosition}
          zoom={17}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController 
            position={position} 
            setPosition={setPosition} 
          />
        </MapContainer>
      </MapWrapper>
      
      {position && (
        <CoordinateDisplay>
          <strong>Tọa độ đã chọn:</strong> {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
          <div style={{ marginTop: '4px', fontSize: '0.8rem' }}>
            Đã đánh dấu vị trí trên bản đồ
          </div>
        </CoordinateDisplay>
      )}
    </div>
  );
};

export default LocationPicker;