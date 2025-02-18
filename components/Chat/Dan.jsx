"use client";
import React from 'react';
export const Dan = ({tiny = false, name = "Dan"}) => {
    const [frame, setFrame] = React.useState(1);
    React.useEffect(() => {
        const interval = setInterval(() => {
            setFrame(frame => frame === 8 ? 1 : frame + 1);
        }, Math.floor(Math.random() * (500 - 100 + 1)) + 100);
        return () => clearInterval(interval);
    }, []);
    return <div
        className='dan'
    style={{ color: "red", width: tiny ? "300px" : "50vw",
        height: "auto", position: "fixed", 
        bottom: tiny ? -50 : "-90px", 
        right: tiny ? 0 : "-100px" }}

    >
        <div className="isTyping">{name} is typing...</div>
    </div>;
};
