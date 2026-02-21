'use client';

import { useEffect, useRef } from 'react';
import type { Viewer } from '@photo-sphere-viewer/core';
import type { VirtualTourPlugin } from '@photo-sphere-viewer/virtual-tour-plugin';

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

export interface Hotspot {
    pitch: number;
    yaw: number;
    type: 'info' | 'link';
    text: string;
    targetId?: string;
}

/** A single stop in a virtual tour */
export interface PanoramaNode {
    id: string;
    /** Full-resolution equirectangular image URL */
    panorama: string;
    thumbnail?: string;
    name?: string;
    /** Links to other nodes shown as navigation arrows */
    links?: Array<{ nodeId: string; position?: { yaw: string | number; pitch?: string | number } }>;
    /** [longitude, latitude, altitude] — used for GPS positioning */
    gps?: [number, number, number];
    panoData?: { poseHeading?: number };
    markers?: Hotspot[];
}

export interface PanoramaViewerProps {
    /* ---- single-panorama mode ---- */
    imageUrl?: string;
    hotspots?: Hotspot[];
    onHotspotClick?: (hotspot: Hotspot) => void;
    autoRotate?: boolean;

    /* ---- virtual-tour mode ---- */
    nodes?: PanoramaNode[];
    defaultNodeId?: string;
    onNodeChange?: (nodeId: string) => void;

    /** Initial horizontal angle (degrees) */
    defaultYaw?: string | number;
    /** Caption shown in the navbar */
    caption?: string;
}

/* ------------------------------------------------------------------ */
/*  Helper – convert legacy Hotspot → PSV marker descriptor            */
/* ------------------------------------------------------------------ */

function hotspotToMarker(h: Hotspot, index: number, onHotspotClick?: (h: Hotspot) => void) {
    return {
        id: `hotspot-${index}`,
        position: { yaw: `${h.yaw}deg`, pitch: `${h.pitch}deg` },
        html: `<div class="psv-hotspot psv-hotspot--${h.type}">${h.type === 'info' ? '📍' : '🔗'} ${h.text}</div>`,
        anchor: 'bottom center' as const,
        tooltip: h.text,
        data: h,
    };
}

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

