import React, { useEffect, useState } from "react";
import splashLogo from "../assets/images/money-chasing.png";
import "../styles/splash.css";

function SplashScreen({ onFinish }) {
  const [showName, setShowName] = useState(false);

  useEffect(() => {
    const nameTimer = setTimeout(() => setShowName(true), 1000);
    const finishTimer = setTimeout(() => {
      onFinish && onFinish();
    }, 2500); 
    return () => {
      clearTimeout(nameTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div className="splash-container">
      <img src={splashLogo} alt="App Logo" className="app-logo" />
      {showName && <div className="app-name">FinTrackr</div>}
    </div>
  );
}

SplashScreen.defaultProps = {
  onFinish: () => {}
};

export default SplashScreen;
