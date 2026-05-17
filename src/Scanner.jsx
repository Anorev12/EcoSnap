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

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

// Request cache to avoid duplicate API calls
const requestCache = new Map();

/**
 * Compresses image to reduce API load while maintaining quality
 */
function compressImage(base64Image, quality = 0.7, maxWidth = 800) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      // Scale down if too large
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(base64Image); // Return original if compression fails
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      const compressed = canvas.toDataURL("image/jpeg", quality);
      
      console.log(`Image compressed: ${Math.round(base64Image.length / 1024)}KB -> ${Math.round(compressed.length / 1024)}KB`);
      resolve(compressed.split(",")[1]); // Return base64 only
    };
    img.onerror = () => {
      resolve(base64Image); // Return original on error
    };
    img.src = `data:image/jpeg;base64,${base64Image}`;
  });
}

/**
 * Classifies an image using the backend API with intelligent retry logic
 */
async function classifyImage(base64Image, userId) {
  // Check cache first
  const cacheKey = base64Image.substring(0, 50); // Use first 50 chars as key
  if (requestCache.has(cacheKey)) {
    console.log("✅ Using cached result");
    return requestCache.get(cacheKey);
  }

  // Compress image to reduce API calls
  const compressedBase64 = await compressImage(base64Image);

  let lastError = null;
  let retryCount = 0;
  const maxRetries = 5;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 API attempt ${attempt}/${maxRetries}`);

      const response = await fetch(`${API_BASE_URL}/api/scanner/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: compressedBase64,
          userId: userId ?? null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // Handle rate limiting (429) with exponential backoff
        if (response.status === 429) {
          retryCount++;
          // Increase wait time: 5s, 10s, 20s, 40s, 80s
          const waitTime = 5000 * Math.pow(2, attempt - 1);
          const waitSeconds = waitTime / 1000;

          console.log(
            `⏳ Rate limited (429). Waiting ${waitSeconds}s before retry ${attempt}/${maxRetries}...`
          );

          // Show user a more informative message
          lastError = `Rate limited. Waiting ${waitSeconds}s... (Attempt ${attempt}/${maxRetries})`;

          await new Promise((resolve) => setTimeout(resolve, waitTime));
          continue;
        }

        // Handle server errors (5xx) with retries
        if (response.status >= 500) {
          const waitTime = 3000 * Math.pow(1.5, attempt - 1);
          console.log(`⚠️ Server error (${response.status}). Retrying in ${waitTime}ms...`);

          if (attempt < maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, waitTime));
            continue;
          }
        }

        const errorMessage =
          errorData.message || `Analysis failed (HTTP ${response.status})`;
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Validate response
      if (!data || !data.category) {
        throw new Error("Invalid response structure from server");
      }

      // Cache successful result
      requestCache.set(cacheKey, data);

      // Keep cache size manageable (max 50 entries)
      if (requestCache.size > 50) {
        const firstKey = requestCache.keys().next().value;
        requestCache.delete(firstKey);
      }

      console.log("✅ Analysis successful!");
      return data;

    } catch (err) {
      lastError = err.message || "Unknown error";

      if (attempt === maxRetries) {
        throw new Error(
          `Failed after ${maxRetries} attempts: ${lastError}`
        );
      }

      // Wait before next attempt
      const waitMs = 2000 * attempt;
      console.log(`⏱️ Waiting ${waitMs}ms before next attempt...`);
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
  }

  throw new Error(lastError || "Analysis failed");
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

/**
 * Main Scanner Component
 */
