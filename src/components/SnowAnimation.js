import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

class Snowflake {
  constructor(initX, initY, canvasHeight) {
    this.x = initX;
    this.y = initY;
    this.size = gsap.utils.random(2, 6);
    this.speed = gsap.utils.random(2, 5);
    this.canvasHeight = canvasHeight;
    this.alpha = gsap.utils.random(0.6, 1);

    this.fallAnimation = gsap.timeline({ repeat: -1 });
    this.fallAnimation.to(this, { y: this.canvasHeight, duration: this.speed, ease: 'none' })
                      .set(this, { y: gsap.utils.random(-this.canvasHeight, 0) });
  }

  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.globalAlpha = this.alpha;
    context.fillStyle = 'white';
    context.beginPath();
    context.arc(0, 0, this.size, 0, Math.PI * 2, false);
    context.fill();
    context.restore();
  }
}

const SnowAnimation = () => {
  const canvasRef = useRef(null);
  const snowflakes = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const buildSnowflakes = (num, canvasWidth, canvasHeight) => {
      let flakes = [];
      for (let i = 0; i < num; i++) {
        const x = gsap.utils.random(0, canvasWidth);
        const y = gsap.utils.random(-canvasHeight, 0);
        flakes.push(new Snowflake(x, y, canvasHeight));
      }
      return flakes;
    };

    const animate = () => {
      canvas.width += 0;

      snowflakes.current.forEach(flake => flake.draw(context));
    };

    snowflakes.current = buildSnowflakes(200, canvas.width, canvas.height);

    gsap.ticker.add(animate);

    return () => {
      gsap.ticker.remove(animate);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <article className="sky" style={{ backgroundColor: '#ADD8E6' }}>
      <canvas ref={canvasRef}></canvas>
    </article>
  );
};

export default SnowAnimation;
