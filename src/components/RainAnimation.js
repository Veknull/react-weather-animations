import React, { useEffect, useRef } from 'react';
import gsap from "gsap";

class Moon {
  constructor(initX, initY, fill) {
    this.x = initX;
    this.y = initY;
    this.scale = 1;
    this.alpha = gsap.utils.random(0.8, 1);
    this.fillStyle = fill;
    const duration = gsap.utils.random(3, 5);

    this.scaleAnimation = gsap.timeline({ repeat: -1, yoyo: true });
    this.scaleAnimation.to(this, { scale: 1.1, duration: duration, ease: "sine.easeInOut" });

    this.alphaAnimation = gsap.timeline({ repeat: -1, yoyo: true });
    this.alphaAnimation.to(this, { alpha: 1, duration: duration, ease: "sine.easeInOut" });
  }

  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.scale(this.scale, this.scale);
    context.globalAlpha = this.alpha;
    context.fillStyle = this.fillStyle;
    context.beginPath();
    context.arc(0, 0, 50, 0, Math.PI * 2, false);
    context.shadowColor = 'rgba(255, 255, 255, 0.5)';
    context.shadowBlur = 20;
    context.fill();
    context.restore();
  }
}

const NightAnimation = () => {
  const coordinates = { x: 600, y: 300 };
  const fill = '#FFFFFF';
  const canvasRef = useRef(null);
  const moon = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const buildMoon = (coordinates, fill) => new Moon(coordinates.x, coordinates.y, fill);

    const animateMoon = () => {
      canvas.width += 0; 
      moon.current.draw(context);
    };

    moon.current = buildMoon(coordinates, fill);

    gsap.ticker.add(animateMoon);

    return () => {
      gsap.ticker.remove(animateMoon);
    };
  }, []);

  return (
    <article className="night-sky" style={{ backgroundColor: '#001d3d', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
      <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
    </article>
  );
};

export default NightAnimation;
