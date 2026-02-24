import React from "react";
import "../styles/splitSummary.css";

function SplitSummaryCard({ split, onClose }) {
  if (!split || !split.splits) return null;

  return (
    <div className="split-summary-overlay">
      <div className="split-summary-card">
        <div className="card-header">
          <h3>{split.title}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <p className="total-amount">
          Total: <span>₹{split.amount}</span>
        </p>

        <div className="split-members">
          {split.splits.map((s) => (
            <div key={s.user._id} className="split-member">
              <span className="member-name">{s.user.name}</span>
              <span className={`status ${
                  s.status === "paid"
                    ? "paid"
                    : s.status === "requested"
                    ? "pending"
                    : "unpaid"
                }`}>
                {s.status === "paid"
                  ? "Paid"
                  : s.status === "requested"
                  ? "Pending"
                  : "Unpaid"} ₹{s.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SplitSummaryCard;
