import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { Dan } from "./Dan";
import { Message } from "./Message";


export const ThreeJsMessages = ({ messages, username,  socket }) => {
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const contentRef = useRef(null);
    const cameraRef = useRef(null);
    const fontRef = useRef(null);
    const topMessageY = useRef(5);
    const cameraTargetY = useRef(5);
    const userScrolled = useRef(false);
    

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.set(0, 5, 10);
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        mountRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(2, 2, 2);
        scene.add(directionalLight);

        sceneRef.current = scene;

        const fontLoader = new FontLoader();
        fontLoader.load("https://threejs.org/examples/fonts/helvetiker_regular.typeface.json", (font) => {
            fontRef.current = font;
        });

        const handleResize = () => {
            renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
            camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
            camera.updateProjectionMatrix();
        };
        window.addEventListener("resize", handleResize);

        const handleScroll = (event) => {
            userScrolled.current = true;
            const scrollY = window.scrollY;
            cameraTargetY.current = 5 - scrollY * 0.001; // Adjust the multiplier as needed
        };
        window.addEventListener("scroll", handleScroll);

        // Add particle effect
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 5000;
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 100;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });

        const colors = [];
        for (let i = 0; i < particlesCount; i++) {
            colors.push(Math.random(), Math.random(), Math.random());
        }
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));

        const particles = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particles);

        const animate = () => {
            requestAnimationFrame(animate);
            camera.position.y += (cameraTargetY.current - camera.position.y) * 0.1;
            renderer.render(scene, camera);
        };
        animate();

        return () => {
            mountRef.current.removeChild(renderer.domElement);
            renderer.dispose();
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        const handleContentScroll = () => {
            const scrollTop = contentRef.current.scrollTop;
            cameraTargetY.current = 5 - scrollTop * 0.01; // Adjust the multiplier as needed
        };

        contentRef.current.addEventListener("scroll", handleContentScroll);

        return () => {
            contentRef.current.removeEventListener("scroll", handleContentScroll);
        };
    }, []);

    useEffect(() => {
        const handleMouseMove = (event) => {
            const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

            sceneRef.current.children.forEach((child) => {
                if (child instanceof THREE.Mesh) {
                    child.rotation.x = mouseY * 0.1;
                    child.rotation.y = mouseX * 0.1;
                }
            });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    useEffect(() => {
        if (cameraRef.current) {
            cameraRef.current.updateProjectionMatrix();
        }
    }, []);

    useEffect(() => {
        const handleClick = (event) => {
            const mouse = new THREE.Vector2();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, cameraRef.current);
    
            const intersects = raycaster.intersectObjects(sceneRef.current.children, true);
            for (const intersect of intersects) {
                if (intersect.object.userData?.url) {
                    window.open(intersect.object.userData.url, '_blank');
                    return;
                }
            }
        };
    
        window.addEventListener("click", handleClick);
        return () => {
            window.removeEventListener("click", handleClick);
        };
    }, []);

    return (
        <>
            <div ref={mountRef} style={{ position: "fixed", width: "100%", height: "100vh", zIndex: 0 }} />
            <div ref={contentRef}
            className="messageContainer"
            style={{ position: "relative", width: "55%", margin: "auto", zIndex: 1, color: "white", padding: "10px", paddingBottom: "50vh", paddingTop: "1vh" }}>
                {messages.map((message, index) => (
                    <Message key={index} {...{message,username}} index={index} socket={socket} />
                ))}
            </div>
        </>
    );
};