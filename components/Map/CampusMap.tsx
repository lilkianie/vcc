'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Building {
    id: string;
    name: string;
    position: [number, number];
    category: string;
}

interface PathData {
    id: string;
    points: Array<[number, number]>;
    status: 'open' | 'closed' | 'construction';
}

interface CampusMapProps {
    buildings: Building[];
    paths: PathData[];
    selectedRoute?: Array<[number, number]>;
    onBuildingClick?: (buildingId: string) => void;
    center?: [number, number];
    zoom?: number;
}

export default function CampusMap({
    buildings,
    paths,
    selectedRoute,
    onBuildingClick,
    center = [9.8500, 123.9167], // University of Bohol approximate coordinates
    zoom = 17
}: CampusMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined' || !mapRef.current || mapInstanceRef.current) return;

        // Initialize map
        const map = L.map(mapRef.current).setView(center, zoom);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
        }).addTo(map);

        mapInstanceRef.current = map;
        setIsLoaded(true);

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [center, zoom]);

    // Add building markers
    useEffect(() => {
        if (!mapInstanceRef.current || !isLoaded) return;

        const markers: L.Marker[] = [];

        buildings.forEach(building => {
            const icon = L.divIcon({
                className: 'custom-marker',
                html: `
          <div class="bg-primary-600 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clip-rule="evenodd" />
            </svg>
          </div>
        `,
                iconSize: [40, 40],
                iconAnchor: [20, 20],
            });

            const marker = L.marker(building.position, { icon })
                .addTo(mapInstanceRef.current!)
                .bindPopup(`<strong>${building.name}</strong><br/>${building.category}`)
                .on('click', () => {
                    if (onBuildingClick) {
                        onBuildingClick(building.id);
                    }
                });

            markers.push(marker);
        });

        return () => {
            markers.forEach(marker => marker.remove());
        };
    }, [buildings, isLoaded, onBuildingClick]);

    // Add paths
    useEffect(() => {
        if (!mapInstanceRef.current || !isLoaded) return;

        const pathLayers: L.Polyline[] = [];

        paths.forEach(path => {
            const color =
                path.status === 'open' ? '#10b981' :
                    path.status === 'construction' ? '#f59e0b' :
                        '#ef4444';

            const polyline = L.polyline(path.points, {
                color,
                weight: 4,
                opacity: 0.7,
                dashArray: path.status !== 'open' ? '10, 10' : undefined
            }).addTo(mapInstanceRef.current!);

            pathLayers.push(polyline);
        });

        return () => {
            pathLayers.forEach(layer => layer.remove());
        };
    }, [paths, isLoaded]);

    // Add selected route
    useEffect(() => {
        if (!mapInstanceRef.current || !isLoaded || !selectedRoute) return;

        const routeLayer = L.polyline(selectedRoute, {
            color: '#3b82f6',
            weight: 6,
            opacity: 0.8,
        }).addTo(mapInstanceRef.current);

        // Fit map to route bounds
        mapInstanceRef.current.fitBounds(routeLayer.getBounds(), { padding: [50, 50] });

        return () => {
            routeLayer.remove();
        };
    }, [selectedRoute, isLoaded]);

    return (
        <div className="relative w-full h-full">
            <div ref={mapRef} className="w-full h-full rounded-lg shadow-lg" style={{ minHeight: '500px' }} />

            {/* Legend */}
            <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg z-[1000]">
                <h3 className="font-semibold mb-2 text-sm">Path Status</h3>
                <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-1 bg-green-500"></div>
                        <span>Open</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-1 bg-yellow-500" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #f59e0b, #f59e0b 5px, transparent 5px, transparent 10px)' }}></div>
                        <span>Construction</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-1 bg-red-500" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #ef4444, #ef4444 5px, transparent 5px, transparent 10px)' }}></div>
                        <span>Closed</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
