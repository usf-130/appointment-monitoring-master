"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card, Button, Form, Row, Col } from "react-bootstrap";
import styles from "./ReportUploader.module.css";
import {
  FileIcon,
  ExcelIcon,
  ImageIcon,
  PdfIcon,
  WordIcon,
  PowerpointIcon,
} from "./FileIcons";
import { toast } from "react-toastify";

const ReportUploader = ({
  onFilesChange,
  registeredFiles,
}) => {
  const [selectedFiles, setSelectedFiles] = useState([...registeredFiles]);

  const onDropAccepted = useCallback(
    (acceptedFiles) => {
      if (selectedFiles.length < 6) {
        const acctable = acceptedFiles.filter(
          (file, index) => index < 6 - selectedFiles.length
        );

        if (
          acceptedFiles.length >
          6 - selectedFiles.length
        ) {
          toast.warning(
            `حداکثر 6 فایل قابل آپلود در سرور است 
            تنها ${
              5 - selectedFiles?.length
            } فایل دیگر قابل آپلود است
            `
          );
          return;
        } else {
          setSelectedFiles((prevFiles) => [...acctable, ...prevFiles]);
        }
      } else {
        toast.warning(
          `حداکثر 6 فایل قابل آپلود در سرور است ${
              " فایل قبلا در سرور آپلود شده است " +
              selectedFiles?.length +
              " فایل نیز انتخاب شده است  "
          }
          
          `
        );
      }
    },
    [selectedFiles]
  );

  const handleFileRemove = (file) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(newFiles.indexOf(file), 1);
    setSelectedFiles(newFiles);
  };

  useEffect(() => {
    onFilesChange([...selectedFiles]);
  }, [selectedFiles]);

  const openFileInBrowser = (file) => {
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL, "_blank");
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith("image/")) {
      return <ImageIcon />;
    } else if (fileType === "application/pdf") {
      return <PdfIcon />;
    } else if (
      fileType === "application/msword" ||
      fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return <WordIcon />;
    } else if (
      fileType === "application/vnd.ms-excel" ||
      fileType ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      return <ExcelIcon />;
    } else if (
      fileType === "application/vnd.ms-powerpoint" ||
      fileType ===
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ) {
      return <PowerpointIcon />;
    } else {
      return <FileIcon />;
    }
  };


  function validateInputFiles(file) {
    if (file.size > 5 * 10 ** 6) {
      toast.error(`فایل ${file.name} بزرگ تر از مقدار مجاز 5 مگابایت است`);
      return {
        code: "big-file",
        message: `فایل ${file.name} بزرگ تر از مقدار مجاز 5 مگابایت است`,
      };
    }
    if (
      selectedFiles.some((e) => e.name === file.name && e.size === file.size)
    ) {
      toast.error(`فایل ${file.name} قبلا آپلود شده است`);
      return {
        code: "duplicated-file",
        message: `فایل ${file.name} تکراری است`,
      };
    }
    return null;
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/msword": [".doc", ".docx"],
      "application/vnd.ms-excel": [".xls", ".xlsx"],
      "application/vnd.ms-powerpoint": [".ppt", ".pptx"],
      "image/*": [".jpg", ".jpeg", ".png", ".gif", ".bmp"],
      "application/pdf": [".pdf"],
    },
    onDropAccepted,
    validator: validateInputFiles,
  });

  return (
    <div className={styles.container}>
      {(6 - selectedFiles.length) > 0 && (
        <>
          <Form.Text>
            تعداد {6 - selectedFiles.length } فایل
            (عکس,excel،pdf،power point,word){" "}
            {selectedFiles.length  > 0 && "دیگر"} با حداکثر
            حجم 5 مگابایت برای هر فایل قابل آپلود است
          </Form.Text>
          <div className={styles.dropzone} {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <Form.Text style={{ fontSize: "1.5rem" }}>
                {" "}
                اینجا رها کنید
              </Form.Text>
            ) : (
              <>
                <p style={{ marginTop: 15 }}>
                  فایل ها را انتخاب کنید یا روی این قسمت درگ کنید
                </p>
              </>
            )}
          </div>
        </>
      )}

      <div className="file-cards" >
        <Row  >
          {selectedFiles.map((file, index) => (
            <Card key={file.name} style={{ width: "18rem" }} className="m-2 ">
              <Card.Body >
                <Row>
                  <Col md="12">
                    {getFileIcon(file.type)}
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => openFileInBrowser(file)}
                      className="mx-2"
                    >
                      مشاهده
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleFileRemove(file)}
                    >
                      حذف
                    </Button>
                  </Col>
                </Row>
                <Row className="my-1">
                  <Col md="12">
                    <Form.Text muted>
                      {" "}
                      نام :{" "}
                      {file.name.length > 20
                        ? file.name?.substring(0, 20) + "..."
                        : file.name}
                    </Form.Text>
                  </Col>
                </Row>
                <Row>
                  <Col md="12">
                    <Form.Group>
                      <Form.Label>توضیحات:</Form.Label>
                      <Form.Control
                        required
                        size="sm"
                        type="text"
                        isInvalid={!file.description || false}
                        isValid={file.description || false}
                        value={file.description || ""}
                        onChange={(e) => {
                          setSelectedFiles((preFiles) =>
                            preFiles.map((f) => {
                              if (f === file) {
                                f.description = e.target.value;
                              }
                              return f;
                            })
                          );
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default ReportUploader;
