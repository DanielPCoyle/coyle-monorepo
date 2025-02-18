import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Message } from "./Message";

export const ThreeJsMessages = ({ messages, username, socket, color, files, currentConversation }) => {
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const contentRef = useRef(null);
    const cameraRef = useRef(null);
    const fontRef = useRef(null);
    const cameraTargetY = useRef(5);
    const userScrolled = useRef(false);
    const modelRef = useRef(null);

    const [textureScale, setTextureScale] = useState(4);
    const [textureOffsetX, setTextureOffsetX] = useState(-0.55);
    const [textureOffsetY, setTextureOffsetY] = useState(-0.55);
    const [rotateModel, setRotateModel] = useState(false);

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

        scene.background = new THREE.Color('black');
        sceneRef.current = scene;

        const fontLoader = new FontLoader();
        fontLoader.load("https://threejs.org/examples/fonts/helvetiker_regular.typeface.json", (font) => {
            fontRef.current = font;
        });

        const gltfLoader = new GLTFLoader();
        gltfLoader.load('/shirt/scene.gltf', (gltf) => {
            const model = gltf.scene;
            model.scale.set(30, 30, 30); // Adjust the scale as needed to make it larger
            model.position.set(0, -30, -20); // Adjust the position as needed
            scene.add(model);
            modelRef.current = model;

            const texture = new THREE.Texture();
            const canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 256;
            const context = canvas.getContext('2d');
            context.fillStyle = color ?? 'yellow';
            context.fillRect(0, 0, canvas.width, canvas.height);
            texture.image = canvas;
            texture.needsUpdate = true;

            model.traverse((child) => {
                if (child.isMesh) {
                    child.material.map = texture;
                    child.material.needsUpdate = true;
                    // scale down the texture to fit the model
                    child.material.map.repeat.set(textureScale, textureScale);
                    // position the texture on the model
                    child.material.map.offset.set(textureOffsetX, textureOffsetY);
                }
            });

            // const rotateModel = () => {
            //     requestAnimationFrame(rotateModel);
            //     model.rotation.y += .005; // Adjust the rotation speed as needed
            // };
            // rotateModel();
        }, undefined, (error) => {
            console.error('An error occurred while loading the GLTF model:', error);
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
        if (modelRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 256;
            const context = canvas.getContext('2d');
            context.fillStyle = color ?? 'yellow';
            context.fillRect(0, 0, canvas.width, canvas.height);
            const texture = new THREE.Texture(canvas);
            texture.needsUpdate = true;

            modelRef.current.traverse((child) => {
            if (child.isMesh) {
                child.material.map = texture;
                child.material.map.repeat.set(textureScale, textureScale);
                child.material.map.offset.set(textureOffsetX, textureOffsetY);
                child.material.needsUpdate = true;
            }
            });
        }
    }, [color, textureScale, textureOffsetX, textureOffsetY]);

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


   useEffect(() => {
    if (modelRef.current && files.length > 0) {
        const file = files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const photoTexture = new THREE.Texture(img);
                photoTexture.wrapS = THREE.RepeatWrapping;
                photoTexture.wrapT = THREE.RepeatWrapping;
                photoTexture.needsUpdate = true;

                modelRef.current.traverse((child) => {
                    if (child.isMesh) {
                        const baseTexture = child.material.map;
                        if (!baseTexture || !baseTexture.image) return;

                        const canvas = document.createElement('canvas');
                        canvas.width = 256;
                        canvas.height = 256;
                        const context = canvas.getContext('2d');

                        // Draw base texture
                        context.drawImage(baseTexture.image, 0, 0, canvas.width, canvas.height);

                        // Overlay new texture
                        context.globalAlpha = 0.5; // Adjust transparency
                        context.drawImage(img, 0, 0, canvas.width, canvas.height);

                        const combinedTexture = new THREE.CanvasTexture(canvas);
                        combinedTexture.wrapS = THREE.RepeatWrapping;
                        combinedTexture.wrapT = THREE.RepeatWrapping;
                        combinedTexture.repeat.set(textureScale, textureScale);
                        combinedTexture.offset.set(textureOffsetX, textureOffsetY);
                        combinedTexture.needsUpdate = true;

                        child.material.map = combinedTexture;
                        child.material.needsUpdate = true;
                    }
                });
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
}, [files, textureScale, textureOffsetX, textureOffsetY]); // Dependencies ensure updates

useEffect(() => {
    if (!modelRef.current) return;
    
    modelRef.current.traverse((child) => {
        if (child.isMesh && child.material.map) {
            child.material.map.wrapS = THREE.RepeatWrapping;
            child.material.map.wrapT = THREE.RepeatWrapping;
            child.material.map.repeat.set(textureScale, textureScale);
            child.material.map.offset.set(textureOffsetX, textureOffsetY);
            child.material.needsUpdate = true;
        }
    });
}, [textureScale, textureOffsetX, textureOffsetY]);



    useEffect(() => {
        if (modelRef.current) {
            const rotate = () => {
                if (rotateModel) {
                    modelRef.current.rotation.y = rotateModel; // Adjust the rotation speed as needed
                }
                requestAnimationFrame(rotate);
            };
            rotate();
        }
    }, [rotateModel]);

    return (
        <>
            <div style={{ position: "fixed", top: 0, right: -500, width: "100%", zIndex: 9999, backgroundColor: "black", color: "white", padding: "10px" }}>
                <label>
                    {currentConversation?.id}
                </label>
                <label>
                    
                    Texture Scale:
                    <input type="range" step={0.01} max={100} min={-100} value={textureScale} onChange={(event) => setTextureScale(event.target.value)} />
                </label>
                <label>
                    Texture Offset X:
                    <input type="range" step={0.01} max={3} min={1} value={textureOffsetX} onChange={(event) => setTextureOffsetX(event.target.value)} />
                </label>
                <label>
                    Texture Offset Y:
                    <input type="range" step={0.01} max={3} min={1} value={textureOffsetY} onChange={(event) => setTextureOffsetY(event.target.value)} />
                </label>
                <label>
                    Rotate Model:
                    <input type="range" step={0.01} max={3} min={-3} value={rotateModel} onChange={(event) => setRotateModel(event.target.value)} />
                </label>
            </div>

            <div ref={mountRef} style={{ position: "fixed", width: "100%", height: "100vh", zIndex: 0 }} />
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
