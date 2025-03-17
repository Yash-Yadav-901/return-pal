
import React, { useRef, useEffect } from 'react';

interface Cube3DProps {
  size: number;
  rotation: number;
}

export const Cube3D: React.FC<Cube3DProps> = ({ size, rotation }) => {
  const cubeRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    let xRotation = 0;
    let yRotation = 0;
    let requestId: number;

    const animate = () => {
      if (cubeRef.current) {
        xRotation += rotation;
        yRotation += rotation * 1.5;
        
        cubeRef.current.style.transform = `rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;
      }
      
      requestId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(requestId);
    };
  }, [rotation]);

  const faceStyle = {
    position: 'absolute',
    width: `${size}px`,
    height: `${size}px`,
    border: '1px solid rgba(76, 120, 255, 0.3)',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(8px)',
  } as React.CSSProperties;

  return (
    <div className="perspective-3d" style={{ width: `${size}px`, height: `${size}px` }}>
      <div 
        ref={cubeRef} 
        className="rotate-3d relative"
        style={{ width: '100%', height: '100%' }}
      >
        {/* Front face */}
        <div 
          style={{
            ...faceStyle,
            transform: `translateZ(${size/2}px)`,
          }}
          className="hologram"
        />
        
        {/* Back face */}
        <div 
          style={{
            ...faceStyle,
            transform: `translateZ(-${size/2}px) rotateY(180deg)`,
          }}
          className="hologram"
        />
        
        {/* Right face */}
        <div 
          style={{
            ...faceStyle,
            transform: `translateX(${size/2}px) rotateY(90deg)`,
          }}
          className="hologram"
        />
        
        {/* Left face */}
        <div 
          style={{
            ...faceStyle,
            transform: `translateX(-${size/2}px) rotateY(-90deg)`,
          }}
          className="hologram"
        />
        
        {/* Top face */}
        <div 
          style={{
            ...faceStyle,
            transform: `translateY(-${size/2}px) rotateX(90deg)`,
          }}
          className="hologram"
        />
        
        {/* Bottom face */}
        <div 
          style={{
            ...faceStyle,
            transform: `translateY(${size/2}px) rotateX(-90deg)`,
          }}
          className="hologram"
        />
      </div>
    </div>
  );
};
