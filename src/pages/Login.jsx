import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { loginAPI } from "../api/api";
import { loginSuccess } from "../redux/slices/authSlice";
// import "../style/auth.css";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!form.email || !form.password) {
      alert("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const result = await loginAPI(form);
      if (result?.token) {
         localStorage.setItem("token", result.token);
        localStorage.setItem("justLoggedIn", "true");
        dispatch(loginSuccess(result));
        navigate("/dashboard", { replace: true });
      } else {
        alert(result?.message || "Login Failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main">
      <form className="signup-form" onSubmit={handleSubmit}>
         <div className="input-wrap">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          autoComplete="current-password"
        />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Signup</Link>
      </p>
    </div>
  );
}

export default Login;
