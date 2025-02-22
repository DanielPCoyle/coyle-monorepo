import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Message } from "./Message";
import {ChatContext} from "../../context/chatContext";


export const ThreeJsMessages = () => {
    const { messages, username, socket } = React.useContext(ChatContext);
    // const mountRef = useRef(null);
    // const sceneRef = useRef(null);
    // const rendererRef = useRef(null);
    const contentRef = useRef(null);
    // const cameraRef = useRef(null);
    // const fontRef = useRef(null);
    // const cameraTargetY = useRef(5);
    // const userScrolled = useRef(false);
    // const modelRef = useRef(null);

    // const [rotateModel, setRotateModel] = useState(false);

    // useEffect(() => {
    //     const scene = new THREE.Scene();
    //     const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    //     camera.position.set(0, 5, 10);
    //     cameraRef.current = camera;

    //     const renderer = new THREE.WebGLRenderer({ antialias: true });
    //     renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    //     mountRef.current.appendChild(renderer.domElement);
    //     rendererRef.current = renderer;

    //     const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    //     scene.add(ambientLight);
    //     const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    //     directionalLight.position.set(2, 2, 2);
    //     scene.add(directionalLight);

    //     scene.background = new THREE.Color('white');
    //     sceneRef.current = scene;

    //     const fontLoader = new FontLoader();
    //     fontLoader.load("https://threejs.org/examples/fonts/helvetiker_regular.typeface.json", (font) => {
    //         fontRef.current = font;
    //     });

       

    //     const handleResize = () => {
    //         renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    //         camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
    //         camera.updateProjectionMatrix();
    //     };
    //     window.addEventListener("resize", handleResize);

    //     const handleScroll = (event) => {
    //         userScrolled.current = true;
    //         const scrollY = window.scrollY;
    //         cameraTargetY.current = 5 - scrollY * 0.001; // Adjust the multiplier as needed
    //     };
    //     window.addEventListener("scroll", handleScroll);

    //     const animate = () => {
    //         requestAnimationFrame(animate);
    //         camera.position.y += (cameraTargetY.current - camera.position.y) * 0.1;
    //         renderer.render(scene, camera);
    //     };
    //     animate();

    //     return () => {
    //         mountRef.current.removeChild(renderer.domElement);
    //         renderer.dispose();
    //         window.removeEventListener("resize", handleResize);
    //         window.removeEventListener("scroll", handleScroll);
    //     };
    // }, []);



    // useEffect(() => {
    //     const handleContentScroll = () => {
    //         const scrollTop = contentRef.current.scrollTop;
    //         cameraTargetY.current = 5 - scrollTop * 0.01; // Adjust the multiplier as needed
    //     };

    //     contentRef.current.addEventListener("scroll", handleContentScroll);

    //     return () => {
    //         contentRef.current.removeEventListener("scroll", handleContentScroll);
    //     };
    // }, []);

 

    // useEffect(() => {
    //     if (cameraRef.current) {
    //         cameraRef.current.updateProjectionMatrix();
    //     }
    // }, []);

    // useEffect(() => {
    //     const handleClick = (event) => {
    //         const mouse = new THREE.Vector2();
    //         mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    //         mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    //         const raycaster = new THREE.Raycaster();
    //         raycaster.setFromCamera(mouse, cameraRef.current);

    //         const intersects = raycaster.intersectObjects(sceneRef.current.children, true);
    //         for (const intersect of intersects) {
    //             if (intersect.object.userData?.url) {
    //                 window.open(intersect.object.userData.url, '_blank');
    //                 return;
    //             }
    //         }
    //     };

    //     window.addEventListener("click", handleClick);
    //     return () => {
    //         window.removeEventListener("click", handleClick);
    //     };
    // }, []);





    // useEffect(() => {
    //     if (modelRef.current) {
    //         const rotate = () => {
    //             if (rotateModel) {
    //                 modelRef.current.rotation.y = rotateModel; // Adjust the rotation speed as needed
    //             }
    //             requestAnimationFrame(rotate);
    //         };
    //         rotate();
    //     }
    // }, [rotateModel]);

    return (
        <>
          
            {/* <div ref={mountRef} style={{ position: "fixed", width: "100%", height: "100vh", zIndex: 0 }} /> */}
            <div ref={contentRef}
                className="messageContainer"
                style={{ position: "relative", width: "55%", margin: "auto", zIndex: 1, color: "white", padding: "10px", paddingBottom: "50vh", paddingTop: "1vh" }}>
                {messages.map((message, index) => (
                    <Message key={index} {...{ message, username }} index={index} socket={socket} />
                ))}
            </div>
        </>
    );
};
