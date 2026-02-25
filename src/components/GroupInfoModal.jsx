import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addMembersToGroup,
  removeMembersFromGroup,
  deleteGroup
} from '../redux/slices/groupSlice';
import { useNavigate } from 'react-router-dom';
import '../styles/chatArea.css'

function GroupInfoModal({ group, onClose }) {
  const modalRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentUser = useSelector((state) => state.auth.user);
  const isAdmin = group.admin?._id === currentUser?.id;
  console.log("group", group);
  
  console.log("isadmin", isAdmin);
  

  const [member, setMember] = useState('');
  const [showAddMember, setShowAddMember] = useState(false);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleRemoveUser = (id) => {
    dispatch(removeMembersFromGroup({
      groupId: group._id,
      removeMembers: [id]
    }));
  };

  const handleAddMember = () => {
    if (!member.trim()) return;

    dispatch(addMembersToGroup({
      groupId: group._id,
      newMembers: [member.trim()]
    }));

    setMember('');
    setShowAddMember(false);
  };

  const handleDeleteGroup = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this group? This action cannot be undone.'
    );
    if (!confirmDelete) return;

    try {
      await dispatch(deleteGroup(group._id)).unwrap();
      onClose();
      navigate('/group');
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal" ref={modalRef}>
        <h3 className="modal-title">{group.name}</h3>
        <p className="modal-subtitle">
          Admin: {group.admin?.name}
        </p>

        <div className="members-list">
          {group.members?.map((m) => (
            <div key={m._id} className="member-item">
              <span>{m.name}</span>
              {isAdmin && m._id !== currentUser?.id && (
                <button
                  className="member-remove"
                  onClick={() => handleRemoveUser(m._id)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        {isAdmin && (
          <>
            {!showAddMember && (
              <button
                className="btn add-member-btn"
                onClick={() => setShowAddMember(true)}
              >
                + Add Member
              </button>
            )}

            {showAddMember && (
              <div className="add-member-form">
                <input
                  type="text"
                  placeholder="Enter Email or Phone"
                  value={member}
                  onChange={(e) => setMember(e.target.value)}
                />
                <div className="form-actions">
                  <button className="btn confirm-btn" onClick={handleAddMember}>
                    Add
                  </button>
                  <button
                    className="btn cancel-btn"
                    onClick={() => setShowAddMember(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <button
              className="btn delete-btn"
              onClick={handleDeleteGroup}
            >
              Delete Group
            </button>
          </>
        )}

        <button className="btn close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default GroupInfoModal;