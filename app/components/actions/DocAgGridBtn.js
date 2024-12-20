import React, { useCallback, useState } from "react";

const DocAgGridBtn = () => {
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
          src={'/img/actions/docs.png'}
          className="thumbnail-image"
          height={12}
          width={12}
        />
      </div>
    </div>
  );
};

export default DocAgGridBtn;
