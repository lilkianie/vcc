'use client';

import { useState } from 'react';
import Link from 'next/link';
import ScreenProtection from '@/components/Security/ScreenProtection';

interface PathStatus {
    id: string;
    name: string;
    from: string;
    to: string;
    status: 'open' | 'closed' | 'construction';
    distance: number;
}

export default function AdminDashboard() {
    const [paths, setPaths] = useState<PathStatus[]>([
        { id: '1', name: 'Main Building to Library', from: 'Main Building', to: 'Library', status: 'open', distance: 150 },
        { id: '2', name: 'Library to Student Center', from: 'Library', to: 'Student Center', status: 'open', distance: 200 },
        { id: '3', name: 'Student Center to Cafeteria', from: 'Student Center', to: 'Cafeteria', status: 'construction', distance: 120 },
        { id: '4', name: 'Cafeteria to Sports Complex', from: 'Cafeteria', to: 'Sports Complex', status: 'open', distance: 300 },
    ]);

    const [stats] = useState({
        totalVisitors: 1247,
        activeUsers: 23,
        totalBuildings: 15,
        totalPaths: 42,
        closedPaths: 3,
    });

    const updatePathStatus = async (pathId: string, newStatus: 'open' | 'closed' | 'construction') => {
        // Update local state
        setPaths(paths.map(path =>
            path.id === pathId ? { ...path, status: newStatus } : path
        ));

        // In production, this would call an API
        try {
            await fetch('/api/admin/paths', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pathId, status: newStatus })
            });
        } catch (error) {
            console.error('Failed to update path status:', error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open': return 'bg-green-100 text-green-800';
            case 'closed': return 'bg-red-100 text-red-800';
            case 'construction': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <ScreenProtection watermarkText="UB Admin Panel" enableProtection={true}>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                                <p className="text-sm text-gray-600">Virtual Campus Companion Management</p>
                            </div>
                            <Link href="/" className="text-primary-600 hover:text-primary-700 font-medium">
                                ← Back to Campus
                            </Link>
                        </div>
                    </div>
                </header>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Visitors</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.totalVisitors}</p>
                                </div>
                                <div className="bg-blue-100 p-3 rounded-lg">
                                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Active Users</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
                                </div>
                                <div className="bg-green-100 p-3 rounded-lg">
                                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Buildings</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.totalBuildings}</p>
                                </div>
                                <div className="bg-purple-100 p-3 rounded-lg">
                                    <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Paths</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.totalPaths}</p>
                                </div>
                                <div className="bg-indigo-100 p-3 rounded-lg">
                                    <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Closed Paths</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.closedPaths}</p>
                                </div>
                                <div className="bg-red-100 p-3 rounded-lg">
                                    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Path Management */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">Path Management</h2>
                            <p className="text-sm text-gray-600">Manage campus paths and update their status</p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Path Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distance</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {paths.map((path) => (
                                        <tr key={path.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{path.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{path.from}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{path.to}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{path.distance}m</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(path.status)}`}>
                                                    {path.status.charAt(0).toUpperCase() + path.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <select
                                                    value={path.status}
                                                    onChange={(e) => updatePathStatus(path.id, e.target.value as any)}
                                                    className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                >
                                                    <option value="open">Open</option>
                                                    <option value="construction">Construction</option>
                                                    <option value="closed">Closed</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        <button className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow text-left">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-100 p-3 rounded-lg">
                                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Add New Building</h3>
                                    <p className="text-sm text-gray-600">Add a new campus building</p>
                                </div>
                            </div>
                        </button>

                        <button className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow text-left">
                            <div className="flex items-center gap-4">
                                <div className="bg-green-100 p-3 rounded-lg">
                                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">View Analytics</h3>
                                    <p className="text-sm text-gray-600">Check usage statistics</p>
                                </div>
                            </div>
                        </button>

                        <button className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow text-left">
                            <div className="flex items-center gap-4">
                                <div className="bg-purple-100 p-3 rounded-lg">
                                    <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Security Logs</h3>
                                    <p className="text-sm text-gray-600">Review security events</p>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </ScreenProtection>
    );
}
