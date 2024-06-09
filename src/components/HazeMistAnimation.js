import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

class HazeParticle {
  constructor(initX, initY, fill) {
    this.x = initX;
    this.y = initY;
    this.scale = gsap.utils.random(0.5, 1.5);
    this.alpha = gsap.utils.random(0.2, 0.5);
    this.fillStyle = fill;
    const duration = gsap.utils.random(5, 10);

    this.moveAnimation = gsap.timeline({ repeat: -1, yoyo: true });
    this.moveAnimation.to(this, { x: `+=${gsap.utils.random(-100, 100)}`, y: `+=${gsap.utils.random(-50, 50)}`, duration: duration, ease: 'sine.easeInOut' });

    this.alphaAnimation = gsap.timeline({ repeat: -1, yoyo: true });
    this.alphaAnimation.to(this, { alpha: gsap.utils.random(0.1, 0.5), duration: duration, ease: 'sine.easeInOut' });
  }

  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.scale(this.scale, this.scale);
    context.globalAlpha = this.alpha;
    context.fillStyle = this.fillStyle;
    context.beginPath();
    context.ellipse(0, 0, 100, 50, 0, 0, Math.PI * 2, false);
    context.fill();
    context.restore();
  }
}

const HazeAnimation = () => {
  const canvasRef = useRef(null);
  const hazeParticles = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const buildHazeParticles = (num, canvasWidth, canvasHeight) => {
      let particles = [];
      for (let i = 0; i < num; i++) {
        const x = gsap.utils.random(0, canvasWidth);
        const y = gsap.utils.random(0, canvasHeight);
        particles.push(new HazeParticle(x, y, 'rgba(200, 200, 200, 0.5)'));
      }
      return particles;
    };

    const animate = () => {
      canvas.width += 0; // Clear canvas

      hazeParticles.current.forEach(particle => particle.draw(context));
    };

    hazeParticles.current = buildHazeParticles(50, canvas.width, canvas.height);

    gsap.ticker.add(animate);

    return () => {
      gsap.ticker.remove(animate);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <article className="sky" style={{ backgroundColor: '#708090' }}>
      <canvas ref={canvasRef}></canvas>
    </article>
  );
};

export default HazeAnimation;
