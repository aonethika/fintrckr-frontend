import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";

import { fetchMonthlySummary } from "../redux/slices/monthlySummarySlice";
import { setUpi, resetJustLoggedin } from "../redux/slices/authSlice";
import { getGroupSplitSummaryApi, setMonthlyBudgetAPI } from "../api/api";

import "../styles/dashboard.css";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, justLoggedIn } = useSelector((state) => state.auth);
  const { groups = [] } = useSelector((state) => state.groups);
  const { remainingBudget = 0, status } =
    useSelector((state) => state.monthlySummary);

  /* ---------- Local State ---------- */
  const [loading, setLoading] = useState(true);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [budgetInput, setBudgetInput] = useState("");
  const [upiInput, setUpiInput] = useState("");

  const [owe, setOwe] = useState(0);
  const [get, setGet] = useState(0);

  /* Freeze month so rerenders don't refetch */
  const [currentMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}`;
  });

  const activeGroups = groups.filter((g) => g.status === "active");

  /* ---------- Initial Dashboard Load ---------- */
  useEffect(() => {
    if (!user) return;

    async function loadDashboard() {
      try {
        dispatch(fetchMonthlySummary(currentMonth));

        const data = await getGroupSplitSummaryApi();
        setOwe(Number(data?.owe) || 0);
        setGet(Number(data?.toReceive) || 0);

        if (justLoggedIn) {
          setOnboardingStep(1);
          dispatch(resetJustLoggedin());
        }
        
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [dispatch, currentMonth, user, justLoggedIn]);

  /* ---------- Handlers ---------- */

  const handleBudgetSubmit = async (e) => {
    e.preventDefault();
    if (!budgetInput) return;

    await setMonthlyBudgetAPI({
      monthlyBudget: Number(budgetInput),
      month: currentMonth,
    });

    setBudgetInput("");
    setOnboardingStep(2);
    dispatch(fetchMonthlySummary(currentMonth));
  };

  const handleUpiSubmit = (e) => {
    e.preventDefault();
    if (!upiInput) return;

    dispatch(setUpi(upiInput));
    setUpiInput("");
    setOnboardingStep(0);
  };

  /* ---------- Global Loader ---------- */
  if (loading || status === "loading" || status === "idle") {
    return (
      <div className="dashboard-page-loading">
        <div className="money-rain">
          {Array.from({ length: 28 }).map((_, i) => (
            <span key={i}>💸</span>
          ))}
        </div>
        <p>Hang tight! Your dashboard is loading</p>
      </div>
    );
  }
  console.log("owe:", owe);

  console.log("get", get);
  

  /* ---------- UI ---------- */
  return (
    <div className="dashboard-page">

      {onboardingStep === 1 && (
        <form onSubmit={handleBudgetSubmit}>
          <h3>Set Monthly Budget</h3>
          <p>You can change later</p>
          <input
            type="number"
            value={budgetInput}
            onChange={(e) => setBudgetInput(e.target.value)}
          />
          <div>
            <button type="submit">Submit</button>
            <button type="button" onClick={() => setOnboardingStep(2)}>
              Skip
            </button>
          </div>
        </form>
      )}

      {onboardingStep === 2 && (
        <form onSubmit={handleUpiSubmit}>
          <h3>Add UPI ID</h3>
          <p>You can edit later in Profile page</p>
          <input
            type="text"
            value={upiInput}
            onChange={(e) => setUpiInput(e.target.value)}
          />
          <div>
            <button type="submit">Save</button>
            <button type="button" onClick={() => setOnboardingStep(0)}>
              Skip
            </button>
          </div>
        </form>
      )}

      {onboardingStep === 0 && (
        <>
          <button
            className="set-budget-btn"
            onClick={() => navigate("/set-budget")}
          >
            Set Your Budget
          </button>

          <div className="cards-row">
            <div className="card card-blue">
              <h3>Balance</h3>
              <p>₹ {remainingBudget.toFixed(2)}</p>
            </div>

            <div className="card card-red">
              <h3>You Owe</h3>
              <p>₹ {owe.toFixed(2)}</p>
            </div>

            <div className="card card-green">
              <h3>You Are Owed</h3>
              <p>₹ {get.toFixed(2)}</p>
            </div>
          </div>

          <button
            className="summary-btn"
            onClick={() => navigate("/monthly-summary")}
          >
            Monthly Summary
          </button>

          <div className="active-groups">
            <h3>Active Groups</h3>

            {activeGroups.length ? (
              activeGroups.map((g) => (
                <Link key={g._id} to={`/group/${g._id}`} style={{textDecoration: "none"}}>
                  <div className="group-navigate-btn">{g.name} →</div>
                </Link>
              ))
            ) : (
              <p className="no-groups">No active groups</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;