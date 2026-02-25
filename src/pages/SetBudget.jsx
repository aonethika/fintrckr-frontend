import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMonthlySummary,
  createMonthlyBudget,
  createCategoryBudget,
  removeCategoryBudget,
} from "../redux/slices/monthlySummarySlice";

import "../styles/setBudget.css";

function SetBudget() {
  const dispatch = useDispatch();

  const {
    monthlyBudget,
    categoryBudgets,
    status,
    currentMonth,
    categories: allCategories,
  } = useSelector((state) => state.monthlySummary);

  const { user } = useSelector((state) => state.auth);

  const todayMonth = `${new Date().getFullYear()}-${String(
    new Date().getMonth() + 1
  ).padStart(2, "0")}`;

  const [selectedMonth, setSelectedMonth] = useState(
    currentMonth || todayMonth
  );

  const [editingMonth, setEditingMonth] = useState(false);
  const [monthlyInput, setMonthlyInput] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryAmount, setCategoryAmount] = useState("");

  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const [error, setError] = useState("");

  const categories = useMemo(() => {
    const userCats = user?.categories || [];
    const monthCats = categoryBudgets?.[selectedMonth] || {};
    return [
      ...new Set([
        "Food",
        "Transport",
        "Entertainment",
        "Other",
        ...userCats,
        ...Object.keys(monthCats),
      ]),
    ];
  }, [user, categoryBudgets, selectedMonth]);

  useEffect(() => {
    dispatch(fetchMonthlySummary(selectedMonth));
  }, [dispatch, selectedMonth]);

  useEffect(() => {
    setMonthlyInput(monthlyBudget || "");
  }, [monthlyBudget, selectedMonth]);

  useEffect(() => {
    if (selectedCategory) {
      setCategoryAmount(
  categoryBudgets?.[selectedMonth]?.[selectedCategory] ?? ""
);
    } else {
      setCategoryAmount("");
    }
  }, [selectedCategory, categoryBudgets, selectedMonth]);

  const handleSaveMonth = async () => {
    if (!monthlyInput || Number(monthlyInput) < 0) {
      setError("Enter valid monthly budget");
      return;
    }

    setError("");

    await dispatch(
      createMonthlyBudget({
        monthlyBudget: Number(monthlyInput),
        month: selectedMonth,
      })
    );

    dispatch(fetchMonthlySummary(selectedMonth));
    setEditingMonth(false);
  };

  const handleSaveCategory = async () => {
    const categoryName = isNewCategory
      ? newCategoryName.trim()
      : selectedCategory;

    if (!categoryName || categoryAmount === "") {
      setError("Enter valid category");
      return;
    }

    const amount = Number(categoryAmount);
    if (amount < 0) {
      setError("Invalid amount");
      return;
    }

    await dispatch(
      createCategoryBudget({
        category: categoryName,
        amount,
        month: selectedMonth,
      })
    );

    dispatch(fetchMonthlySummary(selectedMonth));

    setNewCategoryName("");
    setSelectedCategory("");
    setCategoryAmount("");
    setIsNewCategory(false);
    setError("");
  };

  const handleDeleteCategoryBudget = async (cat) => {
    await dispatch(
      removeCategoryBudget({
        category: cat,
        month: selectedMonth,
      })
    );

    dispatch(fetchMonthlySummary(selectedMonth));
  };

 return (
  <div className="set-budget-wrapper">
    <div className="set-budget-container">

      <h2 className="page-title">Monthly Budget</h2>

      <input
        className="month-input"
        type="month"
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
      />

      <div className="total-budget">
        {!editingMonth ? (
          <>
            <p className="budget-display">
              Budget:
              {monthlyBudget ? (
                <span className="budget-value"> ₹{monthlyBudget}</span>
              ) : (
                <span className="budget-empty"> Not set</span>
              )}
            </p>

            <button onClick={() => setEditingMonth(true)}>
              {monthlyBudget ? "Edit" : "Set"}
            </button>
          </>
        ) : (
          <div className="budget-edit">
            <input
              type="number"
              value={monthlyInput}
              onChange={(e) => setMonthlyInput(e.target.value)}
            />
            <button onClick={handleSaveMonth}>
              {status === "loading" ? "Saving..." : "Save"}
            </button>
            <button
              className="secondary-btn"
              onClick={() => setEditingMonth(false)}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <h3 className="section-title">Category Budget</h3>

      <div className="category-selector">
        <select
          value={selectedCategory}
          onChange={(e) => {
            if (e.target.value === "__new__") {
              setIsNewCategory(true);
              setSelectedCategory("");
            } else {
              setIsNewCategory(false);
              setSelectedCategory(e.target.value);
            }
          }}
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
          <option value="__new__">+ Add new category</option>
        </select>

        {(isNewCategory || selectedCategory) && (
          <>
            {isNewCategory && (
              <input
                type="text"
                placeholder="Category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
            )}

            <input
              type="number"
              placeholder="Budget amount"
              value={categoryAmount}
              onChange={(e) => setCategoryAmount(e.target.value)}
            />

            <button onClick={handleSaveCategory}>Save</button>
          </>
        )}
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="saved-category-list">
        {categoryBudgets?.[selectedMonth] &&
        Object.keys(categoryBudgets[selectedMonth]).length > 0 ? (
          Object.entries(categoryBudgets[selectedMonth]).map(
            ([cat, amt]) => {
              const budget = amt ?? null;
              const spent = user?.categorySpent?.[cat] || 0;

              const exceeded =
                budget !== null && budget > 0 && spent > budget;

              return (
                <div
                  key={cat}
                  className={`category-row ${
                    exceeded ? "exceeded" : ""
                  }`}
                >
                  <div className="cat-left">
                    <span className="cat-name">{cat}</span>

                    <span className="spent">
                      Spent ₹{spent}
                    </span>

                    <span className="budget">
                      Budget {budget ? `₹${budget}` : "Not set"}
                    </span>
                  </div>

                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteCategoryBudget(cat)}
                  >
                    Delete
                  </button>
                </div>
              );
            }
          )
        ) : (
          <p className="empty-text">No category budgets</p>
        )}
      </div>

    </div>
  </div>
);
}

export default SetBudget;