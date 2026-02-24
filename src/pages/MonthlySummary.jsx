import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMonthlySummary } from "../redux/slices/monthlySummarySlice";
import {
  getAllPersonalTransactions,
  setMonthlyBudgetAPI
} from "../api/api";
import {
  setTransactions,
  setLoading,
  setError
} from "../redux/slices/transactionSlice";
import CategoryPieChart from "../components/CategoryPieChart";
import "../styles/monthlySummary.css";

function MonthlySummary() {
  const dispatch = useDispatch();

  const {
    monthlyBudget,
    totalExpense,
    remainingBudget,
    status,
    warnings,
    categoryAnalysis
  } = useSelector((state) => state.monthlySummary);

  const { transactions } = useSelector((state) => state.transaction);

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  const [editingBudget, setEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState("");

  async function fetchTransactions() {
    dispatch(setLoading());
    try {
      const result = await getAllPersonalTransactions();
      dispatch(setTransactions(result.transactions || []));
    } catch {
      dispatch(setError("Failed to fetch transactions"));
    }
  }

  useEffect(() => {
    fetchTransactions();
    dispatch(fetchMonthlySummary(selectedMonth));
  }, [dispatch, selectedMonth]);

  const expenses = useMemo(() => {
    return transactions
      .filter((t) => {
        const month = new Date(t.date).toISOString().slice(0, 7);
        return month === selectedMonth && t.transactionType === "expense";
      })
      .map((t) => ({
        _id: t._id,
        name: t.title,
        amount: t.amount,
        date: t.date,
        category: t.category
      }));
  }, [transactions, selectedMonth]);

  const handleBudgetSubmit = async (e) => {
    e.preventDefault();
    if (!budgetInput) return;

    await setMonthlyBudgetAPI({
      monthlyBudget: Number(budgetInput),
      month: selectedMonth
    });

    setEditingBudget(false);
    setBudgetInput("");
    dispatch(fetchMonthlySummary(selectedMonth));
  };

  const getMonthName = (monthValue) => {
    const date = new Date(monthValue + "-01");
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  };

  return (
    <div className="monthly-summary-page">
      <h1>{getMonthName(selectedMonth)} Summary</h1>

      <input
        type="month"
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
      />

      {status === "loading" && <p>Loading...</p>}

      {editingBudget && (
        <div className="budget-overlay show">
          <div className="budget-card">
            <h3>Edit Budget</h3>
            <input
              type="number"
              value={budgetInput || ""}
              onChange={(e) => setBudgetInput(e.target.value)}
            />
            <div className="budget-card-actions">
              <button className="save-btn" onClick={handleBudgetSubmit}>Save</button>
              <button className="cancel-btn" onClick={() => setEditingBudget(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="summary-grid">
        <div className="left-panel">
          <div className="budget-info-left">
            <div className="budget-item">
              <span>Budget</span>
              <strong>₹{monthlyBudget || 0}</strong>
              <button
                className="edit-budget-btn"
                onClick={() => {
                  setBudgetInput(monthlyBudget || 0);
                  setEditingBudget(true);
                }}
              >
                Edit
              </button>
            </div>
            <div className="budget-item">
              <span>Total Spent</span>
              <strong>₹{totalExpense || 0}</strong>
            </div>
            <div className="budget-item">
              <span>Remaining</span>
              <strong>₹{remainingBudget || 0}</strong>
            </div>
          </div>

          <div className="expense-panel">
            <h3>Expenses</h3>
            <ul className="expense-list">
              {expenses.length === 0 ? (
                <p>No expenses this month</p>
              ) : (
                expenses.map((exp) => (
                  <li key={exp._id}>
                    <span>{exp.name}</span>
                    <span>₹{exp.amount}</span>
                    <span>{new Date(exp.date).toLocaleDateString()}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        <div className="right-panel">
          <div className="summary-card">
            <h3>Category Wise Analysis</h3>
            <CategoryPieChart
              expenses={expenses.filter((exp) => exp.category !== "Group Split")}
            />

             
              {Object.entries(categoryAnalysis || {})
  .filter(([category]) => category !== "Group Split")
  .map(([category, data]) => (
    <div key={category} style={{ marginBottom: "10px", marginTop: "20px" }}>
      <strong>{category}:</strong> Spent: ₹{data.spent} | Budget: {data.budget !== null ? `₹${data.budget}` : "Not set"}
    </div>
))}
            

            <div className="warnings">
              {warnings
                .filter((w) => !w.toLowerCase().includes("group split"))
                .map((w, i) => (
                  <p key={i}>{w}</p>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MonthlySummary;