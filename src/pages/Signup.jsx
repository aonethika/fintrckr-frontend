import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { signupAPI } from "../api/api";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/slices/authSlice";
import "../styles/auth.css";

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone_number: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!form.name || !form.email || !form.phone_number || !form.password) {
      alert("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const result = await signupAPI(form);
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
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          autoComplete="name"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
        />
        <input
          type="tel"
          name="phone_number"
          placeholder="Mobile Number"
          value={form.phone_number}
          onChange={handleChange}
          autoComplete="tel"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          autoComplete="new-password"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Signup"}
        </button>
        </div>
        
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Signup;
