import React, { useEffect, useRef } from 'react';

const Background = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Dot class
    class Dot {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 3 + 1;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        this.velocityX = (Math.random() - 0.5) * 2;
        this.velocityY = (Math.random() - 0.5) * 2;
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
      }
      
      update() {
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
          this.velocityX = -this.velocityX;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
          this.velocityY = -this.velocityY;
        }
      }
    }
    
    // Initialize dots before using them
    const dots = Array.from({ length: 50 }, () => new Dot());
    console.log('Dots initialized:', dots.length);
    
    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Reset dots positions when resizing
      dots.forEach(dot => {
        dot.x = Math.random() * canvas.width;
        dot.y = Math.random() * canvas.height;
      });
      console.log('Canvas resized to:', canvas.width, canvas.height);
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    let mouse = { x: -1000, y: -1000 };
    
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      mouse.x = (e.clientX - rect.left) * scaleX;
      mouse.y = (e.clientY - rect.top) * scaleY;
    };
    
    const handleMouseOut = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };
    
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseOut);
    
    let frameCount = 0;
    const animate = () => {
      frameCount++;
      if (frameCount % 60 === 0) {
        console.log('Animation running, frame:', frameCount);
      }
      
      // Clear canvas completely
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      dots.forEach((dot, index) => {
        dot.update();
        dot.draw();
        
        const distance = Math.sqrt(
          Math.pow(mouse.x - dot.x, 2) + Math.pow(mouse.y - dot.y, 2)
        );
        
        if (distance < 100) {
          ctx.beginPath();
          ctx.moveTo(dot.x, dot.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = 'white';
          ctx.lineWidth = 0.5;
          ctx.stroke();
          ctx.closePath();
        }
        
        if (index === 0 && frameCount % 60 === 0) {
          console.log('Dot 0 position:', dot.x, dot.y);
        }
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    console.log('Starting animation');
    animate();
    
    return () => {
      console.log('Cleaning up');
      window.removeEventListener('resize', updateCanvasSize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  const canvasStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
    background: 'black',
    display: 'block'
  };
  
  return (
    <canvas 
      ref={canvasRef}
      style={canvasStyle}
    />
  );
};

export default Background;