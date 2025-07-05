import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface GoogleMapProps {
  address: string;
  title?: string;
  zoom?: number;
  height?: string;
  showMarker?: boolean;
  showStreetView?: boolean;
  className?: string;
}

declare global {
  interface Window {
    google: any;
    initGoogleMaps: () => void;
  }
}

export function GoogleMap({
  address,
  title,
  zoom = 15,
  height = "400px",
  showMarker = true,
  showStreetView = false,
  className = "",
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Verificar se o Google Maps já está carregado
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      initializeMap();
      return;
    }

    // Carregar Google Maps API
    loadGoogleMapsScript();
  }, [address]);

  const loadGoogleMapsScript = () => {
    // Verificar se o script já existe
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY || "AIzaSyBs8TFTx6n8HvRG6J8W8zXZr2r7g5P8K8Q"}&libraries=places,geometry`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setIsLoaded(true);
      initializeMap();
    };

    script.onerror = () => {
      setError("Erro ao carregar Google Maps");
    };

    document.head.appendChild(script);
  };

  const initializeMap = async () => {
    if (!mapRef.current || !window.google) return;

    try {
      const geocoder = new window.google.maps.Geocoder();

      // Geocodificar o endereço
      const response = await new Promise((resolve, reject) => {
        geocoder.geocode({ address }, (results: any, status: any) => {
          if (status === "OK") {
            resolve(results);
          } else {
            reject(new Error(`Geocoding failed: ${status}`));
          }
        });
      });

      const results = response as any[];
      const location = results[0].geometry.location;

      // Configurar o mapa
      const mapOptions = {
        zoom,
        center: location,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true,
        streetViewControl: showStreetView,
        fullscreenControl: true,
        zoomControl: true,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      };

      const map = new window.google.maps.Map(mapRef.current, mapOptions);

      // Adicionar marcador se solicitado
      if (showMarker) {
        const marker = new window.google.maps.Marker({
          position: location,
          map,
          title: title || address,
          animation: window.google.maps.Animation.DROP,
          icon: {
            url: "/icons/map-pin.svg",
            scaledSize: new window.google.maps.Size(40, 40),
          },
        });

        // InfoWindow com detalhes
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div class="p-2">
              <h3 class="font-semibold text-brand-brown-700">${title || "Localização"}</h3>
              <p class="text-sm text-gray-600">${address}</p>
              <div class="mt-2 flex gap-2">
                <a 
                  href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}" 
                  target="_blank" 
                  class="text-xs text-blue-600 hover:underline"
                >
                  Como chegar
                </a>
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}" 
                  target="_blank" 
                  class="text-xs text-blue-600 hover:underline"
                >
                  Ver no Google Maps
                </a>
              </div>
            </div>
          `,
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });
      }
    } catch (err) {
      console.error("Erro ao inicializar mapa:", err);
      setError("Não foi possível carregar o mapa para este endereço");
    }
  };

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div
            className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg"
            style={{ height }}
          >
            <div className="text-center">
              <div className="text-gray-400 mb-2">
                <svg
                  className="w-12 h-12 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-400">{error}</p>
              <p className="text-sm text-gray-500 mt-1">{address}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isLoaded) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div
            className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg"
            style={{ height }}
          >
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-brown-700 mx-auto mb-2"></div>
              <p className="text-gray-600 dark:text-gray-400">
                Carregando mapa...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-0">
        <div
          ref={mapRef}
          style={{ height, width: "100%" }}
          className="rounded-lg"
        />
      </CardContent>
    </Card>
  );
}

// Componente para busca de endereços
interface AddressSearchProps {
  onAddressSelect: (
    address: string,
    coordinates: { lat: number; lng: number },
  ) => void;
  placeholder?: string;
  className?: string;
}

export function AddressSearch({
  onAddressSelect,
  placeholder = "Digite o endereço...",
  className = "",
}: AddressSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      initializeAutocomplete();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY || "AIzaSyBs8TFTx6n8HvRG6J8W8zXZr2r7g5P8K8Q"}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setIsLoaded(true);
      initializeAutocomplete();
    };

    document.head.appendChild(script);
  }, []);

  const initializeAutocomplete = () => {
    if (!inputRef.current || !window.google) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["address"],
        componentRestrictions: { country: "br" },
        fields: ["formatted_address", "geometry"],
      },
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        onAddressSelect(place.formatted_address, {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
      }
    });
  };

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder={placeholder}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-brown-500 focus:border-transparent ${className}`}
      disabled={!isLoaded}
    />
  );
}

// Hook para usar coordenadas atuais
export function useCurrentLocation() {
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocalização não é suportada pelo navegador");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        setError("Erro ao obter localização: " + err.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      },
    );
  };

  return { location, error, loading, getCurrentLocation };
}
