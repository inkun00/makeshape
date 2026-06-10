import React, { useCallback, useEffect, useRef, useState } from 'react';
import { verticesToSvgPath } from '../utils/geometry';
import '../styles/canvas.css';

const GRID_SIZE = 6;
const CENTER = 3;

export default function GridCanvas({
  width = 300,
  vertices = [],
  onChange,
  readOnly = false,
  isOriginal = false,
  hintActive = false,
  correctVertices = [],
  isSolved = false,
  isIncorrect = false,
  intermediateShape = null, // Used to render intermediate states if any
  isSimulating = false,
  simulatingVertices = null,
  simulatingAction = '',
  simulatingState = 'start'
}) {
  const svgRef = useRef(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  
  const cellSize = width / GRID_SIZE;

  // Convert SVG coordinates to grid coordinates (0-6)
  const getGridCoords = useCallback((e) => {
    if (!svgRef.current) return null;
    const rect = svgRef.current.getBoundingClientRect();
    
    // Support touch events as well
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Convert to grid index (0 to 6)
    const gridX = Math.round(x / cellSize);
    // Remember: our grid coordinate y=0 is bottom, SVG y=0 is top.
    const gridY = GRID_SIZE - Math.round(y / cellSize);

    // Clamp coordinates to grid boundaries
    return [
      Math.max(0, Math.min(GRID_SIZE, gridX)),
      Math.max(0, Math.min(GRID_SIZE, gridY))
    ];
  }, [cellSize]);

  // Handle click on canvas to add vertices
  const handleCanvasClick = (e) => {
    if (readOnly || draggedIndex !== null) return;
    
    const coords = getGridCoords(e);
    if (!coords) return;
    const [x, y] = coords;

    // Check if shape is already closed
    const isClosed = vertices.length > 2 && 
                     vertices[0][0] === vertices[vertices.length - 1][0] && 
                     vertices[0][1] === vertices[vertices.length - 1][1];

    if (isClosed) return; // Cannot add more vertices to a closed shape

    if (vertices.length === 0) {
      // Start drawing
      onChange([[x, y]]);
    } else {
      const first = vertices[0];
      const prev = vertices[vertices.length - 1];

      // If clicked the first vertex, close the polygon
      if (vertices.length >= 3 && x === first[0] && y === first[1]) {
        onChange([...vertices, [x, y]]);
      } 
      // Avoid duplicate consecutive vertices
      else if (x !== prev[0] || y !== prev[1]) {
        onChange([...vertices, [x, y]]);
      }
    }
  };

  // Handle pointer down on vertex to start drag
  const handleVertexPointerDown = (index, e) => {
    if (readOnly) return;
    e.stopPropagation();
    e.preventDefault();
    
    // Check if clicking the first vertex to close the shape
    const isClosed = vertices.length > 2 && 
                     vertices[0][0] === vertices[vertices.length - 1][0] && 
                     vertices[0][1] === vertices[vertices.length - 1][1];
                     
    if (index === 0 && vertices.length >= 3 && !isClosed) {
      onChange([...vertices, [...vertices[0]]]);
      return;
    }
    
    setDraggedIndex(index);
  };

  // Handle pointer move for dragging vertex
  useEffect(() => {
    const handlePointerMove = (e) => {
      if (draggedIndex === null) return;
      
      const coords = getGridCoords(e);
      if (!coords) return;
      const [x, y] = coords;

      const newVertices = [...vertices];
      
      // Update dragged vertex
      newVertices[draggedIndex] = [x, y];
      
      // If it's a closed shape and we dragged the first/last vertex, update both to keep it closed
      const isClosed = vertices.length > 2 && 
                       vertices[0][0] === vertices[vertices.length - 1][0] && 
                       vertices[0][1] === vertices[vertices.length - 1][1];
                       
      if (isClosed) {
        if (draggedIndex === 0) {
          newVertices[newVertices.length - 1] = [x, y];
        } else if (draggedIndex === newVertices.length - 1) {
          newVertices[0] = [x, y];
        }
      }

      onChange(newVertices);
    };

    const handlePointerUp = () => {
      setDraggedIndex(null);
    };

    if (draggedIndex !== null) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [draggedIndex, getGridCoords, vertices, onChange]);

  // Determine shape closed state
  const isShapeClosed = vertices.length > 2 && 
                        vertices[0][0] === vertices[vertices.length - 1][0] && 
                        vertices[0][1] === vertices[vertices.length - 1][1];

  // Helper to convert coordinate points to screen coordinates
  const toScreen = ([x, y]) => [x * cellSize, (GRID_SIZE - y) * cellSize];

  // Draw grid lines
  const gridLines = [];
  for (let i = 0; i <= GRID_SIZE; i++) {
    // Horizontal line
    gridLines.push(
      <line
        key={`h-${i}`}
        x1={0}
        y1={i * cellSize}
        x2={width}
        y2={i * cellSize}
        className={i === CENTER ? "grid-line-center" : "grid-line"}
      />
    );
    // Vertical line
    gridLines.push(
      <line
        key={`v-${i}`}
        x1={i * cellSize}
        y1={0}
        x2={i * cellSize}
        y2={width}
        className={i === CENTER ? "grid-line-center" : "grid-line"}
      />
    );
  }

  // Draw grid dot intersections
  const gridDots = [];
  for (let x = 0; x <= GRID_SIZE; x++) {
    for (let y = 0; y <= GRID_SIZE; y++) {
      const screenX = x * cellSize;
      const screenY = (GRID_SIZE - y) * cellSize;
      
      // We render a small dot at intersections
      const isCenter = x === CENTER && y === CENTER;
      gridDots.push(
        <circle
          key={`dot-${x}-${y}`}
          cx={screenX}
          cy={screenY}
          r={isCenter ? 4 : 2}
          className="grid-dot-node"
          fill={isCenter ? 'var(--color-accent)' : 'var(--text-secondary)'}
          style={{ opacity: isCenter ? 0.7 : 0.2 }}
        />
      );
    }
  }

  // Generate SVG Path
  const shapePath = verticesToSvgPath(vertices, cellSize, isOriginal || isShapeClosed);
  const correctPath = verticesToSvgPath(correctVertices, cellSize, true);
  const intermediatePath = intermediateShape ? verticesToSvgPath(intermediateShape, cellSize, true) : null;

  // Determine what styling class to apply to user shape
  let shapeClass = 'shape-target';
  if (isSolved) shapeClass = 'shape-correct';
  else if (isIncorrect) shapeClass = 'shape-incorrect';

  return (
    <svg
      ref={svgRef}
      width={width}
      height={width}
      className="grid-svg"
      onPointerDown={handleCanvasClick}
      style={{ touchAction: 'none' }}
    >
      {/* 1. Grid lines */}
      {gridLines}

      {/* 2. Grid dots */}
      {gridDots}

      {/* 3. Center point indicator (3, 3) */}
      <circle
        cx={CENTER * cellSize}
        cy={CENTER * cellSize}
        r={7}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth={1.5}
        strokeDasharray="2 1"
      />

      {/* 4. Translucent correct answer hint overlay */}
      {hintActive && correctVertices.length > 0 && (
        <path
          d={correctPath}
          className="shape-hint"
        />
      )}

      {/* 5. Intermediate shape for double flips */}
      {intermediateShape && (
        <path
          d={intermediatePath}
          fill="none"
          stroke="var(--text-secondary)"
          strokeWidth={2}
          strokeDasharray="4 4"
          opacity={0.6}
        />
      )}

      {/* 6. Active Drawing Shape */}
      {vertices.length > 0 && (
        <path
          d={shapePath}
          className={isOriginal ? 'shape-original' : shapeClass}
        />
      )}

      {/* 6.5. Simulation Overlay Shape */}
      {isSimulating && simulatingVertices && (
        <path
          d={verticesToSvgPath(simulatingVertices, cellSize, true)}
          style={{
            transformOrigin: `${width / 2}px ${width / 2}px`,
            transform: getSimulatingTransformStyle(simulatingAction, simulatingState),
            transition: 'transform 4.05s linear',
            fill: 'rgba(59, 130, 246, 0.45)',
            stroke: 'var(--color-original)',
            strokeWidth: 3.5,
            strokeLinejoin: 'round',
            strokeLinecap: 'round',
            pointerEvents: 'none'
          }}
        />
      )}

      {/* 7. Draw vertices nodes */}
      {vertices.map((pt, idx) => {
        const [sx, sy] = toScreen(pt);
        const isLast = idx === vertices.length - 1;
        
        // Hide last vertex if shape is closed (since it overlaps with the first)
        if (isShapeClosed && isLast) return null;

        return (
          <circle
            key={`vertex-${idx}`}
            cx={sx}
            cy={sy}
            r={isOriginal ? 5 : 6}
            className={`vertex ${isOriginal ? 'vertex-original' : 'vertex-target'}`}
            onPointerDown={(e) => handleVertexPointerDown(idx, e)}
          />
        );
      })}

      {/* 8. Text labels on the grid axes */}
      {Array.from({ length: GRID_SIZE + 1 }).map((_, i) => {
        const offset = 12;
        return (
          <React.Fragment key={`axis-labels-${i}`}>
            {/* X-axis labels at the bottom */}
            <text
              x={i * cellSize}
              y={width - 4}
              fontSize="10px"
              fill="var(--text-secondary)"
              textAnchor="middle"
              style={{ pointerEvents: 'none', userSelect: 'none', opacity: 0.6 }}
            >
              {i}
            </text>
            {/* Y-axis labels at the left */}
            {i < GRID_SIZE && (
              <text
                x={4}
                y={i * cellSize + offset}
                fontSize="10px"
                fill="var(--text-secondary)"
                style={{ pointerEvents: 'none', userSelect: 'none', opacity: 0.6 }}
              >
                {GRID_SIZE - i}
              </text>
            )}
          </React.Fragment>
        );
      })}
    </svg>
  );
}

// Helper for CSS animation transforms relative to center
const getSimulatingTransformStyle = (action, state) => {
  if (state === 'start') {
    return 'rotate(0deg) scale(1, 1)';
  }
  switch (action) {
    case 'rotate_cw_90':
      return 'rotate(90deg)';
    case 'rotate_cw_180':
      return 'rotate(180deg)';
    case 'rotate_cw_270':
      return 'rotate(270deg)';
    case 'rotate_ccw_90':
      return 'rotate(-90deg)';
    case 'rotate_ccw_180':
      return 'rotate(-180deg)';
    case 'rotate_ccw_270':
      return 'rotate(-270deg)';
    case 'flip_left':
    case 'flip_right':
      return 'scaleX(-1)';
    case 'flip_up':
    case 'flip_down':
      return 'scaleY(-1)';
    case 'flip_down_then_right':
    case 'flip_up_then_left':
      return 'scale(-1, -1)';
    default:
      return 'rotate(0deg) scale(1, 1)';
  }
};
