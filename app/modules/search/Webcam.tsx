// WebcamCapture.tsx
import React, { useRef } from 'react';
import Webcam from 'react-webcam';

interface WebcamCaptureProps {
  onCapture: (imageSrc: string) => void;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onCapture }) => {
  const webcamRef = useRef<Webcam>(null);

  const capture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      onCapture(imageSrc || '');
    }
  };

  return (
    <>
      <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
      <button onClick={capture}>Capture photo</button>
    </>
  );
};

export default WebcamCapture;
