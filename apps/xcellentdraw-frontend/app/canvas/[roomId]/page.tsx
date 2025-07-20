"use client"
import React, { useEffect, useRef } from 'react'

const page = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");

        if(!ctx){
            return;
        }

        let clicked = false;
        let startX = 0;
        let startY = 0;

        
        canvas?.addEventListener("mousedown", (e)=>{
            clicked = true;
            startX = e.clientX;
            startY = e.clientY;

        })

        canvas?.addEventListener("mouseup", (e)=>{

        })

        canvas?.addEventListener("mousemove", (e)=>{
            if(clicked){
                const width = e.clientX - startX;
                const height = e.clientY - startY;
                ctx.clearRect(0,0,canvas.width, canvas.height);
                ctx.strokeRect(startX, startY, width, height);
            }
        })


      
    }, [canvasRef])
    
  return (
    <div>
        <canvas ref={canvasRef} width={500} height={500}></canvas>
    </div>
  )
}

export default page