import React, { useCallback, useState } from "react";

const ReportGridBtn = () => {
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
      <div className="thumbnail-wrapper">
        
        <img
          src={'/img/actions/report.png'}
          className="thumbnail-image"
          height={15}
          width={15}
        />
      </div>
    </div>
  );
};

export default ReportGridBtn;
