/**
 * Ring Size Guide Modal
 *
 * Displays ring sizing chart and measurement instructions.
 */

// Ring Size Guide Modal

interface RingSizeGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RingSizeGuide({ isOpen, onClose }: RingSizeGuideProps) {
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Ring Size Guide</h2>
          <button className="close-button" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="modal-body">
          <section className="guide-section">
            <h3>How to Measure Your Ring Size</h3>

            <div className="method">
              <h4>Method 1: Existing Ring</h4>
              <ol>
                <li>Place a ring that fits well on a ruler</li>
                <li>Measure the inside diameter in millimeters</li>
                <li>Compare to the size chart below</li>
              </ol>
            </div>

            <div className="method">
              <h4>Method 2: String Method</h4>
              <ol>
                <li>Wrap a string or strip of paper around your finger</li>
                <li>Mark where it overlaps</li>
                <li>Measure the length in millimeters</li>
                <li>Divide by 3.14 to get the diameter</li>
              </ol>
            </div>

            <div className="tip">
              <strong>💡 Tip:</strong> Measure your finger at the end of the day
              when it&apos;s warmest. Fingers can shrink or expand depending on
              temperature and time of day.
            </div>
          </section>

          <section className="size-chart">
            <h3>US Ring Size Chart</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>US Size</th>
                    <th>Diameter (mm)</th>
                    <th>Circumference (mm)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>3</td>
                    <td>14.1</td>
                    <td>44.2</td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>14.9</td>
                    <td>46.8</td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td>15.7</td>
                    <td>49.3</td>
                  </tr>
                  <tr>
                    <td>6</td>
                    <td>16.5</td>
                    <td>51.9</td>
                  </tr>
                  <tr>
                    <td>7</td>
                    <td>17.3</td>
                    <td>54.4</td>
                  </tr>
                  <tr>
                    <td>8</td>
                    <td>18.2</td>
                    <td>57.0</td>
                  </tr>
                  <tr>
                    <td>9</td>
                    <td>19.0</td>
                    <td>59.5</td>
                  </tr>
                  <tr>
                    <td>10</td>
                    <td>19.8</td>
                    <td>62.1</td>
                  </tr>
                  <tr>
                    <td>11</td>
                    <td>20.6</td>
                    <td>64.6</td>
                  </tr>
                  <tr>
                    <td>12</td>
                    <td>21.4</td>
                    <td>67.2</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="close-footer-button">
            Got It
          </button>
        </div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          overflow-y: auto;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-header h2 {
          font-size: 24px;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 24px;
          color: #6b7280;
          cursor: pointer;
          padding: 4px 8px;
          line-height: 1;
          transition: color 0.2s;
        }

        .close-button:hover {
          color: #111827;
        }

        .modal-body {
          padding: 24px;
        }

        .guide-section h3 {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 16px;
        }

        .method {
          margin-bottom: 20px;
        }

        .method h4 {
          font-size: 16px;
          font-weight: 600;
          color: #374151;
          margin: 0 0 8px;
        }

        .method ol {
          margin: 0;
          padding-left: 20px;
          color: #6b7280;
          font-size: 14px;
          line-height: 1.6;
        }

        .method li {
          margin-bottom: 4px;
        }

        .tip {
          padding: 12px 16px;
          background: #fff9e6;
          border: 1px solid #f59e0b;
          border-radius: 8px;
          font-size: 14px;
          color: #92400e;
          margin-top: 16px;
          line-height: 1.5;
        }

        .tip strong {
          font-weight: 600;
        }

        .size-chart {
          margin-top: 32px;
        }

        .size-chart h3 {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 16px;
        }

        .table-container {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        thead {
          background: #f9fafb;
        }

        th {
          padding: 12px;
          text-align: left;
          font-weight: 600;
          color: #374151;
          border-bottom: 2px solid #e5e7eb;
        }

        td {
          padding: 12px;
          color: #6b7280;
          border-bottom: 1px solid #f3f4f6;
        }

        tbody tr:hover {
          background: #fafafa;
        }

        .modal-footer {
          padding: 16px 24px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: flex-end;
        }

        .close-footer-button {
          padding: 10px 24px;
          background: #d4af37;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .close-footer-button:hover {
          background: #c29d2f;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .modal-overlay {
            padding: 0;
            align-items: flex-start;
          }

          .modal-content {
            max-height: 100vh;
            border-radius: 0;
          }

          .modal-header h2 {
            font-size: 20px;
          }

          .modal-body {
            padding: 20px;
          }

          table {
            font-size: 13px;
          }

          th,
          td {
            padding: 10px 8px;
          }
        }
      `}</style>
    </div>
  );
}
