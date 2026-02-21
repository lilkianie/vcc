'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ScreenProtection from '@/components/Security/ScreenProtection';

export default function HomePage() {
    const [searchQuery, setSearchQuery] = useState('');

    const features = [
        {
            title: '360° Virtual Tours',
            description: 'Explore campus buildings with immersive 360° panoramic views',
            icon: '🏛️',
            href: '/tour',
            gradient: 'from-blue-500 to-cyan-500'
        },
        {
            title: 'Interactive Map',
            description: 'Navigate the campus with our detailed interactive map',
            icon: '🗺️',
            href: '/map',
            gradient: 'from-purple-500 to-pink-500'
        },
        {
            title: 'Smart Routing',
            description: 'Get personalized routes with real-time path availability',
            icon: '🧭',
            href: '/navigate',
            gradient: 'from-green-500 to-emerald-500'
        },
        {
            title: 'Resource Directory',
            description: 'Find offices, facilities, and services across campus',
            icon: '📚',
            href: '/resources',
            gradient: 'from-orange-500 to-red-500'
        }
    ];

    const quickLinks = [
        { name: 'Main Building', href: '/tour?building=main' },
        { name: 'Library', href: '/tour?building=library' },
        { name: 'Student Center', href: '/tour?building=student-center' },
        { name: 'Cafeteria', href: '/tour?building=cafeteria' },
    ];

    return (
        <ScreenProtection watermarkText="UB Virtual Campus" enableProtection={true}>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
                {/* Header */}
                <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Image
                                    src="/logo.png"
                                    alt="University of Bohol Logo"
                                    width={48}
                                    height={48}
                                    className="rounded-lg"
                                    priority
                                />
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">Virtual Campus Companion</h1>
                                    <p className="text-sm text-gray-600">University of Bohol</p>
                                </div>
                            </div>

                            <nav className="hidden md:flex items-center gap-6">
                                <Link href="/tour" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
                                    Virtual Tour
                                </Link>
                                <Link href="/map" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
                                    Campus Map
                                </Link>
                                <Link href="/resources" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
                                    Resources
                                </Link>
                                <Link href="/admin" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                                    Admin
                                </Link>
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative overflow-hidden py-20 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-12 animate-fade-in">
                            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                                Explore University of Bohol
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600 mt-2">
                                    Like Never Before
                                </span>
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Your intelligent guide to navigating campus with 360° virtual tours,
                                interactive maps, and personalized routing.
                            </p>
                        </div>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto mb-16 animate-slide-up">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search for buildings, offices, or facilities..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-6 py-4 pr-12 rounded-full border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-lg shadow-lg"
                                />
                                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-600 text-white p-3 rounded-full hover:bg-primary-700 transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Feature Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                            {features.map((feature, index) => (
                                <Link
                                    key={index}
                                    href={feature.href}
                                    className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`}></div>

                                    <div className="relative">
                                        <div className="text-5xl mb-4">{feature.icon}</div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                                        <p className="text-gray-600">{feature.description}</p>

                                        <div className="mt-4 flex items-center text-primary-600 font-semibold group-hover:gap-2 transition-all">
                                            <span>Explore</span>
                                            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Quick Links */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Popular Destinations</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {quickLinks.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.href}
                                        className="flex items-center gap-2 p-4 rounded-lg border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-all group"
                                    >
                                        <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="font-medium text-gray-700 group-hover:text-primary-700">{link.name}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-primary-200 rounded-full blur-3xl opacity-20"></div>
                    <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-accent-200 rounded-full blur-3xl opacity-20"></div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-8 mt-20">
                    <div className="max-w-7xl mx-auto px-4 text-center">
                        <p className="text-gray-400">
                            © 2026 University of Bohol. Virtual Campus Companion System.
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            For educational and navigational purposes only.
                        </p>
                    </div>
                </footer>
            </div>
        </ScreenProtection>
    );
}
