import type { Metadata } from 'next'
import './globals.css'
import '@photo-sphere-viewer/core/index.css'
import '@photo-sphere-viewer/markers-plugin/index.css'
import '@photo-sphere-viewer/gallery-plugin/index.css'
import '@photo-sphere-viewer/virtual-tour-plugin/index.css'

export const metadata: Metadata = {
    title: 'Virtual Campus Companion - University of Bohol',
    description: 'Interactive virtual tour and navigation system for University of Bohol campus',
    keywords: 'University of Bohol, campus tour, virtual guide, navigation, interactive map',
    authors: [{ name: 'University of Bohol' }],
    robots: 'noindex, nofollow', // Security: Prevent search engine indexing
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
            </head>
            <body className="antialiased">
                {children}
            </body>
        </html>
    )
}
