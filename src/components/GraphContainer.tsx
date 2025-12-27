'use client';

import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { graphData, GraphNode, filterNodesBySearch } from '@/lib/graphData';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
  loading: () => null,
});

interface GraphContainerProps {
  onNodeClick: (node: GraphNode) => void;
  searchTerm: string;
}

// Pre-calculate positions for categories around the root
const CATEGORY_POSITIONS: Record<string, { x: number; y: number }> = {
  root: { x: 0, y: 0 },
  experience: { x: -300, y: -200 },
  projects: { x: 300, y: -200 },
  research: { x: 300, y: 200 },
  skills: { x: -300, y: 200 },
};

// Child positions relative to parent (fan out)
const getChildPosition = (parentId: string, index: number, total: number) => {
  const parent = CATEGORY_POSITIONS[parentId] || { x: 0, y: 0 };
  const angleStart = parentId === 'experience' ? Math.PI : 0;
  const angleSpread = Math.PI * 0.6;
  const angle = angleStart + (index / Math.max(total - 1, 1) - 0.5) * angleSpread;
  const distance = 180;
  
  return {
    x: parent.x + Math.cos(angle) * distance,
    y: parent.y + Math.sin(angle) * distance,
  };
};

export default function GraphContainer({ onNodeClick, searchTerm }: GraphContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Filter by search
  const highlightedNodes = useMemo(() => {
    if (!searchTerm.trim()) return null;
    return filterNodesBySearch(searchTerm);
  }, [searchTerm]);

  // Build visible graph with pre-calculated positions
  const visibleGraphData = useMemo(() => {
    const visibleNodeIds = new Set<string>();
    
    // Always show root and categories
    visibleNodeIds.add('root');
    graphData.nodes
      .filter(n => n.type === 'category')
      .forEach(n => visibleNodeIds.add(n.id));
    
    // Show children of expanded categories
    expandedCategories.forEach(catId => {
      graphData.nodes
        .filter(n => n.parentId === catId)
        .forEach(n => visibleNodeIds.add(n.id));
    });

    // Build nodes with initial positions
    const visibleNodes = graphData.nodes
      .filter(n => visibleNodeIds.has(n.id))
      .map((n, _, arr) => {
        // Set initial position
        let pos = CATEGORY_POSITIONS[n.id];
        
        if (!pos && n.parentId) {
          // Child node - position relative to parent
          const siblings = arr.filter(s => s.parentId === n.parentId);
          const index = siblings.findIndex(s => s.id === n.id);
          pos = getChildPosition(n.parentId, index, siblings.length);
        }
        
        return {
          ...n,
          fx: pos?.x, // Fixed x position initially
          fy: pos?.y, // Fixed y position initially
        };
      });
    
    const visibleLinks = graphData.links
      .filter(l => visibleNodeIds.has(l.source as string) && visibleNodeIds.has(l.target as string))
      .map(l => ({ source: l.source, target: l.target }));

    return { nodes: visibleNodes, links: visibleLinks };
  }, [expandedCategories]);

  // Window resize
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
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => {
      window.removeEventListener('resize', updateDimensions);
      clearTimeout(timer);
    };
  }, []);

  // Configure forces
  useEffect(() => {
    if (graphRef.current && isReady) {
      const fg = graphRef.current;
      
      // Disable forces since we're using fixed positions
      fg.d3Force('charge')?.strength(0);
      fg.d3Force('center', null);
      fg.d3Force('link')?.strength(0);
      
      setTimeout(() => {
        fg.zoomToFit(400, 120);
      }, 300);
    }
  }, [isReady, visibleGraphData]);

  // Node sizes
  const getNodeSize = useCallback((node: GraphNode) => {
    if (node.type === 'root') return 45;
    if (node.type === 'category') return 35;
    return 22;
  }, []);

  // Paint node
  const paintNode = useCallback((node: any, ctx: CanvasRenderingContext2D) => {
    const x = node.fx ?? node.x;
    const y = node.fy ?? node.y;
    if (!isFinite(x) || !isFinite(y)) return;
    
    const nodeData = node as GraphNode;
    const isHovered = hoveredNode === node.id;
    const isExpanded = expandedCategories.has(node.id);
    const hasChildren = graphData.nodes.some(n => n.parentId === node.id);
    const isHighlighted = !highlightedNodes || highlightedNodes.has(node.id);
    
    const opacity = highlightedNodes && !isHighlighted ? 0.15 : 1;
    const color = nodeData.color || '#ffffff';
    
    let size = getNodeSize(nodeData);
    if (isHovered) size *= 1.1;
    
    // Outer glow
    const glowRadius = size * 2;
    const glow = ctx.createRadialGradient(x, y, size * 0.3, x, y, glowRadius);
    glow.addColorStop(0, `${color}${Math.floor(opacity * 0.4 * 255).toString(16).padStart(2, '0')}`);
    glow.addColorStop(1, `${color}00`);
    ctx.beginPath();
    ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();

    // Main circle
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    const grad = ctx.createRadialGradient(x - size * 0.3, y - size * 0.3, 0, x, y, size);
    grad.addColorStop(0, `${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`);
    grad.addColorStop(1, `${color}${Math.floor(opacity * 0.6 * 255).toString(16).padStart(2, '0')}`);
    ctx.fillStyle = grad;
    ctx.fill();

    // Expandable indicator ring
    if (nodeData.type === 'category' && hasChildren) {
      ctx.beginPath();
      ctx.arc(x, y, size + 8, 0, Math.PI * 2);
      ctx.strokeStyle = `${color}${Math.floor(opacity * (isExpanded ? 0.8 : 0.3) * 255).toString(16).padStart(2, '0')}`;
      ctx.lineWidth = 2;
      ctx.setLineDash(isExpanded ? [] : [8, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Hover effect
    if (isHovered) {
      ctx.beginPath();
      ctx.arc(x, y, size + 12, 0, Math.PI * 2);
      ctx.strokeStyle = `${color}50`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Label
    const fontSize = nodeData.type === 'root' ? 18 : nodeData.type === 'category' ? 15 : 13;
    ctx.font = `600 ${fontSize}px "Outfit", system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const label = nodeData.name;
    const labelY = y + size + fontSize + 10;
    
    // Background pill
    const metrics = ctx.measureText(label);
    const padX = 12, padY = 6;
    const pillW = metrics.width + padX * 2;
    const pillH = fontSize + padY * 2;
    
    ctx.fillStyle = `rgba(5, 5, 5, ${opacity * 0.92})`;
    ctx.beginPath();
    ctx.roundRect(x - pillW / 2, labelY - pillH / 2, pillW, pillH, pillH / 2);
    ctx.fill();
    
    // Text
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.95})`;
    ctx.fillText(label, x, labelY);
    
    // Subtitle for root
    if (nodeData.type === 'root' && nodeData.description) {
      ctx.font = `400 11px "Space Mono", monospace`;
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.4})`;
      ctx.fillText(nodeData.description, x, labelY + fontSize + 6);
    }
  }, [hoveredNode, expandedCategories, highlightedNodes, getNodeSize]);

  // Paint link
  const paintLink = useCallback((link: any, ctx: CanvasRenderingContext2D) => {
    const source = link.source;
    const target = link.target;
    
    const sx = source.fx ?? source.x;
    const sy = source.fy ?? source.y;
    const tx = target.fx ?? target.x;
    const ty = target.fy ?? target.y;
    
    if (!isFinite(sx) || !isFinite(sy) || !isFinite(tx) || !isFinite(ty)) return;
    
    const isHoverConnected = hoveredNode && (source.id === hoveredNode || target.id === hoveredNode);
    const opacity = isHoverConnected ? 0.6 : 0.2;
    
    const grad = ctx.createLinearGradient(sx, sy, tx, ty);
    grad.addColorStop(0, `${source.color || '#fff'}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`);
    grad.addColorStop(1, `${target.color || '#fff'}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`);
    
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(tx, ty);
    ctx.strokeStyle = grad;
    ctx.lineWidth = isHoverConnected ? 3 : 1.5;
    ctx.stroke();
  }, [hoveredNode]);

  // Handle click
  const handleNodeClick = useCallback((node: any) => {
    const graphNode = graphData.nodes.find(n => n.id === node.id);
    if (!graphNode) return;

    // If it's a category with children, toggle expand
    const hasChildren = graphData.nodes.some(n => n.parentId === node.id);
    if (graphNode.type === 'category' && hasChildren) {
      setExpandedCategories(prev => {
        const next = new Set(prev);
        if (next.has(node.id)) {
          next.delete(node.id);
        } else {
          next.add(node.id);
        }
        return next;
      });
      
      // Refit view after expand
      setTimeout(() => {
        graphRef.current?.zoomToFit(400, 80);
      }, 100);
      return;
    }

    // Open detail panel for items
    if (graphNode.details) {
      onNodeClick(graphNode);
    }
  }, [onNodeClick]);

  const handleNodeHover = useCallback((node: any) => {
    setHoveredNode(node?.id || null);
    if (containerRef.current) {
      containerRef.current.style.cursor = node ? 'pointer' : 'grab';
    }
  }, []);

  // Larger click area
  const nodePointerAreaPaint = useCallback((node: any, color: string, ctx: CanvasRenderingContext2D) => {
    const x = node.fx ?? node.x;
    const y = node.fy ?? node.y;
    const size = getNodeSize(node as GraphNode);
    ctx.beginPath();
    ctx.arc(x, y, size + 20, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }, [getNodeSize]);

  return (
    <div ref={containerRef} className="w-full h-full" style={{ cursor: 'grab' }}>
      {isReady && (
        <ForceGraph2D
          ref={graphRef}
          width={dimensions.width}
          height={dimensions.height}
          graphData={visibleGraphData}
          nodeCanvasObject={paintNode}
          nodePointerAreaPaint={nodePointerAreaPaint}
          linkCanvasObject={paintLink}
          onNodeClick={handleNodeClick}
          onNodeHover={handleNodeHover}
          nodeRelSize={1}
          backgroundColor="transparent"
          enableNodeDrag={false}
          enableZoomInteraction={true}
          enablePanInteraction={true}
          minZoom={0.3}
          maxZoom={3}
          cooldownTicks={0}
        />
      )}
    </div>
  );
}
