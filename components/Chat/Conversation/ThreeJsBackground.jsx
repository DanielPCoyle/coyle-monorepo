import React, { useRef, useEffect } from "react";
import * as THREE from "three";

export const ThreeJsBackground = () => {
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);

    useEffect(() => {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);

        const geometry = new THREE.CircleGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(-5, 3, -4);
        // scene.add(cube);

        camera.position.z = 5;

        const animate = function () {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0;
            renderer.render(scene, camera);
        };

        animate();

        sceneRef.current = scene;
        rendererRef.current = renderer;

        return () => {
            mountRef?.current?.removeChild(renderer.domElement);
        };
    }, []);
    return <div ref={mountRef} style={{ position: "absolute", width: "100%", height:"75vh", zIndex: 0, overflow: "hidden" }} />;
};
