import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, updateUpi } from "../redux/slices/authSlice";
import '../styles/profile.css'

function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [editingUpi, setEditingUpi] = useState(false);
  const [upiInput, setUpiInput] = useState(user?.upiId || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!upiInput) return;

    dispatch(updateUpi(upiInput));
    setEditingUpi(false);
  };

  return (
    <div className="profile-page">
      <h2 className="profile-title">Profile</h2>

      <div className="profile-section">
        <h3 className="section-title">Personal details</h3>
        <p>{user?.name}</p>
        <p>{user?.email}</p>
        <p>{user?.phone_number}</p>
      </div>

      <div className="profile-section">
        <h3 className="section-title">Payment</h3>

        {!editingUpi ? (
          <>
            <p>UPI: {user?.upiId ? user.upiId : "Not Added"}</p>
            <button
              className="btn edit-btn"
              onClick={() => setEditingUpi(true)}
            >
              {user?.upiId ? "Edit UPI" : "Set UPI"}
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="upi-form">
            <input
              type="text"
              value={upiInput}
              onChange={(e) => setUpiInput(e.target.value)}
              placeholder="Enter UPI ID"
              className="modal-input"
            />
            <div className="form-actions">
              <button className="btn confirm-btn" type="submit">Save</button>
              <button
                className="btn cancel-btn"
                type="button"
                onClick={() => setEditingUpi(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <button className="btn delete-btn logout-btn" onClick={() => dispatch(logout())}>
        Logout
      </button>
    </div>
  );
}

export default Profile;