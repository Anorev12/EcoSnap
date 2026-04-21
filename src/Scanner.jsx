import { Link } from "react-router-dom";
import { useRef, useState, useCallback } from "react";
import "./scanner.css";

export default function Scanner() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null); // ✅ store captured photo

  const videoCallbackRef = useCallback((node) => {
    if (node && streamRef.current) {
      node.srcObject = streamRef.current;
      videoRef.current = node;
    }
  }, []);

  const handleOpenCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });
      streamRef.current = stream;
      setCapturedImage(null); // clear previous photo
      setCameraOpen(true);
    } catch (error) {
      console.error("Camera error:", error.name, error.message);
      alert(`Camera error: ${error.name} - ${error.message}`);
    }
  };

  const handleCloseCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraOpen(false);
  };

  const handleCapturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;

    // Draw video frame onto a canvas
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    // Convert to image URL
    const imageDataUrl = canvas.toDataURL("image/png");
    setCapturedImage(imageDataUrl);

    // Stop camera after capture
    handleCloseCamera();
  };

  const handleRetake = () => {
    setCapturedImage(null);
    handleOpenCamera();
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
      {!cameraOpen && !capturedImage &&(
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
      )}
        {/* Live Camera */}
        {cameraOpen && (
          <div className="camera-container">
            <video
              ref={videoCallbackRef}
              autoPlay
              playsInline
              className="camera-video"
            />
            <button 
              className="scanner-btn btn-capture"
              onClick={handleCapturePhoto}
            >
              📸 Capture Photo
            </button>
            <button 
              className="scanner-btn btn-close"
              onClick={handleCloseCamera}
            >
              Close Camera
            </button>
          </div>
        )}

        {/* Captured Photo Preview */}
        {capturedImage && !cameraOpen && (
          <div className="camera-container">
            <img src={capturedImage} alt="Captured" className="camera-video" />
            <button 
              className="scanner-btn btn-camera"
              onClick={handleRetake}
            >
              🔄 Retake
            </button>
            <button
              className="scanner-btn btn-choose"
              onClick={() => console.log("Submit photo:", capturedImage)}
            >
              ✅ Use This Photo
            </button>
          </div>
        )}

        {/* Default Upload UI */}
        {!cameraOpen && !capturedImage && (
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