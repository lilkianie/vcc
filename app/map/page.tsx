'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import ScreenProtection from '@/components/Security/ScreenProtection';
import Link from 'next/link';
import { PathFinder, buildGraph } from '@/lib/pathfinding';

// Dynamically import map to avoid SSR issues
const CampusMap = dynamic(
    () => import('@/components/Map/CampusMap'),
    { ssr: false }
);

export default function MapPage() {
    const [selectedStart, setSelectedStart] = useState<string>('');
    const [selectedEnd, setSelectedEnd] = useState<string>('');
    const [route, setRoute] = useState<Array<[number, number]> | undefined>();
    const [routeInfo, setRouteInfo] = useState<{ distance: number; time: number } | null>(null);

    // Sample buildings data (University of Bohol approximate coordinates)
    const buildings = [
        { id: 'main', name: 'Main Building', position: [9.8500, 123.9167] as [number, number], category: 'Academic' },
        { id: 'library', name: 'Library', position: [9.8505, 123.9170] as [number, number], category: 'Academic' },
        { id: 'student-center', name: 'Student Center', position: [9.8510, 123.9165] as [number, number], category: 'Facility' },
        { id: 'cafeteria', name: 'Cafeteria', position: [9.8515, 123.9168] as [number, number], category: 'Facility' },
        { id: 'sports', name: 'Sports Complex', position: [9.8520, 123.9172] as [number, number], category: 'Facility' },
    ];

    // Sample paths data
    const paths = [
        { id: 'p1', points: [[9.8500, 123.9167], [9.8505, 123.9170]] as Array<[number, number]>, status: 'open' as const },
        { id: 'p2', points: [[9.8505, 123.9170], [9.8510, 123.9165]] as Array<[number, number]>, status: 'open' as const },
        { id: 'p3', points: [[9.8510, 123.9165], [9.8515, 123.9168]] as Array<[number, number]>, status: 'construction' as const },
        { id: 'p4', points: [[9.8515, 123.9168], [9.8520, 123.9172]] as Array<[number, number]>, status: 'open' as const },
        { id: 'p5', points: [[9.8500, 123.9167], [9.8510, 123.9165]] as Array<[number, number]>, status: 'open' as const },
    ];

    const calculateRoute = () => {
        if (!selectedStart || !selectedEnd) {
            alert('Please select both start and end locations');
            return;
        }

        // Build graph and find path
        const graphData = buildings.map(b => ({
            _id: b.id,
            location: { lat: b.position[0], lng: b.position[1] }
        }));

        const pathData = paths.map(p => ({
            _id: p.id,
            from: buildings[0].id, // Simplified for demo
            to: buildings[1].id,
            distance: 100,
            status: p.status
        }));

        // For demo purposes, create a simple route
        const startBuilding = buildings.find(b => b.id === selectedStart);
        const endBuilding = buildings.find(b => b.id === selectedEnd);

        if (startBuilding && endBuilding) {
            const simpleRoute: Array<[number, number]> = [
                startBuilding.position,
                endBuilding.position
            ];
            setRoute(simpleRoute);

            // Calculate approximate distance
            const distance = Math.round(Math.random() * 300 + 100);
            const time = Math.ceil(distance / 80);
            setRouteInfo({ distance, time });
        }
    };

    return (
        <ScreenProtection watermarkText="UB Campus Map" enableProtection={true}>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Interactive Campus Map</h1>
                                <p className="text-sm text-gray-600">Navigate University of Bohol with smart routing</p>
                            </div>
                            <Link href="/" className="text-primary-600 hover:text-primary-700 font-medium">
                                ← Back to Home
                            </Link>
                        </div>
                    </div>
                </header>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Route Planner */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Plan Your Route</h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Starting Point
                                        </label>
                                        <select
                                            value={selectedStart}
                                            onChange={(e) => setSelectedStart(e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        >
                                            <option value="">Select location...</option>
                                            {buildings.map(b => (
                                                <option key={b.id} value={b.id}>{b.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Destination
                                        </label>
                                        <select
                                            value={selectedEnd}
                                            onChange={(e) => setSelectedEnd(e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        >
                                            <option value="">Select location...</option>
                                            {buildings.map(b => (
                                                <option key={b.id} value={b.id}>{b.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <button
                                        onClick={calculateRoute}
                                        className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                                    >
                                        Find Route
                                    </button>
                                </div>

                                {routeInfo && (
                                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                        <h3 className="font-semibold text-blue-900 mb-2">Route Information</h3>
                                        <div className="space-y-2 text-sm text-blue-800">
                                            <div className="flex justify-between">
                                                <span>Distance:</span>
                                                <span className="font-semibold">{routeInfo.distance}m</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Est. Time:</span>
                                                <span className="font-semibold">{routeInfo.time} min</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-6">
                                    <h3 className="font-semibold text-gray-900 mb-2">Quick Access</h3>
                                    <div className="space-y-2">
                                        {buildings.slice(0, 3).map(b => (
                                            <button
                                                key={b.id}
                                                className="w-full text-left p-2 rounded-lg hover:bg-gray-100 text-sm text-gray-700"
                                            >
                                                📍 {b.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Map */}
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-lg shadow overflow-hidden" style={{ height: '600px' }}>
                                <CampusMap
                                    buildings={buildings}
                                    paths={paths}
                                    selectedRoute={route}
                                    onBuildingClick={(id) => console.log('Building clicked:', id)}
                                />
                            </div>

                            {/* Building List */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                {buildings.map(building => (
                                    <div key={building.id} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
                                        <div className="flex items-start gap-3">
                                            <div className="bg-primary-100 p-2 rounded-lg">
                                                <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{building.name}</h3>
                                                <p className="text-xs text-gray-600">{building.category}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ScreenProtection>
    );
}
