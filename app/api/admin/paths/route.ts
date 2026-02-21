import { NextRequest, NextResponse } from 'next/server';

// Path management endpoint for admin
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { pathId, status } = body;

        // In production, this would update the database
        console.log('Path Status Update:', { pathId, status });

        // Validate status
        if (!['open', 'closed', 'construction'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        // Here you would:
        // 1. Update path status in database
        // 2. Trigger route recalculation for affected routes
        // 3. Notify active users of path changes

        return NextResponse.json({
            success: true,
            pathId,
            newStatus: status,
            message: 'Path status updated successfully'
        });
    } catch (error) {
        console.error('Path update error:', error);
        return NextResponse.json({ error: 'Failed to update path' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        // In production, fetch from database
        const paths = [
            { id: '1', name: 'Main Building to Library', from: 'Main Building', to: 'Library', status: 'open', distance: 150 },
            { id: '2', name: 'Library to Student Center', from: 'Library', to: 'Student Center', status: 'open', distance: 200 },
            { id: '3', name: 'Student Center to Cafeteria', from: 'Student Center', to: 'Cafeteria', status: 'construction', distance: 120 },
            { id: '4', name: 'Cafeteria to Sports Complex', from: 'Cafeteria', to: 'Sports Complex', status: 'open', distance: 300 },
        ];

        return NextResponse.json({ paths });
    } catch (error) {
        console.error('Path fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch paths' }, { status: 500 });
    }
}
