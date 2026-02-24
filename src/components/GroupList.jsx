import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllGroups } from "../redux/slices/groupSlice";
import { Link } from "react-router-dom";
// import "../style/group.css";

const GroupList = () => {
  const dispatch = useDispatch();
  const { groups, status, error } = useSelector((state) => state.groups);
  
  

  
  console.log(groups);
  

  useEffect(() => {
    dispatch(fetchAllGroups());
  }, [dispatch]);

  if (status === "loading") return <p className="status-text">Loading...</p>;
  if (status === "failed") return <p className="status-text error">{error}</p>;

  return (
    <div className="group-list">
      {groups && groups.length > 0 ? (
        groups.map((group) => (
          <Link
            key={group._id}
            to={`/group/${group._id}`}
            className="group-card"
          >
            <h3>{group.name}</h3>
          </Link>
        ))
      ) : (
        <p className="status-text">No groups found</p>
      )}
    </div>
  );
};

export default GroupList;
