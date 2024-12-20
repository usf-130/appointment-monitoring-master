import React, { useCallback, useState } from "react";

const GeoInfoAgGridButton = () => {
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
          src={'/img/actions/loc.png'}
          className="thumbnail-image"
          height={20}
          width={20}
        />
      </div>
    </div>
  );
};

export default GeoInfoAgGridButton;
