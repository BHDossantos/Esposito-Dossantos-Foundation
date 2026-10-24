'use client';

import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

/**
 * A subtle WebGL centerpiece for the hero: a faceted champagne form that
 * rotates slowly and drifts with the cursor, over the navy backdrop.
 *
 * Performance & resilience:
 *  - three.js is dynamically imported, so it ships as its own client chunk and
 *    never touches the server bundle or initial paint.
 *  - Device pixel ratio is capped; the render loop pauses when the hero is
 *    scrolled out of view or the tab is hidden.
 *  - Honors prefers-reduced-motion (renders a single static frame, no loop).
 *  - If WebGL is unavailable it silently does nothing — the gradient hero
 *    backdrop remains on its own.
 */
export default function Hero3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let cleanup = () => {};

    (async () => {
      let THREE: typeof import('three');
      try {
        THREE = await import('three');
      } catch {
        return; // three failed to load — leave the backdrop as-is
      }
      if (disposed || !mount) return;

      const reduced = prefersReducedMotion();

      let renderer: import('three').WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      } catch {
        return; // no WebGL context available
      }

      const width = mount.clientWidth || 1;
      const height = mount.clientHeight || 1;

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setSize(width, height);
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
      camera.position.set(0, 0, 6);

      // Faceted core + a brighter edge overlay, in the champagne palette.
      const group = new THREE.Group();
      const geometry = new THREE.IcosahedronGeometry(2, 1);

      const core = new THREE.Mesh(
        geometry,
        new THREE.MeshStandardMaterial({
          color: 0x1b2f4e, // deep navy facets
          metalness: 0.6,
          roughness: 0.35,
          flatShading: true,
          transparent: true,
          opacity: 0.92
        })
      );
      group.add(core);

      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(geometry),
        new THREE.LineBasicMaterial({ color: 0xc9a86a, transparent: true, opacity: 0.85 })
      );
      group.add(edges);

      group.rotation.set(0.5, 0.4, 0);
      scene.add(group);

      // Champagne key light + cool rim light for depth.
      const key = new THREE.DirectionalLight(0xf0dcae, 2.1);
      key.position.set(4, 5, 6);
      scene.add(key);
      const rim = new THREE.DirectionalLight(0x6f8fc0, 1.1);
      rim.position.set(-6, -3, -4);
      scene.add(rim);
      scene.add(new THREE.AmbientLight(0x404a63, 0.9));

      // Cursor-driven drift (desktop only; smoothed).
      let targetX = 0;
      let targetY = 0;
      function onMove(e: MouseEvent) {
        targetX = (e.clientX / window.innerWidth - 0.5) * 0.6;
        targetY = (e.clientY / window.innerHeight - 0.5) * 0.4;
      }
      if (!reduced) window.addEventListener('mousemove', onMove, { passive: true });

      function resize() {
        if (!mount) return;
        const w = mount.clientWidth || 1;
        const h = mount.clientHeight || 1;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
      window.addEventListener('resize', resize, { passive: true });

      // Pause the loop when the hero is offscreen or the tab is hidden.
      let visible = true;
      const io = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
          if (visible && !reduced) loop();
        },
        { threshold: 0 }
      );
      io.observe(mount);

      let raf = 0;
      const start = performance.now();

      function renderFrame(now: number) {
        const t = (now - start) / 1000;
        group.rotation.y += 0.0012;
        group.rotation.x += 0.0005;
        // Gentle float + cursor lean.
        group.position.y = Math.sin(t * 0.8) * 0.12;
        group.rotation.z = targetX * 0.15;
        camera.position.x += (targetX * 1.2 - camera.position.x) * 0.04;
        camera.position.y += (-targetY * 1.0 - camera.position.y) * 0.04;
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
      }

      function loop() {
        if (disposed || !visible || reduced) return;
        raf = requestAnimationFrame(loop);
        renderFrame(performance.now());
      }

      function onVisibility() {
        if (document.hidden) {
          if (raf) cancelAnimationFrame(raf);
          raf = 0;
        } else if (visible && !reduced) {
          loop();
        }
      }
      document.addEventListener('visibilitychange', onVisibility);

      if (reduced) {
        renderFrame(performance.now()); // single static frame
      } else {
        loop();
      }

      cleanup = () => {
        if (raf) cancelAnimationFrame(raf);
        io.disconnect();
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('resize', resize);
        document.removeEventListener('visibilitychange', onVisibility);
        geometry.dispose();
        (core.material as import('three').Material).dispose();
        (edges.geometry as import('three').BufferGeometry).dispose();
        (edges.material as import('three').Material).dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode === mount) {
          mount.removeChild(renderer.domElement);
        }
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 right-0 z-[1] hidden w-1/2 lg:block"
    />
  );
}
