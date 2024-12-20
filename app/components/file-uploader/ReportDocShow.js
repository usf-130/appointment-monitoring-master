"use client";
import React, { useEffect, useState } from "react";
import { Card, Button, Form, Row, Col } from "react-bootstrap";
import {
  FileIcon,
  ExcelIcon,
  ImageIcon,
  PdfIcon,
  WordIcon,
  PowerpointIcon,
} from "./FileIcons";
import { toast } from "react-toastify";
import { downloadReportFile } from "@/app/services/api/api";
import { useRouter } from "next/navigation";

const ReportDocShow = ({ docList }) => {
  const [docs, setDocs] = useState(docList);
  const router = useRouter();

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

  useEffect(() => {
    setDocs(docs);
  }, [docList]);

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

  const handelDownloadFile = async (fileName) => {
    try {
      const response = await downloadReportFile(fileName);
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

  return (
    <div className="file-cards" style={{ marginBottom: 20 }}>
      <Row>
        {docs.map((file, index) => (
          <Card key={file.name} style={{ width: "20rem" }} className="m-2 ">
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
  );
};
export default ReportDocShow;
