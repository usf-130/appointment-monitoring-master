"use client";
import React, { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";

import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  getReports,
  getReportsAdmin,
  submitReportStatus,
} from "@/app/services/api/api";
import ReportDocShow from "../file-uploader/ReportDocShow";
import { Form, Row, Spinner } from "react-bootstrap";

const ReportsShow = ({ managerId, admin }) => {
  const [reps, setReps] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const errorHandler = (router, error, elseError) => {
    if (error.response && error.response.status === 400) {
      toast.error(error.response.data.error);
    } else if (error.response && error.response.status === 403) {
      toast.error("فراخوانی اطلاعات با عدم دسترسی");
      router.push("/access-denied");
    } else if (error.response && error.response.status === 401) {
      toast.error("توکن شما منقضی شده است. دوباره وارد حساب خود شوید");
      router.push("/auth/login");
    } else {
      toast.error(elseError);
    }
  };

  const handleSubmitStatus = async (reportId) => {
    try {
      setIsSubmitting(true);
      await submitReportStatus(reportId);
      toast.success("وضعیت گزارش تغییر داده شد");

      setReps((prevValues) => {
        const updated = [...prevValues];
        const report = updated?.find((e) => e.id == reportId);

        if (report) {
          report.isProcessed = !report.isProcessed;
        }

        return updated;
      });
    } catch (error) {
      const elseError = "مشکلی در تعیین وضعیت  گزارش  مدیر  به وجود آمده است";
      errorHandler(router, error, elseError);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const getReportsListAsync = async () => {
      try {
        const response = await getReports(managerId);
        setReps(response.data);
      } catch (error) {
        const elseError = "مشکلی در دریافت  گزارش های  مدیر  به وجود آمده است";
        errorHandler(router, error, elseError);
      }
    };

    const getReportsListAdminAsync = async () => {
      try {
        const response = await getReportsAdmin(managerId);
        setReps(response.data);
      } catch (error) {
        const elseError = "مشکلی در دریافت  گزارش های  مدیر  به وجود آمده است";
        errorHandler(router, error, elseError);
      }
    };
    if (admin) {
      getReportsListAdminAsync();
    } else {
      getReportsListAsync();
    }
  }, [managerId]);

  return (
    <>
      <Accordion>
        {reps?.map((item, index) => (
          <Accordion.Item key={item.id} eventKey={item.id.toString()}>
            <Accordion.Header>
              {index + 1}
              {"-"}
              {item.name}{" "}
            </Accordion.Header>
            <Accordion.Body>
              <Row>
                <p>{item.text}</p>
              </Row>

              {
                <Row>
                  <Form.Text>مستندات و مدارک گزارش:</Form.Text>
                  <ReportDocShow docList={item.docNames} />
                </Row>
              }

              <Row>
                <div className="d-flex align-items-center my-2">
                  <strong className="form-check-label">وضعیت بررسی: </strong>

                  {item.isProcessed ? (
                    <strong className="text-success">بررسی شده</strong>
                  ) : (
                    <strong className="text-danger">بررسی نشده </strong>
                  )}
                </div>
              </Row>
              <Button
                variant="outline-primary"
                type="submit"
                className="mx-1"
                disabled={isSubmitting}
                onClick={() => handleSubmitStatus(item.id)}
              >
                {isSubmitting && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                )}

                {isSubmitting ? (
                  <span className="visually-hidden">در حال ثبت...</span>
                ) : (
                  <>
                    {item.isProcessed
                      ? "تغییر به بررسی نشده"
                      : "تغییر به بررسی شده"}
                  </>
                )}
              </Button>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </>
  );
};

export default ReportsShow;
