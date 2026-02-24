import { useState } from "react";
import { useDispatch } from "react-redux";
import { createGroup, fetchAllGroups } from "../redux/slices/groupSlice";

const GroupForm = () => {
  const [groupName, setGroupName] = useState("");
  const [membersInput, setMembersInput] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const membersArray = membersInput
      .split(",")
      .map(item => item.trim())
      .filter(Boolean);

    if (membersArray.length < 1) {
      alert("You must add at least one member");
      return;
    }

    try {
      console.log({ groupName, membersArray });

      await dispatch(createGroup({
        name: groupName,
        members: membersArray, 
      })).unwrap();

       dispatch(fetchAllGroups());

      alert("Group created successfully");
      setGroupName("");
      setMembersInput("");
    } catch (err) {
      alert(err?.message || "Failed to create group");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="group-form">
      <input
        type="text"
        placeholder="Group Name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Members emails or phone numbers, comma separated"
        value={membersInput}
        onChange={(e) => setMembersInput(e.target.value)}
        required
      />
      <button type="submit">Create Group</button>
    </form>
  );
};

export default GroupForm;