export default function PanoramaViewer({
    imageUrl,
    hotspots = [],
    onHotspotClick,
    autoRotate = false,
    nodes,
    defaultNodeId,
    onNodeChange,
    defaultYaw = '0deg',
    caption,
}: PanoramaViewerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<Viewer | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        /* PSV must be imported dynamically — it uses browser APIs */
        let destroyed = false;

        (async () => {
            const { Viewer } = await import('@photo-sphere-viewer/core');
            const { MarkersPlugin } = await import('@photo-sphere-viewer/markers-plugin');
            const { GalleryPlugin } = await import('@photo-sphere-viewer/gallery-plugin');
            const { VirtualTourPlugin } = await import('@photo-sphere-viewer/virtual-tour-plugin');

            if (destroyed || !containerRef.current) return;

            const isVirtualTour = nodes && nodes.length > 0;

            /* ---------- build plugin list ---------- */
            const plugins: any[] = [MarkersPlugin];

            if (isVirtualTour) {
                plugins.push([
                    GalleryPlugin,
                    { thumbnailSize: { width: 100, height: 100 } },
                ]);
                plugins.push([
                    VirtualTourPlugin,
                    {
                        positionMode: 'manual',
                        renderMode: '3d',
                    },
                ]);
            }

            /* ---------- determine panorama ---------- */
            const panorama = isVirtualTour
                ? nodes![0].panorama          // overridden by setNodes below
                : (imageUrl ?? '');

            /* ---------- navbar ---------- */
            const navbar = [
                'zoom',
                'move',
                ...(isVirtualTour ? ['gallery'] : []),
                'caption',
                'fullscreen',
            ];

            /* ---------- create viewer ---------- */
            const viewer = new Viewer({
                container: containerRef.current!,
                panorama,
                caption: caption ?? '',
                touchmoveTwoFingers: true,
                mousewheelCtrlKey: false,
                defaultYaw,
                navbar,
                plugins,
            });

            viewerRef.current = viewer;

            /* ---------- markers (single-image mode) ---------- */
            if (!isVirtualTour && hotspots.length > 0) {
                viewer.addEventListener('ready', () => {
                    const markersPlugin = viewer.getPlugin<InstanceType<typeof MarkersPlugin>>(MarkersPlugin as any);
                    if (!markersPlugin) return;

                    hotspots.forEach((h, i) => {
                        markersPlugin.addMarker(hotspotToMarker(h, i, onHotspotClick) as any);
                    });

                    markersPlugin.addEventListener('select-marker', ({ marker }: any) => {
                        if (marker.data && onHotspotClick) {
                            onHotspotClick(marker.data as Hotspot);
                        }
                    });
                }, { once: true });
            }

            /* ---------- virtual tour setup ---------- */
            if (isVirtualTour) {
                viewer.addEventListener('ready', () => {
                    const virtualTour = viewer.getPlugin<InstanceType<typeof VirtualTourPlugin>>(VirtualTourPlugin as any);
                    if (!virtualTour) return;

                    /* Build PSV node list from our PanoramaNode format */
                    const psvNodes = nodes!.map((n) => ({
                        id: n.id,
                        panorama: n.panorama,
                        thumbnail: n.thumbnail,
                        name: n.name,
                        links: n.links?.map((l, li) => {
                            // PSV manual mode requires every link to have a position.
                            // Fall back to evenly-spread yaw angles when none is given.
                            const totalLinks = n.links?.length ?? 1;
                            const fallbackYaw = (li / totalLinks) * 2 * Math.PI;
                            return {
                                nodeId: l.nodeId,
                                position: l.position
                                    ? { yaw: l.position.yaw, pitch: l.position.pitch ?? 0 }
                                    : { yaw: fallbackYaw, pitch: 0 },
                            };
                        }) ?? [],
                        gps: n.gps,
                        panoData: n.panoData,
                        markers: n.markers?.map((h, i) =>
                            hotspotToMarker(h, i, onHotspotClick)
                        ),
                    }));

                    virtualTour.setNodes(psvNodes as any, defaultNodeId ?? nodes![0].id);

                    /* Fire onNodeChange callback when user navigates */
                    (virtualTour as any).addEventListener('node-changed', ({ node }: any) => {
                        onNodeChange?.(node.id);
                    });
                }, { once: true });
            }

            /* ---------- auto-rotate ---------- */
            if (autoRotate) {
                viewer.addEventListener('ready', () => {
                    viewer.setOption('autorotateSpeed' as any, '2rpm');
                }, { once: true });
            }
        })();

        return () => {
            destroyed = true;
            if (viewerRef.current) {
                viewerRef.current.destroy();
                viewerRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // mount once — prop updates handled below

    /* ---------- live prop updates after mount ---------- */
    useEffect(() => {
        const viewer = viewerRef.current;
        if (!viewer) return;

        const isVirtualTour = nodes && nodes.length > 0;

        if (isVirtualTour) {
            /* nothing to do — tour data is set on init */
        } else if (imageUrl) {
            viewer.setPanorama(imageUrl).catch(console.error);
        }
    }, [imageUrl, nodes]);

    return (
        <>
            {/* Inline overrides so PSV fills its container */}
            <style>{`
                .psv-container {
                    width: 100% !important;
                    height: 100% !important;
                }
                .psv-hotspot {
                    background: rgba(37, 99, 235, 0.9);
                    color: #fff;
                    padding: 4px 10px;
                    border-radius: 999px;
                    font-size: 13px;
                    font-weight: 500;
                    white-space: nowrap;
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.4);
                    transition: background 0.2s;
                }
                .psv-hotspot:hover {
                    background: rgba(29, 78, 216, 1);
                }
            `}</style>

            <div
                ref={containerRef}
                style={{ width: '100%', height: '100%', minHeight: '400px' }}
            />
        </>
    );
}
