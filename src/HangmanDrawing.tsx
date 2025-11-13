import { useCallback, useRef, useState, useEffect } from "react";

type HangmanDrawingProps = {
  numberOfGuesses: number;
  isWinner?: boolean;
};

type DragPosition = {
  x: number;
  y: number;
};

export function HangmanDrawing({ numberOfGuesses, isWinner = false }: HangmanDrawingProps) {
  const [position, setPosition] = useState<DragPosition>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const pointerIdRef = useRef<number | null>(null);
  const dragStartRef = useRef<DragPosition | null>(null);
  const originRef = useRef<DragPosition | null>(null);
  const animationRef = useRef<number | null>(null);

  const ROPE_BASE_LENGTH = 55;
  const ROPE_MIN_LENGTH = 30;
  const MAX_STRETCH = 120;
  const MAX_SWING = 80;
  const SPRING_STRENGTH = 0.15;
  const DAMPING = 0.85;

  const handlePointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    // Prevent default to avoid scrolling on mobile
    event.preventDefault();
    if (event.button !== 0 && event.pointerType === "mouse") return;
    
    pointerIdRef.current = event.pointerId;
    dragStartRef.current = { x: event.clientX, y: event.clientY };
    originRef.current = { ...position };
    
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Ignore capture errors on some mobile browsers
    }
    
    setIsDragging(true);
  }, [position]);

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || pointerIdRef.current !== event.pointerId) return;
    if (!dragStartRef.current || !originRef.current) return;

    // Prevent default to avoid scrolling on mobile
    event.preventDefault();
    
    const deltaX = event.clientX - dragStartRef.current.x;
    const deltaY = event.clientY - dragStartRef.current.y;
    
    // Scale movement for mobile (smaller screens need more sensitive touch)
    const isMobile = event.pointerType === 'touch';
    const scaleFactor = isMobile ? 1.2 : 1;
    
    const newX = originRef.current.x + (deltaX * scaleFactor);
    const newY = originRef.current.y + (deltaY * scaleFactor);
    
    // Constrain to rope limits
    const clampedX = Math.max(-MAX_SWING, Math.min(MAX_SWING, newX));
    const clampedY = Math.max(-25, Math.min(MAX_STRETCH, newY));

    setPosition({
      x: clampedX,
      y: clampedY,
    });
  }, [isDragging]);

  const endDragging = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== null) {
      try {
        event.currentTarget.releasePointerCapture(pointerIdRef.current);
      } catch {
        // Pointer might already be released; ignore
      }
    }
    pointerIdRef.current = null;
    dragStartRef.current = null;
    originRef.current = null;
    setIsDragging(false);
    
    // Start spring-back animation with simpler approach
    let currentVelocity = { x: 0, y: 0 };
    
    const animate = () => {
      setPosition(prev => {
        const springForceX = -prev.x * SPRING_STRENGTH;
        const springForceY = -prev.y * SPRING_STRENGTH;
        
        currentVelocity.x = (currentVelocity.x + springForceX) * DAMPING;
        currentVelocity.y = (currentVelocity.y + springForceY) * DAMPING;
        
        const newX = prev.x + currentVelocity.x;
        const newY = prev.y + currentVelocity.y;
        
        // Stop animation when close to center
        if (Math.abs(newX) < 0.5 && Math.abs(newY) < 0.5 && Math.abs(currentVelocity.x) < 0.1 && Math.abs(currentVelocity.y) < 0.1) {
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
          }
          return { x: 0, y: 0 };
        }
        
        if (animationRef.current) {
          animationRef.current = requestAnimationFrame(animate);
        }
        
        return { x: newX, y: newY };
      });
    };
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    animationRef.current = requestAnimationFrame(animate);
  }, []);

  const handlePointerUp = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== event.pointerId) return;
    endDragging(event);
  }, [endDragging]);

  const handlePointerCancel = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== event.pointerId) return;
    endDragging(event);
  }, [endDragging]);

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const HEAD = (
    <div key="head" className={`hangman-head ${isWinner ? 'winner' : ''}`}>
      <div className="face-eye left" />
      <div className="face-eye right" />
      <div className="face-mouth" />
    </div>
  );

  const BODY = (
    <div key="body" className="hangman-body" />
  );

  const RIGHT_ARM = (
    <div key="right-arm" className="hangman-arm right" />
  );

  const LEFT_ARM = (
    <div key="left-arm" className="hangman-arm left" />
  );

  const RIGHT_LEG = (
    <div key="right-leg" className="hangman-leg right" />
  );

  const LEFT_LEG = (
    <div key="left-leg" className="hangman-leg left" />
  );

  const BODY_PARTS = [HEAD, BODY, RIGHT_ARM, LEFT_ARM, RIGHT_LEG, LEFT_LEG];

  const ropeLength = Math.max(ROPE_MIN_LENGTH, ROPE_BASE_LENGTH + position.y);
  const ropeAngle = Math.atan2(position.x, ropeLength) * (180 / Math.PI);
  const ropeStyle = {
    height: `${ropeLength}px`,
    transform: `rotate(${-ropeAngle}deg)`,
    transformOrigin: 'top center'
  } as const;

  return (
    <div className="hangman-drawing">
      {/* Mobile drag hint */}
      {numberOfGuesses >= 1 && (
        <div className="mobile-drag-hint">
          👆 Drag the hangman!
        </div>
      )}
      <div className="hangman-parts">
        <div
          className={`hangman-figure${isDragging ? ' is-dragging' : ''}`}
          style={{ 
            transform: `translate(${position.x}px, ${position.y}px)`,
            touchAction: 'none', // Prevent default touch behaviors
            userSelect: 'none'   // Prevent text selection on drag
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
        >
          {isWinner ? [...BODY_PARTS.slice(0, Math.max(1, numberOfGuesses))] :
          BODY_PARTS.slice(0, numberOfGuesses)}
        </div>

        {/* Gallows structure */}
        <div className="gallows-rope" style={ropeStyle} />
        <div className="gallows-beam" />
        <div className="gallows-pole" />
        <div className="gallows-base" />
      </div>
    </div>
  );
}
