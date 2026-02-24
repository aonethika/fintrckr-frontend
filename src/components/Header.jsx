import '../styles/chatArea.css'

function Header({ group, openInfo, openSplit, showAddSplitButton }) {
  return (
    <div className="grp-split">
      <h2 className="group-title" onClick={openInfo}>
        {group?.name} ▼
      </h2>

      {showAddSplitButton && (
        <button className="add-split-btn" onClick={openSplit}>
          Add Split
        </button>
      )}
    </div>
  );
}

export default Header;
