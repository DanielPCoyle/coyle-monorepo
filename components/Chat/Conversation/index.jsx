import React, { useRef, useState } from "react";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Message } from "./Message";
import { ChatContext } from "../ChatContext";
import { ThreeJsBackground } from "./ThreeJsBackground";

export const Conversation = () => {
    const { messages, username, socket } = React.useContext(ChatContext);
    const contentRef = useRef(null);
    return (
        <>
                <ThreeJsBackground/>
            <div ref={contentRef}
                className="messageContainer"
                >

                <div style={{width: "90%", margin: "auto"}}>
                    {messages.map((message, index) => (
                        <Message key={index} {...{ message, username }} index={index} socket={socket} />
                    ))}
                </div>
            </div>
        </>
    );
};