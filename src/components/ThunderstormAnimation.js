import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

class CloudParticle {
  constructor(initX, initY, fill) {
    this.x = initX;
    this.y = initY;
    this.scale = 1;
    this.alpha = 1;
    this.fillStyle = fill;

    this.scaleAnimation = gsap.timeline({ repeat: -1, yoyo: true });
    this.scaleAnimation.to(this, { scale: 1.05, duration: 2, ease: 'sine.easeInOut' });

    this.alphaAnimation = gsap.timeline({ repeat: -1, yoyo: true });
    this.alphaAnimation.to(this, { alpha: 0.95, duration: 2, ease: 'sine.easeInOut' });
  }

  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.scale(this.scale, this.scale);
    context.globalAlpha = this.alpha;
    context.fillStyle = this.fillStyle;
    context.beginPath();
    context.ellipse(0, 0, 80, 40, 0, 0, Math.PI * 2, false);
    context.shadowColor = 'rgba(0, 0, 0, 0.5)';
    context.shadowBlur = 20;
    context.fill();
    context.restore();
  }
}

class RainDrop {
  constructor(initX, initY) {
    this.x = initX;
    this.y = initY;
    this.length = 20;
    this.speed = gsap.utils.random(1, 3);

    this.fallAnimation = gsap.timeline({ repeat: -1 });
    this.fallAnimation.to(this, { y: `+=${this.speed * 30}`, duration: this.speed, ease: 'none' })
                      .set(this, { y: initY });
  }

  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.strokeStyle = 'rgba(173, 216, 230, 0.6)';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(0, this.length);
    context.stroke();
    context.restore();
  }
}

class Lightning {
  constructor(initX, initY) {
    this.x = initX;
    this.y = initY;
    this.active = false;
    this.alpha = 1;
  }

  strike(context) {
    if (this.active) {
      context.save();
      context.translate(this.x, this.y);
      context.strokeStyle = `rgba(255, 255, 255, ${this.alpha})`;
      context.lineWidth = 4;
      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(0, 200);
      context.stroke();
      context.restore();
    }
  }

  trigger() {
    this.active = true;
    this.alpha = 1;
    gsap.to(this, { alpha: 0, duration: 0.3, ease: 'power2.out', onComplete: () => this.active = false });
  }
}

const ThunderstormAnimation = () => {
  const canvasRef = useRef(null);
  const cloudParticles = useRef([]);
  const rainDrops = useRef([]);
  const lightningRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const buildCloudParticles = (num, canvasWidth, canvasHeight) => {
      let particles = [];
      for (let i = 0; i < num; i++) {
        const x = gsap.utils.random(0, canvasWidth);
        const y = gsap.utils.random(0, canvasHeight / 3);
        particles.push(new CloudParticle(x, y, '#777'));
      }
      return particles;
    };

    const buildRainDrops = (num, canvasWidth, canvasHeight) => {
      let drops = [];
      for (let i = 0; i < num; i++) {
        const x = gsap.utils.random(0, canvasWidth);
        const y = gsap.utils.random(-canvasHeight, 0);
        drops.push(new RainDrop(x, y));
      }
      return drops;
    };

    const animate = () => {
      canvas.width += 0;

      cloudParticles.current.forEach(particle => particle.draw(context));
      rainDrops.current.forEach(drop => drop.draw(context));
      lightningRef.current.strike(context);
    };

    cloudParticles.current = buildCloudParticles(10, canvas.width, canvas.height);
    rainDrops.current = buildRainDrops(200, canvas.width, canvas.height);
    lightningRef.current = new Lightning(gsap.utils.random(0, canvas.width), gsap.utils.random(0, canvas.height / 2));

    const lightningTrigger = () => {
      lightningRef.current.trigger();
    };

    gsap.ticker.add(animate);
    gsap.timeline({ repeat: -1, repeatDelay: gsap.utils.random(1, 5) })
        .call(lightningTrigger);

    return () => {
      gsap.ticker.remove(animate);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <article className="sky" style={{ backgroundColor: '#2c3e50' }}>
      <canvas ref={canvasRef}></canvas>
    </article>
  );
};

export default ThunderstormAnimation;
