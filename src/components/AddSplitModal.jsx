import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createGroupSplit, fetchGroupById } from '../redux/slices/groupSlice';

function AddSplitModal({ group, onClose }) {
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [splitType, setSplitType] = useState('equal'); 
  const [selectedMembers, setSelectedMembers] = useState(
    group?.members.map(m => m._id) || []
  );
  const [customSplits, setCustomSplits] = useState({});
  const [payer, setPayer] = useState(group?.members[0]?._id || '');

  useEffect(() => {
    if (splitType === 'equal' && amount && selectedMembers.length > 0) {
      const perPerson = (Number(amount) / selectedMembers.length).toFixed(2);
      const equalSplit = {};
      selectedMembers.forEach(id => (equalSplit[id] = Number(perPerson)));
      setCustomSplits(equalSplit);
    }
  }, [amount, selectedMembers, splitType]);

  const toggleMember = (id) => {
    setSelectedMembers(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleCustomAmount = (id, value) => {
    const val = Number(value);
    const remaining = Number(amount) - val;
    const others = selectedMembers.filter(x => x !== id);
    const perOther = Math.round((remaining / others.length) * 100) / 100;
    const updated = { ...customSplits, [id]: val };
    others.forEach(x => (updated[x] = perOther));
    setCustomSplits(updated);
  };

  const handleSubmit = async () => {
    if (!title || !amount || !payer || selectedMembers.length === 0) return;

    const splits = selectedMembers.map(id => ({
      user: id,
      amount: customSplits[id] || 0,
      status: id === payer ? "paid" : "unpaid"
    }));

    const data = {
      title,
      amount: Number(amount),
      splitType,
      payer,
      splits
    };

    await dispatch(createGroupSplit({ groupId: group._id, data }));
    await dispatch(fetchGroupById(group._id));
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2 className="modal-title">Add Split</h2>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="modal-input"
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="modal-input"
        />

        <label className="modal-label">Payer</label>
        <select value={payer} onChange={e => setPayer(e.target.value)} className="modal-select">
          {group?.members?.map(m => (
            <option key={m._id} value={m._id}>{m.name}</option>
          ))}
        </select>

        <label className="modal-label">Split Type</label>
        <select value={splitType} onChange={e => setSplitType(e.target.value)} className="modal-select">
          <option value="equal">Equal</option>
          <option value="custom">Custom</option>
        </select>

        <label className="modal-label">Members</label>
        <div className="members-list">
          {group?.members?.map(m => (
            <div key={m._id} className="member-item">
              <input
                type="checkbox"
                checked={selectedMembers.includes(m._id)}
                onChange={() => toggleMember(m._id)}
              />
              <span>{m.name}</span>
              {splitType === 'custom' && selectedMembers.includes(m._id) && (
                <input
                  type="number"
                  placeholder="Share"
                  value={customSplits[m._id] || ''}
                  onChange={e => handleCustomAmount(m._id, e.target.value)}
                  className="custom-amount"
                />
              )}
            </div>
          ))}
        </div>

        <div className="modal-actions">
          <button className="btn split-btn" onClick={handleSubmit}>Add Split</button>
          <button className="btn cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default AddSplitModal;