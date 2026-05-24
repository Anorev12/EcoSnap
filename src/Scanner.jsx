import { Link } from "react-router-dom";
import { useRef, useState, useCallback } from "react";
import { useTranslation } from "./hooks/useTranslation";
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
const requestCache = new Map();

function compressImage(base64Image, quality = 0.7, maxWidth = 800) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(base64Image);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      const compressed = canvas.toDataURL("image/jpeg", quality);
      
      console.log(`Image compressed: ${Math.round(base64Image.length / 1024)}KB -> ${Math.round(compressed.length / 1024)}KB`);
      resolve(compressed.split(",")[1]);
    };
    img.onerror = () => {
      resolve(base64Image);
    };
    img.src = `data:image/jpeg;base64,${base64Image}`;
  });
}

async function classifyImage(base64Image, userId) {
  const cacheKey = base64Image.substring(0, 50);
  if (requestCache.has(cacheKey)) {
    console.log("✅ Using cached result");
    return requestCache.get(cacheKey);
  }

  const compressedBase64 = await compressImage(base64Image);

  let lastError = null;
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

        if (response.status === 429) {
          const waitTime = 5000 * Math.pow(2, attempt - 1);
          const waitSeconds = waitTime / 1000;

          console.log(
            `⏳ Rate limited (429). Waiting ${waitSeconds}s before retry ${attempt}/${maxRetries}...`
          );

          lastError = `Rate limited. Waiting ${waitSeconds}s... (Attempt ${attempt}/${maxRetries})`;

          await new Promise((resolve) => setTimeout(resolve, waitTime));
          continue;
        }

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

      if (!data || !data.category) {
        throw new Error("Invalid response structure from server");
      }

      requestCache.set(cacheKey, data);

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

      const waitMs = 2000 * attempt;
      console.log(`⏱️ Waiting ${waitMs}ms before next attempt...`);
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
  }

  throw new Error(lastError || "Analysis failed");
}

function ResultCard({ result, image, onRescan, t }) {
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
          {result.confidence} {t('confidence')}
        </div>
        <p className="result-reason">{result.reason}</p>
        <div className="result-tip" style={{ borderLeft: `3px solid ${cfg.color}` }}>
          <span className="result-tip-label">{t('howToDispose')}:</span>
          <span>{result.disposal || cfg.tip}</span>
        </div>
      </div>

      <div className="result-actions">
        <button className="scanner-btn btn-camera" onClick={onRescan}>
          🔄 {t('scanAnother')}
        </button>
      </div>
    </div>
  );
}

export default function Scanner({ user, notify }) {
  const { t } = useTranslation();
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
          ? t('cameraPermissionDenied')
          : err.name === "NotFoundError"
            ? t('noCameraFound')
            : t('failedAccessCamera');

      notify?.error?.(errorMsg, { title: t('cameraError') });
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
      notify?.error?.(t('cameraNotReady'), { title: t('cameraError') });
      return;
    }

    try {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      if (canvas.width === 0 || canvas.height === 0) {
        notify?.error?.(t('cameraStreamNotReady'), {
          title: t('cameraError'),
        });
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        notify?.error?.(t('cannotAccessCanvas'), {
          title: t('canvasError'),
        });
        return;
      }

      ctx.drawImage(video, 0, 0);
      const imageDataUrl = canvas.toDataURL("image/jpeg", 0.95);
      setCapturedImage(imageDataUrl);
      handleCloseCamera();

      notify?.info?.(`📸 ${t('photoCapture')}!`, {
        title: t('photoReady'),
      });
    } catch (err) {
      notify?.error?.(t('failedCapturePhoto'), { title: t('captureError') });
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
        notify?.error?.(t('imageTooLarge'), { title: t('fileTooLarge') });
        return;
      }

      if (!file.type.startsWith("image/")) {
        notify?.error?.(t('invalidImageFile'), { title: t('invalidFile') });
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
          notify?.info?.(`🖼️ ${t('imageLoaded')}!`, {
            title: t('imageLoadedMsg'),
          });
        }
      };
      reader.onerror = () => {
        notify?.error?.(t('failedReadImage'), { title: t('readError') });
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
      const base64 = capturedImage.includes(",")
        ? capturedImage.split(",")[1]
        : capturedImage;

      if (!base64 || base64.length === 0) {
        throw new Error("Invalid image data.");
      }

      setStatusMessage(t('analyzeThisMayTake'));

      const classification = await classifyImage(base64, user?.id);

      if (!classification || !classification.category) {
        throw new Error("Invalid response from server.");
      }

      setResult(classification);

      const endTime = Date.now();
      setAnalysisTime(endTime - startTime);
      setStatusMessage(null);

      const isHazardous =
        classification.category === "Hazardous" ||
        classification.category === "E-Waste";

      if (isHazardous) {
        notify?.warning?.(
          `${classification.item} ${t('requiresSpecialDisposal')}`,
          { title: `⚠️ ${classification.category}` }
        );
      } else {
        notify?.success?.(
          `${classification.item} ${t('identified')} ${classification.category}!`,
          { title: t('scanComplete') }
        );
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : t('couldNotAnalyze');
      setError(msg);
      setStatusMessage(null);
      notify?.error?.(msg, { title: t('analysisFailedAfter') });
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

        {cameraOpen && (
          <div className="camera-container">
            <video
              ref={videoCallbackRef}
              autoPlay
              playsInline
              className="camera-video"
            />
            <button className="scanner-btn btn-capture" onClick={handleCapturePhoto}>
              📸 {t('capturePhoto')}
            </button>
            <button className="scanner-btn btn-close" onClick={handleCloseCamera}>
              ✕ {t('close')}
            </button>
          </div>
        )}

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
                  🔍 {t('analyzeItem')}
                </button>
                <button
                  className="scanner-btn btn-camera"
                  onClick={handleOpenCamera}
                  disabled={analyzing}
                >
                  🔄 {t('retake')}
                </button>
                <button
                  className="scanner-btn btn-choose"
                  onClick={handleChooseImage}
                  disabled={analyzing}
                >
                  📁 {t('chooseDifferent')}
                </button>
              </>
            )}
          </div>
        )}

        {result && capturedImage && (
          <>
            <ResultCard result={result} image={capturedImage} onRescan={handleRescan} t={t} />
            {analysisTime && (
              <div className="analysis-time">
                ⏱️ {t('analysisComplete')} {analysisTime} {t('ms')}
              </div>
            )}
          </>
        )}

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
              <p className="upload-label">{t('scanAnItem')}</p>
              <p className="upload-sub">
                {t('takePhotoUpload')}
              </p>
            </div>
            <button className="scanner-btn btn-camera" onClick={handleOpenCamera}>
              📷 {t('openCamera')}
            </button>
            <span className="scanner-or">or</span>
            <button className="scanner-btn btn-choose" onClick={handleChooseImage}>
              📁 {t('uploadImage')}
            </button>
          </>
        )}
      </div>
    </div>
  );
}