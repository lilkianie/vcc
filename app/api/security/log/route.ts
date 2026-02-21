import { NextRequest, NextResponse } from 'next/server';

// Security activity logging endpoint
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { sessionId, activityType, timestamp, userAgent } = body;

        // In production, this would save to a database
        console.log('Security Log:', {
            sessionId,
            activityType,
            timestamp,
            userAgent,
            ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
        });

        // Check for suspicious patterns
        const isSuspicious = detectSuspiciousActivity(activityType);

        if (isSuspicious) {
            // Alert admin (in production, send email/notification)
            console.warn('SUSPICIOUS ACTIVITY DETECTED:', activityType);
        }

        return NextResponse.json({
            success: true,
            logged: true,
            flagged: isSuspicious
        });
    } catch (error) {
        console.error('Security logging error:', error);
        return NextResponse.json({ error: 'Failed to log activity' }, { status: 500 });
    }
}

function detectSuspiciousActivity(activityType: string): boolean {
    const suspiciousPatterns = [
        'screen_recording_detected',
        'rapid_navigation',
        'bulk_download_attempt',
        'unauthorized_access_attempt'
    ];

    return suspiciousPatterns.some(pattern => activityType.includes(pattern));
}
