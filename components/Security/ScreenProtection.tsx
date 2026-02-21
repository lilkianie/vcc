'use client';

import { useEffect, useState } from 'react';

interface ScreenProtectionProps {
    children: React.ReactNode;
    watermarkText?: string;
    enableProtection?: boolean;
}

export default function ScreenProtection({
    children,
    watermarkText = 'UB Virtual Campus',
    enableProtection = true
}: ScreenProtectionProps) {
    const [sessionId, setSessionId] = useState('');
    const [isMounted, setIsMounted] = useState(false);

    // Generate session ID only on client side to avoid hydration mismatch
    useEffect(() => {
        setSessionId(Math.random().toString(36).substring(7));
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!enableProtection || !isMounted) return;

        // Disable right-click context menu
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            return false;
        };

        // Disable common screenshot shortcuts
        const handleKeyDown = (e: KeyboardEvent) => {
            // Disable Print Screen, Ctrl+P, Cmd+Shift+3/4/5 (Mac screenshots)
            if (
                e.key === 'PrintScreen' ||
                (e.ctrlKey && e.key === 'p') ||
                (e.metaKey && e.shiftKey && ['3', '4', '5'].includes(e.key)) ||
                // Disable F12 (DevTools)
                e.key === 'F12' ||
                // Disable Ctrl+Shift+I (DevTools)
                (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                // Disable Ctrl+Shift+C (Inspect Element)
                (e.ctrlKey && e.shiftKey && e.key === 'C') ||
                // Disable Ctrl+U (View Source)
                (e.ctrlKey && e.key === 'u')
            ) {
                e.preventDefault();
                alert('This action is disabled for security purposes.');
                return false;
            }
        };

        // Detect screen recording (limited effectiveness)
        const detectScreenRecording = () => {
            // Check for common screen recording software indicators
            if (typeof navigator.mediaDevices !== 'undefined') {
                navigator.mediaDevices.enumerateDevices().then(devices => {
                    const hasScreenCapture = devices.some(device =>
                        device.label.toLowerCase().includes('screen') ||
                        device.label.toLowerCase().includes('capture')
                    );

                    if (hasScreenCapture) {
                        console.warn('Potential screen recording detected');
                        // Log to server for admin review
                        logSuspiciousActivity('screen_recording_detected');
                    }
                });
            }
        };

        // Blur content when window loses focus (user might be screenshotting)
        const handleVisibilityChange = () => {
            if (document.hidden) {
                document.body.style.filter = 'blur(10px)';
            } else {
                document.body.style.filter = 'none';
            }
        };

        // Disable text selection on sensitive content
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';

        // Add event listeners
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Run detection once
        detectScreenRecording();

        // Periodic check for screen recording
        const interval = setInterval(detectScreenRecording, 30000); // Every 30 seconds

        // Cleanup
        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.body.style.userSelect = 'auto';
            document.body.style.webkitUserSelect = 'auto';
            document.body.style.filter = 'none';
            clearInterval(interval);
        };
    }, [enableProtection, isMounted]);

    const logSuspiciousActivity = async (activityType: string) => {
        if (!sessionId) return;

        try {
            await fetch('/api/security/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    activityType,
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent
                })
            });
        } catch (error) {
            console.error('Failed to log activity:', error);
        }
    };

    if (!enableProtection) {
        return <>{children}</>;
    }

    // Prevent hydration mismatch - don't render watermark until client-side mounted
    if (!isMounted) {
        return <>{children}</>;
    }

    return (
        <div
            className="watermarked no-select"
            data-watermark={`${watermarkText} - Session: ${sessionId}`}
            style={{
                position: 'relative',
                width: '100%',
                height: '100%'
            }}
        >
            {children}

            {/* Visible watermark overlay */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    zIndex: 9998,
                    background: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 200px,
            rgba(0, 0, 0, 0.02) 200px,
            rgba(0, 0, 0, 0.02) 400px
          )`
                }}
            >
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%) rotate(-45deg)',
                    fontSize: '3rem',
                    color: 'rgba(0, 0, 0, 0.03)',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    userSelect: 'none'
                }}>
                    {watermarkText} - {sessionId}
                </div>
            </div>
        </div>
    );
}
