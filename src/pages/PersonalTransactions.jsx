import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setTransactions,
  setLoading,
  setError,
  addTransaction,
  updateTransaction,
  deleteTransaction
} from "../redux/slices/transactionSlice";
import {
  getAllPersonalTransactions,
  createPersonalTransaction,
  updateTransaction as updateTransactionAPI,
  deleteTransaction as deleteTransactionAPI
} from "../api/api";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import { fetchMonthlySummary } from "../redux/slices/monthlySummarySlice";
import '../styles/PersonalTransactions.css'

function PersonalTransactions() {
  const dispatch = useDispatch();

  const { transactions, loading, error } = useSelector(state => state.transaction);
  const { categoryBudgets, categories: userCategories } = useSelector(state => state.monthlySummary);


  const defaultCategories = ["Food", "Transport", "Entertainment", "Other"];

   const [editingTransaction, setEditingTransaction] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  const categories = useMemo(() => {
  const monthBudgets = categoryBudgets?.[selectedMonth] || {};

  const combined = [
    ...defaultCategories,
    ...Object.keys(monthBudgets),
    ...(userCategories || [])
  ];

  return [...new Set(combined)];
}, [categoryBudgets, userCategories, selectedMonth]);
  console.log("categories",categories);
  
 

  useEffect(() => {
    fetchTransactions();
    dispatch(fetchMonthlySummary(selectedMonth));
  }, [selectedMonth, dispatch]);

  async function fetchTransactions() {
    dispatch(setLoading());
    try {
      const result = await getAllPersonalTransactions();
      dispatch(setTransactions(result.transactions || []));
    } catch {
      dispatch(setError("Failed to fetch transactions"));
    }
  }
async function handleSubmit(formData) {
  dispatch(setLoading());
  try {
    if (editingTransaction) {
      const result = await updateTransactionAPI(editingTransaction._id, formData);
      dispatch(updateTransaction(result.transaction));
      setEditingTransaction(null);
    } else {
      const result = await createPersonalTransaction(formData);
      dispatch(addTransaction(result.transaction));
    }

   
    dispatch(fetchMonthlySummary(selectedMonth));

  } catch {
    dispatch(setError("Failed to save transaction"));
  }
}
 async function handleDelete(id) {
  dispatch(setLoading());
  try {
    await deleteTransactionAPI(id);
    dispatch(deleteTransaction(id));

    dispatch(fetchMonthlySummary(selectedMonth));

  } catch {
    dispatch(setError("Failed to delete transaction"));
  }
}

  function handleEdit(transaction) {
    setEditingTransaction(transaction);
  }

  return (
    <div className="personal-transactions">
      

      <TransactionForm
        categories={categories}
        onSubmit={handleSubmit}
        initialData={editingTransaction}
        isEditing={!!editingTransaction}
      />

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <TransactionList
        transactions={transactions}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default PersonalTransactions;