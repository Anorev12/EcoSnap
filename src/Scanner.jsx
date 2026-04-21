import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import "./scanner.css";

export default function Scanner() {
  const videoRef = useRef(null);
  const [cameraOpen, setCameraOpen] = useState(false);

  const handleOpenCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });

      videoRef.current.srcObject = stream;
      setCameraOpen(true);

    } catch (error) {
      console.error("Camera error:", error);
      alert("Camera access denied or not available");
    }
  };

  const handleCloseCamera = () => {
    const stream = videoRef.current.srcObject;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setCameraOpen(false);
  };

  const handleChooseImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => console.log("Chosen file:", e.target.files[0]);
    input.click();
  };

  return (
    <div className="scanner-page">
      <div className="scanner-card">

        <Link to="/dashboard" className="scanner-back-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path 
              d="M15 18l-6-6 6-6" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </Link>

        {/* Camera Preview */}
        {cameraOpen && (
          <div className="camera-container">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="camera-video"
            />

            <button 
              className="scanner-btn btn-close"
              onClick={handleCloseCamera}
            >
              Close Camera
            </button>
          </div>
        )}

        {!cameraOpen && (
          <>
            <div className="scanner-upload-area">
              <svg className="upload-icon" width="56" height="56" viewBox="0 0 24 24" fill="none">
                <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke="#888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="16 8 12 4 8 8" stroke="#888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="12" y1="4" x2="12" y2="16" stroke="#888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="upload-label">Image upload</p>
            </div>

            <button 
              className="scanner-btn btn-camera" 
              onClick={handleOpenCamera}
            >
              Open Camera
            </button>

            <span className="scanner-or">or</span>

            <button 
              className="scanner-btn btn-choose" 
              onClick={handleChooseImage}
            >
              Upload Image
            </button>
          </>
        )}

      </div>
    </div>
  );
}