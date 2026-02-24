import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import "./navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("touchstart", close);
    document.addEventListener("mousedown", close);
    return () => {
      document.removeEventListener("touchstart", close);
      document.removeEventListener("mousedown", close);
    };
  }, []);

  return (
    <div className="nav">
      <div className="left">
        <h1 onClick={() => navigate("/dashboard")}>fintrackr</h1>
      </div>

      <div className="right">
        <div className="add-expense-dropdown" ref={dropdownRef}>
          <button
            className="add-expense-btn"
            onClick={() => setOpen((v) => !v)}
            type="button"
          >
            Add Expense
          </button>

          {open && (
            <div className="dropdown-menu">
              <button style={{color: "black"}}
                className="dropdown-item"
                type="button"
                onClick={() => {
                  setOpen(false);
                  navigate("/personal-transactoions");
                }}
              >
                Personal
              </button>
              <button
                className="dropdown-item"
                type="button"
                style={{color: "black"}}
                onClick={() => {
                  setOpen(false);
                  navigate("/group");
                }}
              >
                Group
              </button>
            </div>
          )}
        </div>

        <button
          className="profile-btn"
          type="button"
          onClick={() => navigate("/profile")}
        >
          My Profile
        </button>
      </div>
    </div>
  );
}

export default Navbar;
