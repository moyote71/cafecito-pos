import React from "react";
import "./Loader.css";

const Loader = ({ size = "medium", color = "primary" }) => {
  return (
    <div className={`loader-container ${size}`}>
      <div className={`spinner border-${color}`}></div>
    </div>
  );
};

export default Loader;
