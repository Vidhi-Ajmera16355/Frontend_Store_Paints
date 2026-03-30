import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix default marker icon (Leaflet + bundler issue)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom marker icon with the brand primary color
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

/* ─── Sub-component: click-to-place marker ─── */
function LocationMarker({ position, setPosition, onLocationFound }) {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      reverseGeocode(e.latlng.lat, e.latlng.lng, onLocationFound);
    },
  });

  useEffect(() => {
    if (position) {
      map.flyTo(position, 16, { duration: 1.2 });
    }
  }, [position, map]);

  return position ? <Marker position={position} icon={customIcon} /> : null;
}

/* ─── Sub-component: fly map to search result ─── */
function FlyToLocation({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 16, { duration: 1.2 });
  }, [position, map]);
  return null;
}

/* ─── Reverse geocode using Nominatim ─── */
async function reverseGeocode(lat, lng, callback) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
      { headers: { 'Accept-Language': 'en' } }
    );
    const data = await res.json();
    if (data?.address) {
      callback({
        address: data.display_name || '',
        city:
          data.address.city ||
          data.address.town ||
          data.address.village ||
          data.address.county ||
          '',
        state: data.address.state || '',
        country: data.address.country || '',
        pincode: data.address.postcode || '',
      });
    }
  } catch (err) {
    console.error('Reverse geocode error:', err);
  }
}

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
const MapLocationPicker = ({ onLocationSelect }) => {
  const [position, setPosition] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);
  const debounceRef = useRef(null);
  const containerRef = useRef(null);

  /* ─── Debounced search ─── */
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            searchQuery
          )}&addressdetails=1&limit=5`,
          { headers: { 'Accept-Language': 'en' } }
        );
        const data = await res.json();
        setSuggestions(data || []);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [searchQuery]);

  /* ─── Pick a suggestion ─── */
  const handleSuggestionClick = (item) => {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    setPosition({ lat, lng: lon });
    setSearchQuery(item.display_name);
    setSuggestions([]);

    const addr = item.address || {};
    onLocationSelect({
      address: item.display_name || '',
      city: addr.city || addr.town || addr.village || addr.county || '',
      state: addr.state || '',
      country: addr.country || '',
      pincode: addr.postcode || '',
    });
  };

  /* ─── Handle reverse-geocode callback from map click ─── */
  const handleMapLocationFound = (locationData) => {
    onLocationSelect(locationData);
    setSearchQuery(locationData.address);
  };

  /* ─── Get user's current location ─── */
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latlng = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setPosition(latlng);
        if (!mapVisible) setMapVisible(true);
        reverseGeocode(latlng.lat, latlng.lng, (data) => {
          onLocationSelect(data);
          setSearchQuery(data.address);
        });
      },
      (err) => {
        alert('Unable to get your location. Please allow location access.');
        console.error(err);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="map-picker-wrapper" ref={containerRef}>
      {/* ─── Header ─── */}
      <div className="map-picker-header">
        <div className="map-picker-title-row">
          <span className="map-picker-icon">📍</span>
          <h3 className="map-picker-title">Select Location on Map</h3>
        </div>
        <p className="map-picker-subtitle">
          Search for your address or click on the map to pin your location
        </p>
      </div>

      {/* ─── Search bar ─── */}
      <div className="map-search-container">
        <div className="map-search-input-wrapper">
          <span className="map-search-icon">🔍</span>
          <input
            type="text"
            className="map-search-input"
            placeholder="Search for a place, address, or landmark..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => { if (!mapVisible) setMapVisible(true); }}
          />
          {searchQuery && (
            <button
              className="map-search-clear"
              onClick={() => {
                setSearchQuery('');
                setSuggestions([]);
              }}
            >
              ✕
            </button>
          )}
        </div>

        <button
          className="map-my-location-btn"
          onClick={handleUseMyLocation}
          title="Use my current location"
        >
          <span>📌</span> My Location
        </button>
      </div>

      {/* ─── Suggestions dropdown ─── */}
      {suggestions.length > 0 && (
        <ul className="map-suggestions">
          {suggestions.map((item) => (
            <li
              key={item.place_id}
              className="map-suggestion-item"
              onClick={() => handleSuggestionClick(item)}
            >
              <span className="suggestion-icon">📍</span>
              <div className="suggestion-text">
                <span className="suggestion-name">
                  {item.address?.road || item.address?.neighbourhood || item.display_name?.split(',')[0]}
                </span>
                <span className="suggestion-detail">
                  {item.display_name}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {isSearching && (
        <div className="map-search-loading">
          <div className="map-spinner"></div>
          <span>Searching...</span>
        </div>
      )}

      {/* ─── Toggle map button ─── */}
      {!mapVisible && (
        <button
          className="map-toggle-btn"
          onClick={() => setMapVisible(true)}
        >
          🗺️ Show Map
        </button>
      )}

      {/* ─── Map ─── */}
      {mapVisible && (
        <div className="map-container-wrapper">
          <MapContainer
            center={position || [20.5937, 78.9629]} // Default: India center
            zoom={position ? 16 : 5}
            className="map-leaflet-container"
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker
              position={position}
              setPosition={setPosition}
              onLocationFound={handleMapLocationFound}
            />
            {position && <FlyToLocation position={position} />}
          </MapContainer>

          <div className="map-hint">
            <span>💡</span> Click anywhere on the map to pin your delivery location
          </div>
        </div>
      )}
    </div>
  );
};

export default MapLocationPicker;
