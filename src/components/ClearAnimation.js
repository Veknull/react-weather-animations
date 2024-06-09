import React, { useEffect, useRef } from 'react';
import gsap from "gsap";

class SunParticle {
  constructor(initX, initY, fill) {
    this.x = initX;
    this.y = initY;
    this.scale = 1;
    this.alpha = gsap.utils.random(0.9, 1);
    this.fillStyle = fill;
    const duration = gsap.utils.random(3, 5);

    this.scaleAnimation = gsap.timeline({ repeat: -1, yoyo: true });
    this.scaleAnimation.to(this, { scale: 1.5, duration: duration, ease: "sine.easeInOut" });

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
    context.ellipse(0, 0, 100, 100, 0, 0, Math.PI * 2, false);
    context.shadowColor = 'rgba(255, 165, 0, 0.5)';
    context.shadowBlur = 50;
    context.fill();
    context.restore();
  }
}

class SunRay {
  constructor(initX, initY, length, angle) {
    this.x = initX;
    this.y = initY;
    this.length = length;
    this.angle = angle;
    this.scale = 1;
    const duration = gsap.utils.random(3, 5);

    this.scaleAnimation = gsap.timeline({ repeat: -1, yoyo: true });
    this.scaleAnimation.to(this, { scale: 1.2, duration: duration, ease: "sine.easeInOut" });
  }

  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.angle);
    context.scale(this.scale, this.scale);
    context.globalAlpha = 0.6;
    context.fillStyle = 'rgba(255, 165, 0, 0.5)';
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(this.length, -10);
    context.lineTo(this.length, 10);
    context.closePath();
    context.fill();
    context.restore();
  }
}

const ClearAnimation = () => {
  const coordinates = { x: 550, y: 300 };
  const fill = '#FFA500';
  const canvasRef = useRef(null);
  const sunParticle = useRef(null);
  const sunRays = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const buildSunParticle = (coordinates, fill) => new SunParticle(coordinates.x, coordinates.y, fill);

    const buildSunRays = (num, coordinates) => {
      let rays = [];
      for (let i = 0; i < num; i++) {
        const angle = (i / num) * Math.PI * 2;
        rays.push(new SunRay(coordinates.x, coordinates.y, 150, angle));
      }
      return rays;
    };

    const animateSunParticle = () => {
      canvas.width += 0;
      sunParticle.current.draw(context);
      sunRays.current.forEach(ray => ray.draw(context));
    };

    sunParticle.current = buildSunParticle(coordinates, fill);
    sunRays.current = buildSunRays(12, coordinates);

    gsap.ticker.add(animateSunParticle);

    return () => {
      gsap.ticker.remove(animateSunParticle);
    };
  }, []);

  return (
    <article className="sky" style={{ backgroundColor: '#87CEEB' }}>
      <canvas ref={canvasRef} width={1100} height={600}></canvas>
    </article>
  );
};

export default ClearAnimation;
