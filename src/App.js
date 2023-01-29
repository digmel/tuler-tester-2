// Import dependencies
import React, { useRef, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import "./App.css";
import { drawRect } from "./utilities";
import { usePlatform } from "./usePlatform";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const { isMobile } = usePlatform();

  // Main function
  const runCoco = async () => {
    const net = await cocossd.load();
    console.log("Handpose model loaded.");
    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 10);
  };

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      const obj = await net.detect(video);

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");
      drawRect(obj, ctx);
    }
  };

  useEffect(() => {
    runCoco();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const videoConstraints = isMobile
    ? {
        facingMode: { exact: "environment" },
      }
    : {
        facingMode: "user",
      };

  const webStyle = {
    position: "absolute",
    marginLeft: "auto",
    marginRight: "auto",
    left: 0,
    right: 0,
    textAlign: "center",
    zindex: 9,
    width: 640,
    height: 480,
  };

  const mobileStyle = {
    position: "absolute",
    marginLeft: 0,
    marginRight: 0,
    left: 0,
    right: 0,
    textAlign: "center",
    zindex: 9,
    width: window.innerWidth,
    height: 480,
  };

  const cameraStyle = isMobile ? mobileStyle : webStyle;

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          muted={true}
          videoConstraints={videoConstraints}
          style={cameraStyle}
        />

        <canvas ref={canvasRef} style={cameraStyle} />
      </header>
    </div>
  );
}

export default App;
