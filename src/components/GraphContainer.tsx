'use client';

import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { graphData, GraphNode, filterNodesBySearch } from '@/lib/graphData';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
  loading: () => null,
});

interface GraphContainerProps {
  onNodeClick: (node: GraphNode, position?: { x: number; y: number } | null) => void;
  searchTerm: string;
}

// Pre-calculate positions for categories around the root
const CATEGORY_POSITIONS: Record<string, { x: number; y: number }> = {
  root: { x: 0, y: 0 },
  experience: { x: -280, y: -180 },
  projects: { x: 280, y: -180 },
  research: { x: 280, y: 180 },
  education: { x: -280, y: 180 },
  skills: { x: 0, y: -280 },
  resume: { x: 0, y: 300 },
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
  const constraintAnimationFrameRef = useRef<number | null>(null);
  const viewStateRef = useRef<{ centerX: number; centerY: number; zoom: number }>({ centerX: 0, centerY: 0, zoom: 1 });
  const isApplyingConstraintsRef = useRef(false);

  // Filter by search
  const highlightedNodes = useMemo(() => {
    if (!searchTerm.trim()) return null;
    return filterNodesBySearch(searchTerm);
  }, [searchTerm]);

  // Node sizes
  const getNodeSize = useCallback((node: GraphNode) => {
    if (node.type === 'root') return 45;
    if (node.type === 'category') return 35;
    return 22;
  }, []);


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

  // Check if any nodes are visible in the viewport, if not, snap back to show whole graph
  const constrainView = useCallback(() => {
    if (!graphRef.current || !containerRef.current || isApplyingConstraintsRef.current) return;
    
    const fg = graphRef.current;
    const zoom = fg.zoom() || viewStateRef.current.zoom;
    
    // Try to get current center from the graph's internal state
    let centerX = viewStateRef.current.centerX;
    let centerY = viewStateRef.current.centerY;
    
    // Try to access the D3 zoom transform if available
    try {
      const zoomTransform = (fg as any).__zoom;
      if (zoomTransform && typeof zoomTransform === 'object' && 'x' in zoomTransform && 'y' in zoomTransform && 'k' in zoomTransform) {
        const transform = zoomTransform as { x: number; y: number; k: number };
        centerX = -transform.x / transform.k;
        centerY = -transform.y / transform.k;
        viewStateRef.current.centerX = centerX;
        viewStateRef.current.centerY = centerY;
      }
    } catch (e) {
      // Fall back to tracked state
    }
    
    // Calculate viewport bounds in graph coordinates
    const viewWidth = dimensions.width / zoom;
    const viewHeight = dimensions.height / zoom;
    const viewMinX = centerX - viewWidth / 2;
    const viewMaxX = centerX + viewWidth / 2;
    const viewMinY = centerY - viewHeight / 2;
    const viewMaxY = centerY + viewHeight / 2;
    
    // Check if any nodes are visible in the viewport
    let hasVisibleNodes = false;
    for (const node of visibleGraphData.nodes) {
      const nodeAny = node as any;
      const x = nodeAny.fx ?? nodeAny.x ?? 0;
      const y = nodeAny.fy ?? nodeAny.y ?? 0;
      const size = getNodeSize(node as GraphNode);
      
      // Check if node overlaps with viewport
      if (x + size >= viewMinX && x - size <= viewMaxX && 
          y + size >= viewMinY && y - size <= viewMaxY) {
        hasVisibleNodes = true;
        break;
      }
    }
    
    // If no nodes are visible, snap back to show the whole graph
    if (!hasVisibleNodes && visibleGraphData.nodes.length > 0) {
      // Calculate bounds of all visible nodes
      let minX = Infinity, maxX = -Infinity;
      let minY = Infinity, maxY = -Infinity;
      
      visibleGraphData.nodes.forEach(node => {
        const nodeAny = node as any;
        const x = nodeAny.fx ?? nodeAny.x ?? 0;
        const y = nodeAny.fy ?? nodeAny.y ?? 0;
        const size = getNodeSize(node as GraphNode);
        minX = Math.min(minX, x - size);
        maxX = Math.max(maxX, x + size);
        minY = Math.min(minY, y - size);
        maxY = Math.max(maxY, y + size);
      });
      
      const graphWidth = maxX - minX;
      const graphHeight = maxY - minY;
      const centerGraphX = (minX + maxX) / 2;
      const centerGraphY = (minY + maxY) / 2;
      
      // Add padding for nice fit
      const paddingX = 150;
      const paddingY = 120;
      
      // Calculate zoom to fit
      const zoomX = dimensions.width / (graphWidth + paddingX);
      const zoomY = dimensions.height / (graphHeight + paddingY);
      const newZoom = Math.min(zoomX, zoomY);
      
      // Snap back to show whole graph
      isApplyingConstraintsRef.current = true;
      fg.zoom(newZoom, 400);
      fg.centerAt(centerGraphX, centerGraphY, 400);
      viewStateRef.current = { centerX: centerGraphX, centerY: centerGraphY, zoom: newZoom };
      
      setTimeout(() => {
        isApplyingConstraintsRef.current = false;
      }, 450);
      
      constraintAnimationFrameRef.current = null;
      return;
    }
    
    // If nodes are visible, we're good - no constraints needed
    constraintAnimationFrameRef.current = null;
  }, [visibleGraphData, dimensions, getNodeSize]);

  // Start constraint animation when needed
  useEffect(() => {
    if (isReady && graphRef.current) {
      // Check constraints more frequently for better responsiveness
      const interval = setInterval(() => {
        if (constraintAnimationFrameRef.current === null) {
          constrainView();
        }
      }, 50); // Check every 50ms for smoother constraints
      
      return () => {
        clearInterval(interval);
        if (constraintAnimationFrameRef.current) {
          cancelAnimationFrame(constraintAnimationFrameRef.current);
        }
      };
    }
  }, [isReady, constrainView]);

  // Configure forces - only on initial load
  useEffect(() => {
    if (graphRef.current && isReady) {
      const fg = graphRef.current;
      
      // Disable forces since we're using fixed positions
      fg.d3Force('charge')?.strength(0);
      fg.d3Force('center', null);
      fg.d3Force('link')?.strength(0);
      
      // Center and fit the entire graph on load - more padding = more zoomed out
      setTimeout(() => {
        fg.zoomToFit(800, 500);
        // Center the view
        fg.centerAt(0, 0, 0);
        viewStateRef.current = { centerX: 0, centerY: 0, zoom: fg.zoom() || 1 };
      }, 500);
    }
    // Only run once on initial load, not when visibleGraphData changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  // Image cache for node images
  const [imageCache, setImageCache] = useState<Map<string, HTMLImageElement>>(new Map());

  // Preload images
  useEffect(() => {
    const cache = new Map<string, HTMLImageElement>();
    const imagesToLoad: string[] = [];
    
    graphData.nodes.forEach(node => {
      if (node.image) {
        imagesToLoad.push(node.image);
      }
    });

    let loadedCount = 0;
    imagesToLoad.forEach(src => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        cache.set(src, img);
        loadedCount++;
        if (loadedCount === imagesToLoad.length) {
          setImageCache(new Map(cache));
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === imagesToLoad.length) {
          setImageCache(new Map(cache));
        }
      };
      img.src = src;
    });

    if (imagesToLoad.length === 0) {
      setImageCache(new Map());
    }
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

    // Draw image for nodes (root, category, or item nodes with images)
    if (nodeData.image && imageCache.has(nodeData.image)) {
      const img = imageCache.get(nodeData.image)!;
      if (img.complete && img.width > 0) {
        ctx.save();
        if (nodeData.type === 'root') {
          ctx.beginPath();
          ctx.arc(x, y, size * 0.85, 0, Math.PI * 2);
          ctx.clip();
          const imgSize = size * 1.7;
          ctx.drawImage(img, x - imgSize / 2, y - imgSize / 2, imgSize, imgSize);
        } else {
          // Larger size for item nodes with images (like NYU logo)
          const imgSize = nodeData.type === 'item' ? size * 1.0 : size * 0.7;
          ctx.globalAlpha = opacity;
          ctx.drawImage(img, x - imgSize / 2, y - imgSize / 2, imgSize, imgSize);
        }
        ctx.restore();
      }
    } else if (nodeData.icon && (nodeData.type === 'category' || nodeData.type === 'item')) {
      // Draw icon for other category nodes (experience, projects, skills)
      ctx.save();
      ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.9})`;
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.9})`;
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      const iconSize = size * 0.5;
      
      switch (nodeData.icon) {
        case 'Briefcase': // Experience
          // Briefcase icon
          ctx.beginPath();
          ctx.rect(x - iconSize * 0.6, y - iconSize * 0.3, iconSize * 1.2, iconSize * 0.6);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(x - iconSize * 0.4, y - iconSize * 0.3);
          ctx.lineTo(x - iconSize * 0.4, y - iconSize * 0.5);
          ctx.lineTo(x + iconSize * 0.4, y - iconSize * 0.5);
          ctx.lineTo(x + iconSize * 0.4, y - iconSize * 0.3);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(x, y + iconSize * 0.1, iconSize * 0.15, 0, Math.PI * 2);
          ctx.fill();
          break;
          
        case 'FolderKanban': // Projects
          // Folder icon
          ctx.beginPath();
          ctx.moveTo(x - iconSize * 0.5, y - iconSize * 0.2);
          ctx.lineTo(x - iconSize * 0.3, y - iconSize * 0.4);
          ctx.lineTo(x + iconSize * 0.3, y - iconSize * 0.4);
          ctx.lineTo(x + iconSize * 0.5, y - iconSize * 0.2);
          ctx.lineTo(x + iconSize * 0.5, y + iconSize * 0.3);
          ctx.lineTo(x - iconSize * 0.5, y + iconSize * 0.3);
          ctx.closePath();
          ctx.stroke();
          break;
          
        case 'Code': // Skills / Languages
          // Code brackets icon
          ctx.beginPath();
          ctx.moveTo(x - iconSize * 0.4, y - iconSize * 0.2);
          ctx.lineTo(x - iconSize * 0.6, y);
          ctx.lineTo(x - iconSize * 0.4, y + iconSize * 0.2);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(x + iconSize * 0.4, y - iconSize * 0.2);
          ctx.lineTo(x + iconSize * 0.6, y);
          ctx.lineTo(x + iconSize * 0.4, y + iconSize * 0.2);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(x - iconSize * 0.15, y);
          ctx.lineTo(x + iconSize * 0.15, y);
          ctx.stroke();
          break;
          
        case 'BookOpen': // Tutor
          // Open book icon
          ctx.beginPath();
          ctx.arc(x - iconSize * 0.2, y, iconSize * 0.3, -Math.PI / 3, Math.PI / 3);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(x + iconSize * 0.2, y, iconSize * 0.3, Math.PI * 2 / 3, Math.PI * 4 / 3);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(x - iconSize * 0.2, y - iconSize * 0.25);
          ctx.lineTo(x, y - iconSize * 0.15);
          ctx.lineTo(x + iconSize * 0.2, y - iconSize * 0.25);
          ctx.stroke();
          break;
          
        case 'Database': // notSoSimpleDB / Databases
          // Database cylinder icon
          ctx.beginPath();
          ctx.ellipse(x, y - iconSize * 0.2, iconSize * 0.4, iconSize * 0.1, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(x - iconSize * 0.4, y - iconSize * 0.2);
          ctx.lineTo(x - iconSize * 0.4, y + iconSize * 0.2);
          ctx.moveTo(x + iconSize * 0.4, y - iconSize * 0.2);
          ctx.lineTo(x + iconSize * 0.4, y + iconSize * 0.2);
          ctx.stroke();
          ctx.beginPath();
          ctx.ellipse(x, y + iconSize * 0.2, iconSize * 0.4, iconSize * 0.1, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.ellipse(x, y, iconSize * 0.4, iconSize * 0.1, 0, 0, Math.PI * 2);
          ctx.stroke();
          break;
          
        case 'Search': // VoucherFinder
          // Magnifying glass icon
          ctx.beginPath();
          ctx.arc(x, y, iconSize * 0.35, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(x + iconSize * 0.25, y + iconSize * 0.25);
          ctx.lineTo(x + iconSize * 0.45, y + iconSize * 0.45);
          ctx.stroke();
          break;
          
        case 'Home': // RentIt
          // House icon
          ctx.beginPath();
          ctx.moveTo(x, y - iconSize * 0.4);
          ctx.lineTo(x - iconSize * 0.4, y);
          ctx.lineTo(x - iconSize * 0.4, y + iconSize * 0.3);
          ctx.lineTo(x + iconSize * 0.4, y + iconSize * 0.3);
          ctx.lineTo(x + iconSize * 0.4, y);
          ctx.closePath();
          ctx.stroke();
          ctx.beginPath();
          ctx.rect(x - iconSize * 0.15, y + iconSize * 0.1, iconSize * 0.3, iconSize * 0.2);
          ctx.stroke();
          break;
          
        case 'Wallet': // Budgetly
          // Wallet icon
          ctx.beginPath();
          ctx.rect(x - iconSize * 0.5, y - iconSize * 0.2, iconSize * 1.0, iconSize * 0.4);
          ctx.stroke();
          ctx.beginPath();
          ctx.rect(x - iconSize * 0.5, y - iconSize * 0.2, iconSize * 0.3, iconSize * 0.4);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(x + iconSize * 0.25, y, iconSize * 0.1, 0, Math.PI * 2);
          ctx.fill();
          break;
          
        case 'FileText': // ICSE Paper
          // Document icon
          ctx.beginPath();
          ctx.moveTo(x - iconSize * 0.3, y - iconSize * 0.4);
          ctx.lineTo(x + iconSize * 0.3, y - iconSize * 0.4);
          ctx.lineTo(x + iconSize * 0.3, y + iconSize * 0.3);
          ctx.lineTo(x - iconSize * 0.3, y + iconSize * 0.3);
          ctx.closePath();
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(x - iconSize * 0.2, y - iconSize * 0.2);
          ctx.lineTo(x + iconSize * 0.2, y - iconSize * 0.2);
          ctx.moveTo(x - iconSize * 0.2, y);
          ctx.lineTo(x + iconSize * 0.1, y);
          ctx.moveTo(x - iconSize * 0.2, y + iconSize * 0.2);
          ctx.lineTo(x + iconSize * 0.15, y + iconSize * 0.2);
          ctx.stroke();
          break;
          
        case 'Book': // Qamar
          // Closed book icon
          ctx.beginPath();
          ctx.rect(x - iconSize * 0.4, y - iconSize * 0.3, iconSize * 0.8, iconSize * 0.6);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(x, y - iconSize * 0.3);
          ctx.lineTo(x, y + iconSize * 0.3);
          ctx.stroke();
          break;
          
        case 'Server': // Backend & Cloud
          // Server rack icon
          ctx.beginPath();
          ctx.rect(x - iconSize * 0.5, y - iconSize * 0.35, iconSize * 1.0, iconSize * 0.7);
          ctx.stroke();
          ctx.beginPath();
          ctx.rect(x - iconSize * 0.4, y - iconSize * 0.25, iconSize * 0.8, iconSize * 0.15);
          ctx.fill();
          ctx.beginPath();
          ctx.rect(x - iconSize * 0.4, y - iconSize * 0.05, iconSize * 0.8, iconSize * 0.15);
          ctx.fill();
          ctx.beginPath();
          ctx.rect(x - iconSize * 0.4, y + iconSize * 0.15, iconSize * 0.8, iconSize * 0.15);
          ctx.fill();
          break;
          
        case 'Terminal': // Systems & Tools
          // Terminal window icon
          ctx.beginPath();
          ctx.rect(x - iconSize * 0.5, y - iconSize * 0.3, iconSize * 1.0, iconSize * 0.6);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(x - iconSize * 0.35, y - iconSize * 0.15, iconSize * 0.08, 0, Math.PI * 2);
          ctx.fill();
        ctx.beginPath();
          ctx.moveTo(x - iconSize * 0.2, y);
          ctx.lineTo(x + iconSize * 0.1, y - iconSize * 0.15);
          ctx.lineTo(x + iconSize * 0.1, y + iconSize * 0.15);
          ctx.closePath();
        ctx.fill();
          break;
      }
      
      ctx.restore();
    }

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
  }, [hoveredNode, expandedCategories, highlightedNodes, getNodeSize, imageCache]);

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

    // Get node screen position for animation
    let nodePosition: { x: number; y: number } | null = null;
    if (graphRef.current && containerRef.current) {
      const fg = graphRef.current;
      const containerRect = containerRef.current.getBoundingClientRect();
      const nodeX = node.fx ?? node.x ?? 0;
      const nodeY = node.fy ?? node.y ?? 0;
      
      // Get graph transform state
      const zoom = fg.zoom() || 1;
      
      // Calculate screen position
      // The graph centers at (0,0) in graph space, which maps to center of container in screen space
      const screenX = containerRect.left + containerRect.width / 2 + nodeX * zoom;
      const screenY = containerRect.top + containerRect.height / 2 + nodeY * zoom;
      
      nodePosition = { x: screenX, y: screenY };
    }

    // If root node is clicked, just open detail panel (no view reset)
    if (graphNode.type === 'root') {
      if (graphNode.details) {
        onNodeClick(graphNode, nodePosition);
      }
      return;
    }

    // If it's a category with children, toggle expand
    const hasChildren = graphData.nodes.some(n => n.parentId === node.id);
    if (graphNode.type === 'category' && hasChildren) {
      const wasExpanded = expandedCategories.has(node.id);
      
      setExpandedCategories(prev => {
        const next = new Set(prev);
        if (next.has(node.id)) {
          next.delete(node.id);
        } else {
          next.add(node.id);
        }
        return next;
      });
      
      // When expanding, fit to category + its children only
      if (!wasExpanded) {
        // Wait for state to update and nodes to appear in visibleGraphData
        // Use a recursive check to ensure nodes are actually visible
        const checkAndZoom = (attempts = 0) => {
          if (!graphRef.current) return;
          
          // Get all visible nodes for this category (category + its children)
          const categoryNode = visibleGraphData.nodes.find(n => n.id === node.id);
          const children = visibleGraphData.nodes.filter(n => n.parentId === node.id);
          
          // If nodes aren't ready yet, wait a bit more (max 5 attempts = 500ms)
          if (!categoryNode || children.length === 0) {
            if (attempts < 5) {
              setTimeout(() => checkAndZoom(attempts + 1), 100);
            }
            return;
          }
          
          // Cancel any ongoing constraint animation
          if (constraintAnimationFrameRef.current) {
            cancelAnimationFrame(constraintAnimationFrameRef.current);
            constraintAnimationFrameRef.current = null;
          }
          
          const categoryNodeAny = categoryNode as any;
          const catX = categoryNodeAny.fx ?? categoryNodeAny.x ?? 0;
          const catY = categoryNodeAny.fy ?? categoryNodeAny.y ?? 0;
          const catSize = getNodeSize(categoryNode as GraphNode);
          
          // Helper to calculate node bounds including label
          const getNodeBounds = (nodeX: number, nodeY: number, nodeSize: number, nodeType: string) => {
            // Node circle bounds
            let nodeMinX = nodeX - nodeSize;
            let nodeMaxX = nodeX + nodeSize;
            let nodeMinY = nodeY - nodeSize;
            let nodeMaxY = nodeY + nodeSize;
            
            // Add label space (labels are below nodes)
            const fontSize = nodeType === 'root' ? 18 : nodeType === 'category' ? 15 : 13;
            const labelY = nodeY + nodeSize + fontSize + 10;
            const labelHeight = fontSize + 12; // fontSize + padY * 2
            // Estimate label width (will be calculated more accurately, but use generous estimate)
            const estimatedLabelWidth = 100; // Most labels are shorter
            
            nodeMinX = Math.min(nodeMinX, nodeX - estimatedLabelWidth / 2);
            nodeMaxX = Math.max(nodeMaxX, nodeX + estimatedLabelWidth / 2);
            nodeMaxY = Math.max(nodeMaxY, labelY + labelHeight / 2);
            
            return { minX: nodeMinX, maxX: nodeMaxX, minY: nodeMinY, maxY: nodeMaxY };
          };
          
          // Calculate bounding box of category + children with node sizes and labels
          const catBounds = getNodeBounds(catX, catY, catSize, categoryNode.type);
          let minX = catBounds.minX, maxX = catBounds.maxX;
          let minY = catBounds.minY, maxY = catBounds.maxY;
          
          children.forEach((child) => {
            const childAny = child as any;
            const childX = childAny.fx ?? childAny.x ?? 0;
            const childY = childAny.fy ?? childAny.y ?? 0;
            const childSize = getNodeSize(child as GraphNode);
            const childBounds = getNodeBounds(childX, childY, childSize, child.type);
            
            minX = Math.min(minX, childBounds.minX);
            maxX = Math.max(maxX, childBounds.maxX);
            minY = Math.min(minY, childBounds.minY);
            maxY = Math.max(maxY, childBounds.maxY);
          });
          
          const width = maxX - minX;
          const height = maxY - minY;
          const centerX = (minX + maxX) / 2;
          const centerY = (minY + maxY) / 2;
          
          // Add generous padding to ensure everything fits nicely
          const paddingX = 150;
          const paddingY = 120;
          
          // Calculate zoom to fit just this category and its children
          const zoomX = dimensions.width / (width + paddingX);
          const zoomY = dimensions.height / (height + paddingY);
          const zoom = Math.min(zoomX, zoomY);
          
          // Center and zoom to fit
          isApplyingConstraintsRef.current = true;
          graphRef.current.zoom(zoom, 300);
          graphRef.current.centerAt(centerX, centerY, 300);
          viewStateRef.current = { centerX, centerY, zoom };
          setTimeout(() => {
            isApplyingConstraintsRef.current = false;
          }, 350);
          
          // Restart constraint checking after animation
          setTimeout(() => {
            constrainView();
          }, 350);
        };
        
        // Start checking after a short delay
        setTimeout(() => checkAndZoom(), 100);
      }
      return;
    }

    // Open detail panel for items
    if (graphNode.details) {
      onNodeClick(graphNode, nodePosition);
    }
  }, [onNodeClick, expandedCategories, dimensions, constrainView, visibleGraphData, getNodeSize]);

  const handleNodeHover = useCallback((node: any) => {
    setHoveredNode(node?.id || null);
    if (containerRef.current) {
      containerRef.current.style.cursor = node ? 'pointer' : 'grab';
    }
  }, []);

  // Reset view to show all main categories
  const resetView = useCallback(() => {
    // Collapse all categories
    setExpandedCategories(new Set());
    
    // Cancel any ongoing constraint animation
    if (constraintAnimationFrameRef.current) {
      cancelAnimationFrame(constraintAnimationFrameRef.current);
      constraintAnimationFrameRef.current = null;
    }
    
    // Zoom to fit root + 4 main category nodes
    setTimeout(() => {
      if (!graphRef.current) return;
      
      // Calculate bounding box of root + 4 categories
      const rootPos = CATEGORY_POSITIONS['root'];
      const categoryNodes = ['experience', 'projects', 'research', 'skills'];
      
      let minX = rootPos.x - 45, maxX = rootPos.x + 45;
      let minY = rootPos.y - 45, maxY = rootPos.y + 45;
      
      categoryNodes.forEach(catId => {
        const pos = CATEGORY_POSITIONS[catId];
        const size = 35;
        minX = Math.min(minX, pos.x - size);
        maxX = Math.max(maxX, pos.x + size);
        minY = Math.min(minY, pos.y - size);
        maxY = Math.max(maxY, pos.y + size);
      });
      
      const width = maxX - minX;
      const height = maxY - minY;
      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;
      
      // Padding to fit nicely
      const paddingX = 200;
      const paddingY = 150;
      
      // Calculate zoom to fit
      const zoomX = dimensions.width / (width + paddingX);
      const zoomY = dimensions.height / (height + paddingY);
      const zoom = Math.min(zoomX, zoomY);
      
      // Center and zoom
      graphRef.current.zoom(zoom, 400);
      graphRef.current.centerAt(centerX, centerY, 400);
      viewStateRef.current = { centerX, centerY, zoom };
      
      // Restart constraint checking after animation
      setTimeout(() => {
        constrainView();
      }, 450);
    }, 100);
  }, [dimensions, constrainView]);

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
    <div ref={containerRef} className="w-full h-full relative" style={{ cursor: 'grab' }}>
      {/* Reset View Button - floating near bottom center, above chat button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.15, rotate: -180 }}
        whileTap={{ scale: 0.9 }}
        onClick={resetView}
        className="fixed bottom-32 left-1/2 -translate-x-1/2 z-30
                   p-3 rounded-full
                   bg-white/[0.08] backdrop-blur-sm
                   border border-white/20
                   text-white/60 hover:text-white
                   hover:bg-white/[0.15] hover:border-white/30
                   transition-all duration-300
                   shadow-lg shadow-black/30"
        title="Reset to overview"
      >
        <RotateCcw size={20} />
      </motion.button>

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
        onZoom={(transform: { k: number; x: number; y: number }) => {
          // Update zoom and calculate center from transform
          viewStateRef.current.zoom = transform.k;
          // Convert screen translation to graph coordinates
          viewStateRef.current.centerX = -transform.x / transform.k;
          viewStateRef.current.centerY = -transform.y / transform.k;
          // Only check constraints if we're not already applying them (prevents infinite loop)
          if (!isApplyingConstraintsRef.current) {
            constrainView();
          }
        }}
        onBackgroundClick={() => {
          // Trigger constraint check after pan (with slight delay to let pan complete)
          setTimeout(() => {
            constrainView();
          }, 10);
        }}
          nodeRelSize={1}
          backgroundColor="transparent"
          enableNodeDrag={false}
        enableZoomInteraction={true}
        enablePanInteraction={true}
          minZoom={0.1}
          maxZoom={3}
          cooldownTicks={0}
      />
      )}
    </div>
  );
}
