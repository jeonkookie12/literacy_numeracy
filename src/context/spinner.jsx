import React from "react";

const Spinner = () => {
  const containerStyle = {
    width: "3.25em",
    transformOrigin: "center",
    animation: "rotate4 2s linear infinite",
  };

  const loaderStyle = {
    fill: "none",
    stroke: "#106ee8",
    strokeWidth: 10,
    strokeDasharray: "2, 200",
    strokeDashoffset: 0,
    strokeLinecap: "round",
    animation: "dash4 1.5s ease-in-out infinite",
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <svg viewBox="25 25 50 50" style={containerStyle}>
        <circle cx="50" cy="50" r="20" style={loaderStyle} />
      </svg>
      <style>
        {`
          @keyframes rotate4 {
            100% {
              transform: rotate(360deg);
            }
          }

          @keyframes dash4 {
            0% {
              stroke-dasharray: 1, 200;
              stroke-dashoffset: 0;
            }
            50% {
              stroke-dasharray: 90, 200;
              stroke-dashoffset: -35px;
            }
            100% {
              stroke-dashoffset: -125px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Spinner;