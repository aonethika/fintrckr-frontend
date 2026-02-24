import React from "react";
import GroupForm from "../components/GroupForm";
import GroupList from "../components/GroupList";
import '../styles/group.css'


const Group = () => {
  return (
    <div>

      <GroupForm />
      <GroupList />
    </div>
  );
};

export default Group;
