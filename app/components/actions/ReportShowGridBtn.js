import React, { useCallback, useState } from "react";

const ReportShowGridBtn = ({ reports }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return (
    <div
      className={`thumbnail-container ${isHovered ? "hoveredx" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="thumbnail-wrapper"
        style={{
          backgroundColor: "#00ced12f",
          height: 50,
          width: 50,
          alignItems: "center",
        }}
      >
        <strong> {reports}</strong>
      </div>
    </div>
  );
};

export default ReportShowGridBtn;
