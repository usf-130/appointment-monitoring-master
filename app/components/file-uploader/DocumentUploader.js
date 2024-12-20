
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card, Button, Form, Row, Col } from "react-bootstrap";
import styles from "./DocumentUploader.module.css";
import {
  FileIcon,
  ExcelIcon,
  ImageIcon,
  PdfIcon,
  WordIcon,
  PowerpointIcon,
} from "./FileIcons";
import { toast } from "react-toastify";
import { deleteThisFile, downloadThisFile } from "../../services/api/api";
import { useRouter } from "next/navigation";

const DocumentUploader = ({
  onFilesChange,
  registeredFiles,
  defaultValue,
  removedPreApload,
}) => {
  const [selectedFiles, setSelectedFiles] = useState([...registeredFiles]);
  const [initValues, setInitValues] = useState([...defaultValue]);

  useEffect(() => {
    setInitValues([...defaultValue]);
  }, [defaultValue]);

  const router = useRouter();

  const onDropAccepted = useCallback(
    (acceptedFiles) => {
      if (selectedFiles.length + initValues?.length < 8) {
        const acctable = acceptedFiles.filter(
          (file, index) => index < 8 - selectedFiles.length - initValues?.length
        );

        if (
          acceptedFiles.length >
          8 - selectedFiles.length - initValues?.length
        ) {
          toast.warning(
            `حداکثر 8 فایل قابل آپلود در سرور است ${
              initValues?.length > 0 &&
              initValues.length + " فایل قبلا در سرور آپلود شده است "
            }
            تنها ${
              8 - selectedFiles?.length - initValues?.length
            } فایل دیگر  قابل آپلود است
            `
          );
          return;
        } else {
          setSelectedFiles((prevFiles) => [...acctable, ...prevFiles]);
        }
      } else {
        toast.warning(
          `حداکثر 8 فایل قابل آپلود در سرور است ${
            initValues?.length > 0 &&
            initValues.length +
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

  const getFileIconUsingName = (fileName) => {
    const fileExtension = fileName.split(".").pop();

    if (fileExtension.startsWith("image/")) {
      return <ImageIcon />;
    } else if (
      [
        "jpg",
        "jpeg",
        "png",
        "gif",
        "bmp",
        "tiff",
        "tif",
        "jfif",
        "webp",
      ].includes(fileExtension)
    ) {
      return <ImageIcon />;
    } else if (fileExtension === "pdf") {
      return <PdfIcon />;
    } else if (fileExtension === "doc" || fileExtension === "docx") {
      return <WordIcon />;
    } else if (fileExtension === "xls" || fileExtension === "xlsx") {
      return <ExcelIcon />;
    } else if (fileExtension === "ppt" || fileExtension === "pptx") {
      return <PowerpointIcon />;
    } else {
      return <FileIcon />;
    }
  };

  const errorHandler = (router, error, elseError) => {
    if (error.response && error.response.status === 400) {
      toast.error(error.response.data.error);
    } else if (error.response && error.response.status === 403) {
      toast.error("فراخوانی اطلاعات با عدم دسترسی");
      router.replace("/access-denied");
    } else if (error.response && error.response.status === 401) {
      toast.error("توکن شما منقضی شده است. دوباره وارد شوید");
      router.replace("/auth/login");
    } else {
      toast.error(elseError);
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

  const handelDownloadFile = async (fileName) => {
    try {
      const response = await downloadThisFile(fileName);
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      if (error.code !== "ERR_NETWORK") {
        const elseError = "مشکلی در دانلود فایل به وجود آمده است";
        errorHandler(router, error, elseError);
      }
    }
  };

  const handleServerFileRemove = async (fileName) => {
    try {
      await deleteThisFile(fileName);
      removedPreApload(fileName);
      toast.success("فایل حذف شد");
    } catch (error) {
      const elseError = "مشکلی در حذف فایل به وجود آمده است";
      errorHandler(router, error, elseError);
    }
  };

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
      {initValues && (
        <div className="file-cards" style={{ marginBottom: 20 }}>
          {initValues?.length > 0 && <p>فایل های آپلود شده ی قبلی:</p>}
          <Row>
            {initValues.map((file, index) => (
              <Card key={file.name} style={{ width: "18rem" }} className="m-2 ">
                <Card.Body>
                  <Row>
                    <Col md="12">
                      {getFileIconUsingName(file.name)}
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => handelDownloadFile(file.name)}
                        className="mx-2"
                      >
                        دانلود
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleServerFileRemove(file.name)}
                      >
                        حذف
                      </Button>
                    </Col>
                  </Row>
                  <Row className="my-1">
                    <Col md="12">
                      <Form.Text muted>
                        توضیحات :
                        {file.description.length > 20
                          ? file.description?.substring(0, 20) + "..."
                          : file.description}
                      </Form.Text>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
          </Row>
        </div>
      )}
      {initValues?.length > 0 && <p>فایل های در حال آپلود:</p>}

      {8 - selectedFiles.length - initValues?.length > 0 && (
        <>
          <p>
            تعداد {8 - selectedFiles.length - initValues?.length} فایل
            (عکس,excel،pdf،power point,word){" "}
            {selectedFiles.length + initValues?.length > 0 && "دیگر"} با حداکثر
            حجم 5 مگابایت برای هر فایل قابل آپلود است
          </p>
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

      <div className="file-cards">
        <Row>
          {selectedFiles.map((file, index) => (
            <Card key={file.name} style={{ width: "18rem" }} className="m-2 ">
              <Card.Body>
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

export default DocumentUploader;
