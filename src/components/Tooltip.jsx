import React from "react";

function Tooltip({ tooltipRef }) {
  return (
    <div
      id="tooltip"
      ref={tooltipRef}
      style={{
        position: "absolute",
        display: "none",
        background: "#fff",
        padding: "5px",
        border: "1px solid #000",
        borderRadius: "5px",
      }}
    ></div>
  );
}

export default Tooltip;
