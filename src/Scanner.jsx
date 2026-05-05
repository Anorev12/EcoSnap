import { Link } from "react-router-dom";
import { useRef, useState, useCallback } from "react";
import "./scanner.css";

const CATEGORY_CONFIG = {
  Recyclable: {
    emoji: "♻️",
    color: "#22c55e",
    bg: "#dcfce7",
    border: "#86efac",
    tip: "Place in the blue/yellow recycling bin.",
  },
  Biodegradable: {
    emoji: "🌿",
    color: "#84cc16",
    bg: "#f7fee7",
    border: "#bef264",
    tip: "Place in the green compost bin or compost at home.",
  },
  "Residual / Non-Recyclable": {
    emoji: "🗑️",
    color: "#f97316",
    bg: "#fff7ed",
    border: "#fdba74",
    tip: "Place in the general waste / black bin.",
  },
  Hazardous: {
    emoji: "⚠️",
    color: "#ef4444",
    bg: "#fef2f2",
    border: "#fca5a5",
    tip: "Bring to a designated hazardous waste facility.",
  },
  "E-Waste": {
    emoji: "🔋",
    color: "#8b5cf6",
    bg: "#f5f3ff",
    border: "#c4b5fd",
    tip: "Drop off at an electronics recycling center.",
  },
  Unknown: {
    emoji: "❓",
    color: "#6b7280",
    bg: "#f9fafb",
    border: "#d1d5db",
    tip: "Could not determine category. Try a clearer photo.",
  },
};

async function classifyImage(base64Image, userId) {
  const response = await fetch("http://localhost:8080/api/scanner/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      image: base64Image,
      userId: userId ?? null,
    }),
  });
  if (!response.ok) throw new Error("Analysis failed. Please try again.");
  return response.json();
}

function ResultCard({ result, image, onRescan }) {
  const cfg = CATEGORY_CONFIG[result.category] ?? CATEGORY_CONFIG["Unknown"];

  return (
    <div className="result-wrapper">
      <div className="result-image-thumb">
        <img src={image} alt="Scanned item" />
      </div>

      <div className="result-card" style={{ borderColor: cfg.border, background: cfg.bg }}>
        <div className="result-category-badge" style={{ background: cfg.color }}>
          <span className="result-emoji">{cfg.emoji}</span>
          <span>{result.category}</span>
        </div>
        <div className="result-item-name">{result.item}</div>
        <div className="result-confidence" style={{ color: cfg.color }}>
          {result.confidence} Confidence
        </div>
        <p className="result-reason">{result.reason}</p>
        <div className="result-tip" style={{ borderLeft: `3px solid ${cfg.color}` }}>
          <span className="result-tip-label">How to dispose:</span>
          <span>{result.disposal || cfg.tip}</span>
        </div>
      </div>

      <div className="result-actions">
        <button className="scanner-btn btn-camera" onClick={onRescan}>
          🔄 Scan Another
        </button>
      </div>
    </div>
  );
}

// ✅ notify added to props
export default function Scanner({ user, notify }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const videoCallbackRef = useCallback((node) => {
    if (node && streamRef.current) {
      node.srcObject = streamRef.current;
      videoRef.current = node;
    }
  }, []);

  const handleOpenCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
      setCapturedImage(null);
      setResult(null);
      setError(null);
      setCameraOpen(true);
    } catch (err) {
      // ✅ notify on camera permission denied
      notify?.error("Camera access denied. Please allow camera permissions.", {
        title: "Camera Error",
      });
    }
  };

  const handleCloseCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraOpen(false);
  };

  const handleCapturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    const imageDataUrl = canvas.toDataURL("image/png");
    setCapturedImage(imageDataUrl);
    handleCloseCamera();
    // ✅ notify photo captured
    notify?.info("Photo captured! Click Analyze to identify the item.", {
      title: "Photo Ready",
    });
  };

  const handleChooseImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        setCapturedImage(ev.target.result);
        setResult(null);
        setError(null);
        // ✅ notify image loaded
        notify?.info("Image loaded! Click Analyze to identify the item.", {
          title: "Image Ready",
        });
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const handleAnalyze = async () => {
    if (!capturedImage) return;
    setAnalyzing(true);
    setError(null);
    try {
      const base64 = capturedImage.split(",")[1];
      const classification = await classifyImage(base64, user?.id);
      setResult(classification);
      // ✅ notify based on category
      const isHazardous =
        classification.category === "Hazardous" ||
        classification.category === "E-Waste";
      if (isHazardous) {
        notify?.warning(
          `${classification.item} requires special disposal. Check the instructions below.`,
          { title: `${classification.category} Detected` }
        );
      } else {
        notify?.success(
          `${classification.item} identified as ${classification.category}!`,
          { title: "Scan Complete ✅" }
        );
      }
    } catch (err) {
      const msg = err.message || "Could not analyze the image. Please try again.";
      setError(msg);
      // ✅ notify on analysis failure
      notify?.error(msg, { title: "Analysis Failed" });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleRescan = () => {
    setCapturedImage(null);
    setResult(null);
    setError(null);
  };

  const showDefault = !cameraOpen && !capturedImage && !result;

  return (
    <div className="scanner-page">
      <div className="scanner-card">

        {showDefault && (
          <Link to="/dashboard" className="scanner-back-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        )}

        {cameraOpen && (
          <div className="camera-container">
            <video ref={videoCallbackRef} autoPlay playsInline className="camera-video" />
            <button className="scanner-btn btn-capture" onClick={handleCapturePhoto}>
              📸 Capture Photo
            </button>
            <button className="scanner-btn btn-close" onClick={handleCloseCamera}>
              Close Camera
            </button>
          </div>
        )}

        {capturedImage && !cameraOpen && !result && (
          <div className="camera-container">
            <img src={capturedImage} alt="Captured" className="camera-video" />
            {analyzing ? (
              <div className="analyzing-state">
                <div className="analyzing-spinner" />
                <p className="analyzing-text">Analyzing item with AI…</p>
              </div>
            ) : (
              <>
                {error && <p className="scan-error">{error}</p>}
                <button className="scanner-btn btn-analyze" onClick={handleAnalyze}>
                  🔍 Analyze Item
                </button>
                <button className="scanner-btn btn-camera" onClick={handleOpenCamera}>
                  🔄 Retake
                </button>
                <button className="scanner-btn btn-choose" onClick={handleChooseImage}>
                  📁 Choose Different
                </button>
              </>
            )}
          </div>
        )}

        {result && capturedImage && (
          <ResultCard result={result} image={capturedImage} onRescan={handleRescan} />
        )}

        {showDefault && (
          <>
            <div className="scanner-upload-area">
              <svg className="upload-icon" width="56" height="56" viewBox="0 0 24 24" fill="none">
                <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke="#888"
                  strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points="16 8 12 4 8 8" stroke="#888" strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round" />
                <line x1="12" y1="4" x2="12" y2="16" stroke="#888"
                  strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="upload-label">Scan an item to classify it</p>
              <p className="upload-sub">
                Take a photo or upload an image — AI will identify the trash category
              </p>
            </div>
            <button className="scanner-btn btn-camera" onClick={handleOpenCamera}>
              📷 Open Camera
            </button>
            <span className="scanner-or">or</span>
            <button className="scanner-btn btn-choose" onClick={handleChooseImage}>
              📁 Upload Image
            </button>
          </>
        )}

      </div>
    </div>
  );
}