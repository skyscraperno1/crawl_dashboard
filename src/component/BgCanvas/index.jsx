import { useEffect, useRef } from "react";
import { drawCanvas } from "./drawCanvas";

export default function BgCanvas(props) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const cvs = canvasRef.current;
    drawCanvas(cvs)
  })
  const top = () => {
    return `${props.index}00vh`
  }
  return (
    <canvas ref={canvasRef} id='bg-canvas' className='absolute left-0 w-full h-[100vh] bg-black z-[-1]' style={{top: top()}}></canvas>
  )
}