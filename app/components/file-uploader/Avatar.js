

import { useCallback, useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useDropzone } from "react-dropzone";

const Avatar = ({ selectedFile, onFileChange, initValue }) => {
  const [avatar, setAvatar] = useState();

  useEffect(() => {
    if (initValue && !selectedFile) {
      setAvatar(process.env.NEXT_PUBLIC_API_ROOT + "/AvatarImage/" + initValue);
    }
  }, [initValue]);

  useEffect(() => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  }, [selectedFile]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const selectedAvatar = acceptedFiles[0];
      setAvatar(URL.createObjectURL(selectedAvatar));
      onFileChange(selectedAvatar);
    },
    [onFileChange]
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [".jpg", ".jpeg", ".png"] },
    onDrop,
  });

  const avatarStyle = {
    width: "250px",
    height: "250px",
    borderRadius: "50%",
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    overflow: "hidden",
  };

  return (
    <div>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {avatar ? (
          <>
            <Row>
              <Col md="8">
                <img
                  src={avatar}
                  style={avatarStyle}
                  alt="Avatar"
                />
              </Col>
              <Col col="4" style={{marginTop:100}}>
                <Button size="lg" variant="outline-success" type="button">
                  ویرایش
                </Button>
              </Col>
            </Row>
          </>
        ) : (
          <div style={avatarStyle} className="p-5"></div>
        )}
      </div>
    </div>
  );
};

export default Avatar;
