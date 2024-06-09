import React, { useEffect, useRef } from 'react';
import gsap from "gsap";

class MoonParticle {
  constructor(initX, initY, fill) {
    this.x = initX;
    this.y = initY;
    this.scale = 1;
    this.alpha = gsap.utils.random(0.7, 0.9);
    this.fillStyle = fill;
    const duration = gsap.utils.random(3, 5);

    this.scaleAnimation = gsap.timeline({ repeat: -1, yoyo: true });
    this.scaleAnimation.to(this, { scale: 1.3, duration: duration, ease: "sine.easeInOut" });

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
    context.arc(0, 0, 60, 0, Math.PI * 2, false);
    context.shadowColor = 'rgba(255, 255, 255, 0.5)';
    context.shadowBlur = 30;
    context.fill();
    context.globalCompositeOperation = 'destination-out';
    context.beginPath();
    context.arc(20, -20, 50, 0, Math.PI * 2, false);
    context.fill();
    context.restore();
  }
}

const NightAnimation = () => {
  const coordinates = { x: 550, y: 300 };
  const fill = '#FFFFFF';
  const canvasRef = useRef(null);
  const moonParticle = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const buildMoonParticle = (coordinates, fill) => new MoonParticle(coordinates.x, coordinates.y, fill);

    const animateMoonParticle = () => {
      canvas.width += 0;
      moonParticle.current.draw(context);
    };

    moonParticle.current = buildMoonParticle(coordinates, fill);

    gsap.ticker.add(animateMoonParticle);

    return () => {
      gsap.ticker.remove(animateMoonParticle);
    };
  }, []);

  return (
    <article className="sky" style={{ backgroundColor: '#001848' }}>
      <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
    </article>
  );
};

export default NightAnimation;
