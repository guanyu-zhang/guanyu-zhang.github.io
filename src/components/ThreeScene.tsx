'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeScene = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    // Starfield
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 10000;
    const posArray = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 2000;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Create a star texture with a central circle and fine points
    const createStarCanvas = () => {
      const canvas = document.createElement('canvas');
      const size = 128; // Texture resolution
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const centerX = size / 2;
        const centerY = size / 2;
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(centerX, centerY, size / 2, 0, 2 * Math.PI); // Draw a full, solid circle
        ctx.fill();
      }
      return canvas;
    };

    const starTexture = new THREE.CanvasTexture(createStarCanvas());

    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.7, // Reverted to original size as requested
      map: starTexture,
    });
    const starMesh = new THREE.Points(starGeometry, starMaterial);
    scene.add(starMesh);

    camera.position.z = 5;

    // Mouse movement
    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (event: MouseEvent) => {
        mouseX = event.clientX - (currentMount.clientWidth / 2);
        mouseY = event.clientY - (currentMount.clientHeight / 2);
    };
    currentMount.addEventListener('mousemove', onMouseMove);

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);

      starMesh.rotation.x += 0.0001;
      starMesh.rotation.y += 0.0001;

      if (mouseX !== 0) {
        camera.position.x += (mouseX * 0.00005 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 0.00005 - camera.position.y) * 0.05;
      }
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    animate();

    // Handle Resize
    const onResize = () => {
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', onResize);
      currentMount.removeEventListener('mousemove', onMouseMove);
      currentMount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0 }} />;
};

export default ThreeScene;
