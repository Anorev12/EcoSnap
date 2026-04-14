import './scanningissues.css';

export default function ScanningIssues() {
  return (
    <div className="support-content">
      <h2>[Troubleshooting] Camera and Detection</h2>
      <p>If the AI is having trouble identifying your item, try these steps:</p>
      <div className="steps-grid">
        <div className="step-item"><strong>1. Lighting:</strong> Ensure the object is well-lit.</div>
        <div className="step-item"><strong>2. Focus:</strong> Hold your phone 6-10 inches away.</div>
        <div className="step-item"><strong>3. Angle:</strong> Show the brand or material symbols clearly.</div>
      </div>
    </div>
  );
}