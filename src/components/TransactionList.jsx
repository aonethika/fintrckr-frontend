import { useState } from "react";

function TransactionList({ transactions, onEdit, onDelete }) {
  const [openId, setOpenId] = useState(null);

  if (!transactions || transactions.length === 0) return <p>No transactions added yet</p>;

  return (
    <div className="transaction-grid">
      {transactions.map((t) => {
        const isOpen = openId === t._id;
        return (
          <div key={t._id} className={`transaction-tile ${isOpen ? "open" : ""}`} onClick={() => setOpenId(isOpen ? null : t._id)}>
            <div className="transaction-compact">
              <span className="transaction-title">{t.title}</span>
              <span className={`transaction-amount ${t.transactionType}`}>₹{t.amount}</span>
            </div>

            {isOpen && (
              <div className="transaction-details" onClick={(e) => e.stopPropagation()}>
                <span>Type: {t.transactionType}</span>
                <span>Category: {t.category}</span>
                {t.image && <img src={t.image} alt="Bill" style={{ maxWidth: "100px", maxHeight: "100px", objectFit: "contain" }} />}
                <span>Date: {new Date(t.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                <div className="transaction-actions">
                  <button onClick={() => onEdit(t)}>Edit</button>
                  <button onClick={() => onDelete(t._id)}>Delete</button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default TransactionList;
