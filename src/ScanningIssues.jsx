import './scanningissues.css';

export default function ScanningIssues() {
  const steps = [
    {
      icon: '⚡',
      iconClass: 'icon-light',
      badgeClass: 'badge-light',
      label: 'Step 1',
      title: 'Lighting',
      desc: 'Make sure your item is well-lit — natural daylight or a bright indoor lamp works best.',
    },
    {
      icon: '🎯',
      iconClass: 'icon-focus',
      badgeClass: 'badge-focus',
      label: 'Step 2',
      title: 'Focus distance',
      desc: 'Hold your phone 6–10 inches away from the item for a sharp, clear image.',
    },
    {
      icon: '📐',
      iconClass: 'icon-angle',
      badgeClass: 'badge-angle',
      label: 'Step 3',
      title: 'Angle',
      desc: 'Point the camera so that any brand name, logo, or material symbol is clearly visible.',
    },
  ];

  return (
    <div className="support-content">
      <div className="page-header">
        <h2>Camera &amp; detection troubleshooting</h2>
        <p>If the AI is having trouble identifying your item, try these steps:</p>
      </div>

      <div className="steps-grid">
        {steps.map((step) => (
          <div className="step-card" key={step.label}>
            <div className={`step-icon ${step.iconClass}`}>
              <span role="img" aria-hidden="true">{step.icon}</span>
            </div>
            <div className="step-body">
              <span className={`step-badge ${step.badgeClass}`}>{step.label}</span>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="help-note" role="note">
        <i className="ti ti-info-circle" aria-hidden="true" />
        <span>Still having trouble? Try scanning in a different environment or under different lighting conditions.</span>
      </div>
    </div>
  );
}