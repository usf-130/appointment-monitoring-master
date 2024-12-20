import React, { useCallback, useState } from "react";

const ImageCellRenderer = ({ value }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return (
    <div
      className={`thumbnail-container ${isHovered ? "hovered" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="thumbnail-wrapper">
        
        <img
          src={value?process.env.NEXT_PUBLIC_API_ROOT + "/AvatarImage/" + value:'/img/noPhoto.png'}
          className="thumbnail-image"
          height={50}
          width={50}
        />
      </div>
    </div>
  );
};

export default ImageCellRenderer;
