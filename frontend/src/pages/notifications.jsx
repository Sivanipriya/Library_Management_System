import React, { useState } from "react";
import "./Notification.css";

const notifications = () => {
  const [error, setError] = useState("");

  const handleAction = () => {
    // Example check
    if (/* some invalid action */ true) {
      setError("🚫 This action is not allowed.");
      // Optionally clear after 3 seconds
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div>
      {error && <div className="notification-box">{error}</div>}

      <button onClick={handleAction}>Do something</button>
    </div>
  );
};

export default notifications;