export default function Scanner({ user, notify }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [analysisTime, setAnalysisTime] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  const videoCallbackRef = useCallback((node) => {
    if (node && streamRef.current) {
      node.srcObject = streamRef.current;
      videoRef.current = node;
    }
  }, []);

  const handleOpenCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      setCapturedImage(null);
      setResult(null);
      setError(null);
      setStatusMessage(null);
      setCameraOpen(true);
    } catch (err) {
      const errorMsg =
        err.name === "NotAllowedError"
          ? "Camera permission denied. Please allow camera access."
          : err.name === "NotFoundError"
            ? "No camera found on this device."
            : "Failed to access camera.";

      notify?.error?.(errorMsg, { title: "Camera Error" });
      console.error("Camera error:", err);
    }
  };

  const handleCloseCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }
    setCameraOpen(false);
  };

  const handleCapturePhoto = () => {
    const video = videoRef.current;
    if (!video) {
      notify?.error?.("Camera is not ready.", { title: "Camera Error" });
      return;
    }

    try {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      if (canvas.width === 0 || canvas.height === 0) {
        notify?.error?.("Camera stream is not ready. Please wait and try again.", {
          title: "Camera Error",
        });
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        notify?.error?.("Cannot access canvas. Please try again.", {
          title: "Canvas Error",
        });
        return;
      }

      ctx.drawImage(video, 0, 0);
      const imageDataUrl = canvas.toDataURL("image/jpeg", 0.95);
      setCapturedImage(imageDataUrl);
      handleCloseCamera();

      notify?.info?.("📸 Photo captured!", {
        title: "Photo Ready",
      });
    } catch (err) {
      notify?.error?.("Failed to capture photo.", { title: "Capture Error" });
      console.error("Capture error:", err);
    }
  };

  const handleChooseImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size > 4 * 1024 * 1024) {
        notify?.error?.("Image is too large (max 4MB).", { title: "File Too Large" });
        return;
      }

      if (!file.type.startsWith("image/")) {
        notify?.error?.("Please select a valid image file.", { title: "Invalid File" });
        return;
      }

      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result;
        if (typeof result === "string") {
          setCapturedImage(result);
          setResult(null);
          setError(null);
          setStatusMessage(null);
          notify?.info?.("🖼️ Image loaded!", {
            title: "Image Ready",
          });
        }
      };
      reader.onerror = () => {
        notify?.error?.("Failed to read image file.", { title: "Read Error" });
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const handleAnalyze = async () => {
    if (!capturedImage) return;

    setAnalyzing(true);
    setError(null);
    setStatusMessage(null);
    const startTime = Date.now();

    try {
      // Extract base64
      const base64 = capturedImage.includes(",")
        ? capturedImage.split(",")[1]
        : capturedImage;

      if (!base64 || base64.length === 0) {
        throw new Error("Invalid image data.");
      }

      // Show status during analysis
      setStatusMessage("🤖 Analyzing... This may take a moment due to API rate limits.");

      const classification = await classifyImage(base64, user?.id);

      if (!classification || !classification.category) {
        throw new Error("Invalid response from server.");
      }

      setResult(classification);

      const endTime = Date.now();
      setAnalysisTime(endTime - startTime);
      setStatusMessage(null);

      // Show appropriate notification
      const isHazardous =
        classification.category === "Hazardous" ||
        classification.category === "E-Waste";

      if (isHazardous) {
        notify?.warning?.(
          `${classification.item} requires special disposal.`,
          { title: `⚠️ ${classification.category}` }
        );
      } else {
        notify?.success?.(
          `${classification.item} identified as ${classification.category}!`,
          { title: "✅ Scan Complete" }
        );
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not analyze. Please try again.";
      setError(msg);
      setStatusMessage(null);
      notify?.error?.(msg, { title: "Analysis Failed" });
      console.error("Analysis error:", err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleRescan = () => {
    setCapturedImage(null);
    setResult(null);
    setError(null);
    setAnalysisTime(null);
    setStatusMessage(null);
  };

  const showDefault = !cameraOpen && !capturedImage && !result;

  return (
    <div className="scanner-page">
      <div className="scanner-card">
        {showDefault && (
          <Link to="/dashboard" className="scanner-back-btn" title="Back to Dashboard">
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

        {/* Camera View */}
        {cameraOpen && (
          <div className="camera-container">
            <video
              ref={videoCallbackRef}
              autoPlay
              playsInline
              className="camera-video"
            />
            <button className="scanner-btn btn-capture" onClick={handleCapturePhoto}>
              📸 Capture Photo
            </button>
            <button className="scanner-btn btn-close" onClick={handleCloseCamera}>
              ✕ Close
            </button>
          </div>
        )}

        {/* Image Preview & Analysis */}
        {capturedImage && !cameraOpen && !result && (
          <div className="camera-container">
            <img src={capturedImage} alt="Captured" className="camera-video" />
            {analyzing ? (
              <div className="analyzing-state">
                <div className="analyzing-spinner" />
                <p className="analyzing-text">{statusMessage || "🤖 Analyzing..."}</p>
              </div>
            ) : (
              <>
                {error && <p className="scan-error">❌ {error}</p>}
                <button
                  className="scanner-btn btn-analyze"
                  onClick={handleAnalyze}
                  disabled={analyzing}
                >
                  🔍 Analyze Item
                </button>
                <button
                  className="scanner-btn btn-camera"
                  onClick={handleOpenCamera}
                  disabled={analyzing}
                >
                  🔄 Retake
                </button>
                <button
                  className="scanner-btn btn-choose"
                  onClick={handleChooseImage}
                  disabled={analyzing}
                >
                  📁 Choose Different
                </button>
              </>
            )}
          </div>
        )}

        {/* Result Display */}
        {result && capturedImage && (
          <>
            <ResultCard result={result} image={capturedImage} onRescan={handleRescan} />
            {analysisTime && (
              <div className="analysis-time">
                ⏱️ Analysis completed in {analysisTime}ms
              </div>
            )}
          </>
        )}

        {/* Default Landing State */}
        {showDefault && (
          <>
            <div className="scanner-upload-area">
              <svg
                className="upload-icon"
                width="56"
                height="56"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
                  stroke="#888"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points="16 8 12 4 8 8"
                  stroke="#888"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <line
                  x1="12"
                  y1="4"
                  x2="12"
                  y2="16"
                  stroke="#888"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
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