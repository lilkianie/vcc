'use client';

import { useState } from 'react';
import Link from 'next/link';
import ScreenProtection from '@/components/Security/ScreenProtection';

interface Resource {
    id: string;
    name: string;
    category: 'office' | 'service' | 'facility' | 'department';
    building: string;
    floor?: number;
    room?: string;
    description: string;
    contact?: {
        phone?: string;
        email?: string;
    };
    hours?: string;
}

export default function ResourcesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const resources: Resource[] = [
        {
            id: '1',
            name: 'Registrar\'s Office',
            category: 'office',
            building: 'Admin Building',
            floor: 1,
            room: '101',
            description: 'Student records, enrollment, and academic documentation',
            contact: { phone: '(038) 411-3111', email: 'registrar@universityofbohol.edu.ph' },
            hours: 'Mon-Fri: 8:00 AM - 5:00 PM'
        },
        {
            id: '2',
            name: 'University Library',
            category: 'facility',
            building: 'Library Building',
            floor: 2,
            description: 'Main library with extensive book collection and digital resources',
            contact: { email: 'library@universityofbohol.edu.ph' },
            hours: 'Mon-Fri: 8:00 AM - 5:00 PM'
        },
        {
            id: '3',
            name: 'Student Affairs Office',
            category: 'office',
            building: 'Student Center',
            floor: 1,
            room: '105',
            description: 'Student services, organizations, and activities',
            contact: { phone: '(038) 411-3112', email: 'studentaffairs@universityofbohol.edu.ph' },
            hours: 'Mon-Fri: 8:00 AM - 5:00 PM'
        },
        {
            id: '4',
            name: 'College of Engineering, Technology, Architecture, and Fine Arts',
            category: 'department',
            building: 'Achievers Building for Engineering and Technology and Gym Building for Architecture and Fine Arts',
            floor: 3,
            room: '301',
            description: 'Engineering, Technology, Architecture, and Fine Arts programs',
            contact: { email: 'cs@universityofbohol.edu.ph' },
            hours: 'Mon-Fri: 8:00 AM - 5:00 PM'
        },
        {
            id: '5',
            name: 'Medical Clinic',
            category: 'service',
            building: 'Achievers Building',
            floor: 1,
            room: '110',
            description: 'Basic medical services and first aid',
            contact: { phone: '(038) 411-3113' },
            hours: 'Mon-Fri: 8:00 AM - 5:00 PM'
        },
        {
            id: '6',
            name: 'Cafeteria',
            category: 'facility',
            building: 'Cafeteria Building',
            floor: 1,
            description: 'Main dining facility with various food options',
            hours: 'Mon-Sat: 7:00 AM - 7:00 PM'
        },
        {
            id: '7',
            name: 'Accounting Office',
            category: 'office',
            building: 'Main Building',
            floor: 1,
            room: '102',
            description: 'Tuition payments and financial services',
            contact: { phone: '(038) 411-3114', email: 'accounting@universityofbohol.edu.ph' },
            hours: 'Mon-Fri: 8:00 AM - 5:00 PM'
        },
        {
            id: '8',
            name: 'Sports Complex',
            category: 'facility',
            building: 'Sports Complex',
            description: 'Gymnasium, courts, and athletic facilities',
            hours: 'Mon-Sun: 6:00 AM - 8:00 PM'
        },
    ];

    const categories = [
        { value: 'all', label: 'All Resources', icon: '📋' },
        { value: 'office', label: 'Offices', icon: '🏢' },
        { value: 'department', label: 'Departments', icon: '🎓' },
        { value: 'facility', label: 'Facilities', icon: '🏛️' },
        { value: 'service', label: 'Services', icon: '🔧' },
    ];

    const filteredResources = resources.filter(resource => {
        const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resource.building.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'office': return 'bg-blue-100 text-blue-800';
            case 'department': return 'bg-purple-100 text-purple-800';
            case 'facility': return 'bg-green-100 text-green-800';
            case 'service': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <ScreenProtection watermarkText="UB Resources" enableProtection={true}>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Campus Resources</h1>
                                <p className="text-sm text-gray-600">Find offices, facilities, and services</p>
                            </div>
                            <Link href="/" className="text-primary-600 hover:text-primary-700 font-medium">
                                ← Back to Home
                            </Link>
                        </div>
                    </div>
                </header>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Search and Filter */}
                    <div className="bg-white rounded-lg shadow p-6 mb-8">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search resources..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>

                            <div className="flex gap-2 overflow-x-auto">
                                {categories.map(cat => (
                                    <button
                                        key={cat.value}
                                        onClick={() => setSelectedCategory(cat.value)}
                                        className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${selectedCategory === cat.value
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {cat.icon} {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-4 text-sm text-gray-600">
                            Showing {filteredResources.length} of {resources.length} resources
                        </div>
                    </div>

                    {/* Resource Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredResources.map(resource => (
                            <div key={resource.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-lg font-bold text-gray-900">{resource.name}</h3>
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(resource.category)}`}>
                                        {resource.category}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-600 mb-4">{resource.description}</p>

                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                                        </svg>
                                        <span>{resource.building}{resource.floor ? `, Floor ${resource.floor}` : ''}{resource.room ? `, Room ${resource.room}` : ''}</span>
                                    </div>

                                    {resource.hours && (
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                            </svg>
                                            <span>{resource.hours}</span>
                                        </div>
                                    )}

                                    {resource.contact?.phone && (
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                            </svg>
                                            <span>{resource.contact.phone}</span>
                                        </div>
                                    )}

                                    {resource.contact?.email && (
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                            </svg>
                                            <span className="truncate">{resource.contact.email}</span>
                                        </div>
                                    )}
                                </div>

                                <button className="mt-4 w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
                                    View on Map
                                </button>
                            </div>
                        ))}
                    </div>

                    {filteredResources.length === 0 && (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-gray-600">No resources found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>
        </ScreenProtection>
    );
}
