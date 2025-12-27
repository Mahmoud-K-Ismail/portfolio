'use client';

import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { graphData, GraphNode, filterNodesBySearch } from '@/lib/graphData';

// Dynamically import ForceGraph2D to avoid SSR issues
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  ),
});

interface GraphContainerProps {
  onNodeClick: (node: GraphNode) => void;
  searchTerm: string;
}

export default function GraphContainer({ onNodeClick, searchTerm }: GraphContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Filter nodes based on search
  const highlightedNodes = useMemo(() => {
    if (!searchTerm.trim()) return null;
    return filterNodesBySearch(searchTerm);
  }, [searchTerm]);

  // Handle window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    // Set ready state after a short delay
    const timer = setTimeout(() => setIsReady(true), 100);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
      clearTimeout(timer);
    };
  }, []);

  // Center graph on root node after initial render
  useEffect(() => {
    if (graphRef.current && isReady) {
      // Initial zoom and center
      setTimeout(() => {
        graphRef.current?.zoomToFit(400, 50);
      }, 500);
    }
  }, [isReady]);

  // Custom node rendering with glow effect
  const paintNode = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const nodeData = node as GraphNode;
    const isHovered = hoveredNode === node.id;
    const isHighlighted = highlightedNodes === null || highlightedNodes.has(node.id);
    const baseSize = nodeData.size || 8;
    const size = isHovered ? baseSize * 1.5 : baseSize;
    
    // Determine opacity based on search filter
    const opacity = highlightedNodes && !isHighlighted ? 0.15 : 1;
    
    // Draw glow effect
    const glowSize = isHovered ? 4 : 2;
    const gradient = ctx.createRadialGradient(
      node.x, node.y, 0,
      node.x, node.y, size + glowSize * 3
    );
    
    const color = nodeData.color || '#ffffff';
    gradient.addColorStop(0, `${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`);
    gradient.addColorStop(0.5, `${color}${Math.floor(opacity * 0.4 * 255).toString(16).padStart(2, '0')}`);
    gradient.addColorStop(1, `${color}00`);
    
    ctx.beginPath();
    ctx.arc(node.x, node.y, size + glowSize * 3, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Draw main node
    ctx.beginPath();
    ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
    ctx.fillStyle = `${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
    ctx.fill();
    
    // Draw label for larger nodes or when hovered
    if (globalScale > 0.5 || isHovered || nodeData.type === 'root' || nodeData.type === 'category') {
      const label = nodeData.name;
      const fontSize = Math.max(12 / globalScale, isHovered ? 14 : 10);
      ctx.font = `${isHovered ? 'bold' : 'normal'} ${fontSize}px 'Space Mono', monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Text background for readability
      const textWidth = ctx.measureText(label).width;
      const padding = 4 / globalScale;
      
      ctx.fillStyle = `rgba(5, 5, 5, ${opacity * 0.8})`;
      ctx.fillRect(
        node.x - textWidth / 2 - padding,
        node.y + size + 8 / globalScale - fontSize / 2 - padding / 2,
        textWidth + padding * 2,
        fontSize + padding
      );
      
      // Draw text
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.9})`;
      ctx.fillText(label, node.x, node.y + size + 8 / globalScale);
    }
  }, [hoveredNode, highlightedNodes]);

  // Custom link rendering
  const paintLink = useCallback((link: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
    const targetId = typeof link.target === 'object' ? link.target.id : link.target;
    
    const isHighlighted = highlightedNodes === null || 
      (highlightedNodes.has(sourceId) && highlightedNodes.has(targetId));
    
    const sourceNode = typeof link.source === 'object' ? link.source : null;
    const targetNode = typeof link.target === 'object' ? link.target : null;
    
    if (!sourceNode || !targetNode) return;
    
    const opacity = isHighlighted ? 0.3 : 0.05;
    
    // Create gradient for link
    const gradient = ctx.createLinearGradient(
      sourceNode.x, sourceNode.y,
      targetNode.x, targetNode.y
    );
    
    const sourceColor = sourceNode.color || '#ffffff';
    const targetColor = targetNode.color || '#ffffff';
    
    gradient.addColorStop(0, `${sourceColor}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`);
    gradient.addColorStop(1, `${targetColor}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`);
    
    ctx.beginPath();
    ctx.moveTo(sourceNode.x, sourceNode.y);
    ctx.lineTo(targetNode.x, targetNode.y);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1 / globalScale;
    ctx.stroke();
  }, [highlightedNodes]);

  const handleNodeClick = useCallback((node: any) => {
    const graphNode = graphData.nodes.find(n => n.id === node.id);
    if (graphNode && graphNode.details) {
      onNodeClick(graphNode);
    }
    
    // Zoom to the clicked node
    if (graphRef.current) {
      graphRef.current.centerAt(node.x, node.y, 500);
      graphRef.current.zoom(2, 500);
    }
  }, [onNodeClick]);

  const handleNodeHover = useCallback((node: any) => {
    setHoveredNode(node?.id || null);
    
    // Change cursor style
    if (containerRef.current) {
      containerRef.current.style.cursor = node ? 'pointer' : 'grab';
    }
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full"
      style={{ cursor: 'grab' }}
    >
      {isReady && (
        <ForceGraph2D
          ref={graphRef}
          width={dimensions.width}
          height={dimensions.height}
          graphData={graphData}
          nodeCanvasObject={paintNode}
          linkCanvasObject={paintLink}
          onNodeClick={handleNodeClick}
          onNodeHover={handleNodeHover}
          nodeRelSize={1}
          linkWidth={1}
          linkColor={() => 'transparent'}
          backgroundColor="#050505"
          enableNodeDrag={true}
          enableZoomInteraction={true}
          enablePanInteraction={true}
          minZoom={0.5}
          maxZoom={8}
          cooldownTicks={100}
          d3AlphaDecay={0.01}
          d3VelocityDecay={0.3}
          warmupTicks={50}
          onEngineStop={() => {
            // Add subtle continuous movement
            if (graphRef.current) {
              graphRef.current.d3Force('charge')?.strength(-150);
            }
          }}
        />
      )}
    </div>
  );
}
