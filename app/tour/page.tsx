'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import ScreenProtection from '@/components/Security/ScreenProtection';
import Link from 'next/link';
import type { PanoramaNode, Hotspot } from '@/components/VirtualTour/PanoramaViewer';

// Dynamically import PanoramaViewer to avoid SSR issues
const PanoramaViewer = dynamic(
    () => import('@/components/VirtualTour/PanoramaViewer'),
    { ssr: false }
);

interface Location {
    id: string;
    name: string;
    imageUrl: string;
    description: string;
    videoUrl?: string;
    thumbnailUrl?: string;
    hotspots?: Hotspot[];
}

/** Convert a flat location list → PSV virtual-tour nodes with auto-generated links */
function locationsToNodes(locations: Location[]): PanoramaNode[] {
    return locations.map((loc, index) => ({
        id: loc.id,
        panorama: loc.imageUrl,
        thumbnail: loc.thumbnailUrl,
        name: loc.name,
        // Link each node to its neighbours. Provide yaw so PSV knows where to
        // draw the navigation arrow (manual positionMode requires explicit yaw).
        links: [
            ...(index > 0
                ? [{ nodeId: locations[index - 1].id, position: { yaw: '180deg' } }]
                : []),
            ...(index < locations.length - 1
                ? [{ nodeId: locations[index + 1].id, position: { yaw: '0deg' } }]
                : []),
        ],
        markers: loc.hotspots,
    }));
}

export default function VirtualTourPage() {
    const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
    const [locations, setLocations] = useState<Location[]>([]);
    const [nodes, setNodes] = useState<PanoramaNode[]>([]);

    // Load locations from configuration file
    useEffect(() => {
        fetch('/360-tours/locations.json')
            .then(res => res.json())
            .then(data => {
                const locs: Location[] = data.locations;
                setLocations(locs);
                setNodes(locationsToNodes(locs));
                if (locs.length > 0) setSelectedLocationId(locs[0].id);
            })
            .catch(() => {
                // Fallback sample data
                const fallbackLocations: Location[] = [
                    {
                        id: 'main-building',
                        name: 'Main Building',
                        imageUrl: 'https://photo-sphere-viewer-data.netlify.app/assets/tour/key-biscayne-1.jpg',
                        thumbnailUrl: 'https://photo-sphere-viewer-data.netlify.app/assets/tour/key-biscayne-1-thumb.jpg',
                        description: 'The historic main building houses administrative offices and lecture halls.',
                    },
                    {
                        id: 'dean-office',
                        name: 'Dean\'s Office',
                        imageUrl: 'https://photo-sphere-viewer-data.netlify.app/assets/tour/key-biscayne-2.jpg',
                        thumbnailUrl: 'https://photo-sphere-viewer-data.netlify.app/assets/tour/key-biscayne-2-thumb.jpg',
                        description: 'State-of-the-art library with extensive digital and physical collections.',
                    },
                    {
                        id: 'student-center',
                        name: 'Student Center',
                        imageUrl: 'https://photo-sphere-viewer-data.netlify.app/assets/tour/key-biscayne-3.jpg',
                        thumbnailUrl: 'https://photo-sphere-viewer-data.netlify.app/assets/tour/key-biscayne-3-thumb.jpg',
                        description: 'Hub for student activities, organizations, and social gatherings.',
                    },
                    {
                        id: 'cafeteria',
                        name: 'Campus Cafeteria',
                        imageUrl: 'https://photo-sphere-viewer-data.netlify.app/assets/tour/key-biscayne-4.jpg',
                        thumbnailUrl: 'https://photo-sphere-viewer-data.netlify.app/assets/tour/key-biscayne-4-thumb.jpg',
                        description: 'Modern dining facility serving a variety of cuisines.',
                    },
                ];
                setLocations(fallbackLocations);
                setNodes(locationsToNodes(fallbackLocations));
                setSelectedLocationId(fallbackLocations[0].id);
            });
    }, []);

    const selectedLocation = locations.find(l => l.id === selectedLocationId);

    return (
        <ScreenProtection watermarkText="UB Virtual Tour" enableProtection={true}>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">360° Virtual Tour</h1>
                                <p className="text-sm text-gray-600">Explore University of Bohol Campus</p>
                            </div>
                            <Link href="/" className="text-primary-600 hover:text-primary-700 font-medium">
                                ← Back to Home
                            </Link>
                        </div>
                    </div>
                </header>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Location List */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow p-4">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Locations</h2>
                                <div className="space-y-2">
                                    {locations.map((location) => (
                                        <button
                                            key={location.id}
                                            onClick={() => setSelectedLocationId(location.id)}
                                            className={`w-full text-left p-3 rounded-lg transition-all ${selectedLocationId === location.id
                                                ? 'bg-primary-100 border-2 border-primary-500'
                                                : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                                                }`}
                                        >
                                            <div className="font-medium text-gray-900">{location.name}</div>
                                            <div className="text-xs text-gray-600 mt-1">{location.description}</div>
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                    <h3 className="font-semibold text-blue-900 mb-2">Controls</h3>
                                    <ul className="text-sm text-blue-800 space-y-1">
                                        <li>• Drag to look around</li>
                                        <li>• Scroll to zoom</li>
                                        <li>• Click arrows to navigate</li>
                                        <li>• Use gallery to jump to a spot</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Panorama Viewer */}
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                {selectedLocation && (
                                    <div>
                                        <div className="p-4 border-b border-gray-200">
                                            <h2 className="text-xl font-bold text-gray-900">{selectedLocation.name}</h2>
                                            <p className="text-sm text-gray-600">{selectedLocation.description}</p>
                                        </div>
                                        <div style={{ height: '600px' }}>
                                            {nodes.length > 0 && (
                                                <PanoramaViewer
                                                    nodes={nodes}
                                                    defaultNodeId={selectedLocationId ?? undefined}
                                                    caption={`University of Bohol — ${selectedLocation.name}`}
                                                    autoRotate={false}
                                                    onNodeChange={(nodeId) => setSelectedLocationId(nodeId)}
                                                    onHotspotClick={(hotspot) => {
                                                        if (hotspot.type === 'link' && hotspot.targetId) {
                                                            setSelectedLocationId(hotspot.targetId);
                                                        }
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Info Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                <div className="bg-white p-4 rounded-lg shadow">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-100 p-2 rounded-lg">
                                            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-600">Total Views</div>
                                            <div className="text-lg font-bold text-gray-900">2,547</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-4 rounded-lg shadow">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-green-100 p-2 rounded-lg">
                                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-600">Locations</div>
                                            <div className="text-lg font-bold text-gray-900">{locations.length}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-4 rounded-lg shadow">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-purple-100 p-2 rounded-lg">
                                            <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-600">Buildings</div>
                                            <div className="text-lg font-bold text-gray-900">15</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ScreenProtection>
    );
}
