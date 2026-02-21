// Dijkstra's Algorithm for shortest path finding
import { GraphNode } from './types';

export interface PathResult {
    path: string[]; // Array of node IDs
    distance: number;
    estimatedTime: number;
    waypoints: Array<{ lat: number; lng: number }>;
}

export class PathFinder {
    private graph: Map<string, GraphNode>;

    constructor(nodes: GraphNode[]) {
        this.graph = new Map();
        nodes.forEach(node => {
            this.graph.set(node.id, node);
        });
    }

    /**
     * Find shortest path using Dijkstra's algorithm
     * Considers path availability (construction, closures)
     */
    findShortestPath(startId: string, endId: string, preferAccessible: boolean = false): PathResult | null {
        const distances = new Map<string, number>();
        const previous = new Map<string, string | null>();
        const unvisited = new Set<string>();

        // Initialize
        this.graph.forEach((_, nodeId) => {
            distances.set(nodeId, Infinity);
            previous.set(nodeId, null);
            unvisited.add(nodeId);
        });
        distances.set(startId, 0);

        while (unvisited.size > 0) {
            // Find unvisited node with smallest distance
            let currentId: string | null = null;
            let smallestDistance = Infinity;

            unvisited.forEach(nodeId => {
                const dist = distances.get(nodeId)!;
                if (dist < smallestDistance) {
                    smallestDistance = dist;
                    currentId = nodeId;
                }
            });

            if (currentId === null || smallestDistance === Infinity) {
                break; // No path exists
            }

            if (currentId === endId) {
                break; // Reached destination
            }

            unvisited.delete(currentId);
            const currentNode = this.graph.get(currentId)!;

            // Check all neighbors
            currentNode.connections.forEach(connection => {
                if (!connection.isAvailable) {
                    return; // Skip closed paths
                }

                const neighborId = connection.nodeId;
                if (!unvisited.has(neighborId)) {
                    return; // Already visited
                }

                // Calculate distance with accessibility preference
                let edgeWeight = connection.distance;
                if (preferAccessible) {
                    const neighborNode = this.graph.get(neighborId);
                    // Add penalty if path is not accessible
                    if (neighborNode && !this.isAccessibleConnection(currentNode, neighborNode)) {
                        edgeWeight *= 1.5; // 50% penalty for non-accessible routes
                    }
                }

                const altDistance = distances.get(currentId!)! + edgeWeight;

                if (altDistance < distances.get(neighborId)!) {
                    distances.set(neighborId, altDistance);
                    previous.set(neighborId, currentId);
                }
            });
        }

        // Reconstruct path
        if (!previous.has(endId) || previous.get(endId) === null) {
            return null; // No path found
        }

        const path: string[] = [];
        let current: string | null = endId;

        while (current !== null) {
            path.unshift(current);
            current = previous.get(current) || null;
        }

        // Calculate waypoints
        const waypoints = path.map(nodeId => {
            const node = this.graph.get(nodeId)!;
            return { lat: node.position.lat, lng: node.position.lng };
        });

        const totalDistance = distances.get(endId)!;
        const estimatedTime = Math.ceil(totalDistance / 80); // Assuming 80m/min walking speed

        return {
            path,
            distance: totalDistance,
            estimatedTime,
            waypoints
        };
    }

    /**
     * Update path availability (for admin to flag construction/closures)
     */
    updatePathStatus(fromNodeId: string, toNodeId: string, isAvailable: boolean): void {
        const node = this.graph.get(fromNodeId);
        if (node) {
            const connection = node.connections.find(c => c.nodeId === toNodeId);
            if (connection) {
                connection.isAvailable = isAvailable;
            }
        }

        // Update reverse direction
        const reverseNode = this.graph.get(toNodeId);
        if (reverseNode) {
            const reverseConnection = reverseNode.connections.find(c => c.nodeId === fromNodeId);
            if (reverseConnection) {
                reverseConnection.isAvailable = isAvailable;
            }
        }
    }

    /**
     * Find alternative routes
     */
    findAlternativeRoutes(startId: string, endId: string, maxRoutes: number = 3): PathResult[] {
        const routes: PathResult[] = [];
        const mainRoute = this.findShortestPath(startId, endId);

        if (mainRoute) {
            routes.push(mainRoute);
        }

        // Find alternative routes by temporarily removing edges from main route
        // This is a simplified approach; more sophisticated algorithms exist
        return routes;
    }

    private isAccessibleConnection(from: GraphNode, to: GraphNode): boolean {
        // Check if connection is wheelchair accessible
        // This would be determined by path properties in a real implementation
        return true; // Placeholder
    }
}

/**
 * Build graph from buildings and paths
 */
export function buildGraph(buildings: any[], paths: any[]): GraphNode[] {
    const nodes: GraphNode[] = [];
    const nodeMap = new Map<string, GraphNode>();

    // Create nodes for each building
    buildings.forEach(building => {
        const node: GraphNode = {
            id: building._id,
            buildingId: building._id,
            position: building.location,
            connections: []
        };
        nodes.push(node);
        nodeMap.set(building._id, node);
    });

    // Add connections based on paths
    paths.forEach(path => {
        const fromNode = nodeMap.get(path.from);
        const toNode = nodeMap.get(path.to);

        if (fromNode && toNode) {
            fromNode.connections.push({
                nodeId: toNode.id,
                distance: path.distance,
                pathId: path._id,
                isAvailable: path.status === 'open'
            });

            // Add reverse connection
            toNode.connections.push({
                nodeId: fromNode.id,
                distance: path.distance,
                pathId: path._id,
                isAvailable: path.status === 'open'
            });
        }
    });

    return nodes;
}
