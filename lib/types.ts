// Database Models and Types

export interface Building {
    _id: string;
    name: string;
    code: string;
    description: string;
    location: {
        lat: number;
        lng: number;
    };
    category: 'academic' | 'administrative' | 'facility' | 'landmark';
    imageUrl: string;
    panoramaUrl?: string;
    departments?: string[];
    floors?: number;
    accessibility: boolean;
    operatingHours?: string;
    isSensitive: boolean; // Hide from public view
}

export interface Path {
    _id: string;
    name: string;
    points: Array<{ lat: number; lng: number }>;
    from: string; // Building ID
    to: string; // Building ID
    distance: number; // in meters
    status: 'open' | 'closed' | 'construction';
    isAccessible: boolean;
    estimatedTime: number; // in minutes
    closureReason?: string;
    closedUntil?: Date;
}

export interface Resource {
    _id: string;
    name: string;
    category: 'office' | 'service' | 'facility' | 'department';
    buildingId: string;
    floor?: number;
    room?: string;
    description: string;
    contact?: {
        phone?: string;
        email?: string;
    };
    hours?: string;
    imageUrl?: string;
    isSensitive: boolean;
}

export interface User {
    _id: string;
    email: string;
    password: string; // hashed
    role: 'public' | 'student' | 'staff' | 'admin';
    firstName?: string;
    lastName?: string;
    studentId?: string;
    createdAt: Date;
    lastLogin?: Date;
}

export interface ActivityLog {
    _id: string;
    userId?: string;
    sessionId: string;
    action: string;
    resource?: string;
    ipAddress: string;
    userAgent: string;
    timestamp: Date;
    isSuspicious: boolean;
}

export interface PanoramaLocation {
    _id: string;
    buildingId: string;
    name: string;
    imageUrl: string;
    type: '360-photo' | '360-video';
    position: {
        lat: number;
        lng: number;
        floor?: number;
    };
    hotspots: Array<{
        pitch: number;
        yaw: number;
        type: 'info' | 'link';
        text: string;
        targetId?: string; // Link to another panorama
    }>;
    requiresAuth: boolean;
}

// Graph node for pathfinding
export interface GraphNode {
    id: string;
    buildingId: string;
    position: { lat: number; lng: number };
    connections: Array<{
        nodeId: string;
        distance: number;
        pathId: string;
        isAvailable: boolean;
    }>;
}
