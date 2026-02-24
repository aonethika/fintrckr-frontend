import React, { useEffect, useState } from "react";

const today = new Date().toISOString().slice(0, 10);

function TransactionForm({ categories = [], onSubmit, initialData, isEditing }) {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Other",
    date: today,
    transactionType: "expense"
  });

  useEffect(() => {
    if (isEditing && initialData) {
      setForm({
        title: initialData.title,
        amount: initialData.amount,
        category: initialData.category,
        date: initialData.date.slice(0, 10),
        transactionType: initialData.transactionType
      });
    }
  }, [isEditing, initialData]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      title: form.title,
      amount: Number(form.amount),
      category: form.category,
      date: form.date,
      transactionType: form.transactionType
    });
    setForm({ title: "", amount: "", category: "Other", date: today, transactionType: "expense" });
  }

  return (
    <form onSubmit={handleSubmit} className="transaction-form">
      <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required />
      <input name="amount" type="number" value={form.amount} onChange={handleChange} placeholder="Amount" required />
      <select name="category" value={form.category} onChange={handleChange}>
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      <select name="transactionType" value={form.transactionType} onChange={handleChange}>
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>
      <input name="date" type="date" value={form.date} onChange={handleChange} />
      <button type="submit">{isEditing ? "Update Transaction" : "Add Transaction"}</button>
    </form>
  );
}

export default TransactionForm;