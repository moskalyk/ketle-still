import { useState, useRef, useEffect } from 'react'
import './App.css'

import html2canvas from 'html2canvas'
const wait = (ms: any) => new Promise((res) => setTimeout(res, ms))

const Kettle = (props: any) => {
  const canvasRef: any = useRef(null);
  // const canvasRef: any = useRef(null);
  const [mixing, setMixing] = useState(false);
  const [colors, setColors] = useState([
    { r: 255, g: 165, b: 0 },   // Orange
    { r: 255, g: 255, b: 0 },   // Yellow
    { r: 255, g: 0, b: 0 }      // Red
  ]);

  const captureImage = () => {
    const element: any = canvasRef.current;

    html2canvas(element).then((canvas: any) => {
      // Convert the canvas to a data URL (base64 encoded image)
      const dataURL = canvas.toDataURL("image/png");

      downloadImage(dataURL, "captured-image.png");
      // Set the src of the img element to display the image
      // if (resultImageRef.current) {
      //   resultImageRef.current.src = dataURL;
      // }
    });
  };

  const downloadImage = (dataURL: any, filename: any) => {
    const link = document.createElement("a"); // Create an <a> element
    link.href = dataURL; // Set the href to the base64 image URL
    link.download = filename; // Set the download attribute with a filename
    document.body.appendChild(link); // Append the link to the body (required for Firefox)
    link.click(); // Trigger the download by programmatically clicking the link
    document.body.removeChild(link); // Remove the link after the download
  };

  useEffect(() => {
    const canvas: any = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId: any;

    const morphColors = (currentColors: any) => {
      return currentColors.map((color: any) => ({
        r: (color.r + Math.floor(Math.random() * 5) - 2 + 255) % 255,
        g: (color.g + Math.floor(Math.random() * 5) - 2 + 255) % 255,
        b: (color.b + Math.floor(Math.random() * 5) - 2 + 255) % 255,
      }));
    };

    const rgbToString = (color: any) => `rgb(${color.r}, ${color.g}, ${color.b})`;

    const drawCauldron = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Cauldron Shape
      // ctx.fillStyle = '#333';
      // ctx.beginPath();
      // ctx.arc(canvas.width / 2, canvas.height / 2 + 50, 100, Math.PI, 0, false); // Cauldron bottom
      // ctx.fill();
      // ctx.fillRect(canvas.width / 2 - 100, canvas.height / 2 + 50, 200, 50); // Cauldron sides

      // Soup Morphing Gradient
      
      //∅︎, ⊚︎, ⎋︎
      if(props.value == '∅︎'){
        const gradient = ctx.createLinearGradient(100, 100, 200, 200);
        gradient.addColorStop(0, rgbToString(colors[0]));
        gradient.addColorStop(0.5, rgbToString(colors[1]));
        gradient.addColorStop(1, rgbToString(colors[2]));
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, 80, 0, 2 * Math.PI); // Soup
        ctx.fill();
  
      } else if (props.value == '⊚︎'){
        const gradient = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, 10,  // Inner circle (centerX, centerY, innerRadius)
          canvas.width / 2, canvas.height / 2, 80   // Outer circle (centerX, centerY, outerRadius)
        );
        
        // Define color stops for the radial gradient
        gradient.addColorStop(0, rgbToString(colors[0]));   // Innermost color
        gradient.addColorStop(0.25, rgbToString(colors[1])); // Mid color
        gradient.addColorStop(1, rgbToString(colors[2]));   // Outermost color
        
        // Set the fill style to the radial gradient
        ctx.fillStyle = gradient;
        
        // Draw the soup as a circle filled with the radial gradient
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, 80, 0, 2 * Math.PI);  // Soup
        ctx.fill();
        
      } else {
        const gradient = ctx.createLinearGradient(100, 100, 100, 200);
        gradient.addColorStop(0, rgbToString(colors[0]));
        gradient.addColorStop(0.25, rgbToString(colors[1]));
        gradient.addColorStop(0.25, rgbToString(colors[1]));
        gradient.addColorStop(1, rgbToString(colors[2]));
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, 80, 0, 2 * Math.PI); // Soup
        ctx.fill();
      }
    };

    const mixSoup = async () => {
      await wait(1000)

      drawCauldron();
      setColors((prevColors) => morphColors(prevColors)); // Update colors for morphing effect
      animationFrameId = requestAnimationFrame(mixSoup);
    };

    if (mixing) {
      animationFrameId = requestAnimationFrame(mixSoup);
    } else {
      drawCauldron();
      cancelAnimationFrame(animationFrameId);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [mixing, colors, props.value]);

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      {/* <canvas
      ref={canvasOrbRef} width={300} height={300}
      ></canvas> */}
      <canvas 

      className={mixing ? 'rotate' : ''}
      ref={canvasRef} width={300} height={300} />
      <div>
        <button onClick={() => {if(mixing){
            captureImage()
            alert('test')
          }
          setMixing(!mixing)}} style={{ marginTop: '10px' }}>
          {mixing ? 'Stop Mixing' : 'Start Mixing'}
        </button>
      </div>
    </div>
  );
};

function App() {
  const [selectedChar, setSelectedChar] = useState('');

  return (
    <>
      <Kettle value={selectedChar} />
      <br/>
      <div>
        <button onClick={() => setSelectedChar('∅︎')}>∅︎</button>
        <button onClick={() => setSelectedChar('⊚︎')}>⊚︎</button>
        <button onClick={() => setSelectedChar('⎋︎')}>⎋︎</button>
      </div>
    </>
  );
}

export default App
