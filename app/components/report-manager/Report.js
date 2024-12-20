import React, { useState } from "react";
import ReportUploader from "../file-uploader/ReportUploader";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { submitReport } from "@/app/services/api/api";

const Report = ({ managerId,closeModal }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const minLength = 20;
  const maxLength = 700;

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

  const onSubmit = async (data) => {
    
    if (watch("reportDocs")?.some((file) => !file.description)) {
      toast.error("لطفا برای تمام مستندات آپلود شده، توضیح کوتاه بنویسید");
      return;
    }
    const sendData = {
        ...data,
        managerId,
      };

    setIsSubmitting(true);

    try {
      await submitReport(sendData);
      toast.success("ثبت گزارش با موفقیت انجام شد");
      closeModal();
      reset();
      
    } catch (error) {
      const elseError = "مشکلی در ثبت گزارش رخ داده است";
      errorHandler(router, error, elseError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      dir="rtl"
      noValidate
      style={{ paddingLeft: "2rem", paddingRight: "2rem" }}
    >
      <Row className="my-1">
        <Col md={3} className="mt-5">
          <Form.Group>
            <Form.Label>نام و نام خانوادگی</Form.Label>
            <div className="input-group">
              <Form.Control
                type="text"
                isInvalid={errors.fullName}
                {...register("fullName", {
                  required: true,
                })}
              />
            </div>
            {errors.fullName && (
              <Form.Text className="text-danger mx-1">
                {errors.fullName.message}
                وارد کردن نام الزامی است
              </Form.Text>
            )}
          </Form.Group>
        </Col>
        <Col md={9}>
          <Form.Group>
            <Form.Label>متن گزارش</Form.Label> ({maxLength}/{watch("reportText")?.length || 0})
            <div className="input-group">
              <Controller
                name="reportText"
                control={control}
                defaultValue=""
                rules={{
                  required: true,
                  minLength: minLength,
                  maxLength: maxLength,
                }}
                render={({ field }) => (
                  <Form.Control
                    as="textarea"
                    rows={5}
                    {...field}
                    isInvalid={errors.reportText}
                  />
                )}
              />
            </div>
            {errors.reportText && errors.reportText.type === "required" && (
              <Form.Text className="text-danger mx-1">
                وارد کردن متن گزارش الزامی است
              </Form.Text>
            )}
            {errors.reportText && errors.reportText.type === "minLength" && (
              <Form.Text className="text-danger mx-1">
                حداقل {minLength} کاراکتر الزامی است
              </Form.Text>
            )}
            {errors.reportText && errors.reportText.type === "maxLength" && (
              <Form.Text className="text-danger mx-1">
                حداکثر تعداد کاراکترها {maxLength} می‌باشد
              </Form.Text>
            )}
          </Form.Group>
        </Col>
      </Row>
      <Row className="mt-3" >
        <Col xs={12} md={12} >
          <Controller
            name="reportDocs"
            control={control}
            render={({ field }) => (
              <ReportUploader
                registeredFiles={field.value || []}
                onFilesChange={(files) => field.onChange(files)}
              />
            )}
          />
        </Col>
      </Row>
      <Row className="my-2">
        <Col md="12">
          <Button
            variant="outline-primary"
            type="submit"
            className="mx-1"
            disabled={isSubmitting}
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
              <span> ثبت گزارش</span>
            )}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default Report;
