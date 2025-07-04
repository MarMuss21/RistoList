import React from "react";

function GroupsList({ groups, onSelectGroup }) {
  return (
    <div style={{ margin: "2rem 0" }}>
      <h2>Gruppi</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {groups.map((group, idx) => (
          <li
            key={group.id || idx}
            style={{ marginBottom: ".5rem", cursor: "pointer" }}
            onClick={() => onSelectGroup(group)}
          >
            {group.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GroupsList;