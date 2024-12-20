"use client";

import { registerMe } from "@/app/services/api/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import Switch from "react-switch";
import { toast } from "react-toastify";

const Page = () => {
  const router = useRouter();
  const {
    handleSubmit,
    control,
    register,
    watch,
    formState: { errors },
  } = useForm();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const errorHandler = (error, elseError) => {
    if (error.response && error.response.status === 400) {
      toast.error(error.response.data.error);
    } else {
      toast.error(elseError);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitted(true);
      await registerMe(data);
      toast.success("ثبت نام با موفقیت انجام شد، وارد حساب خود شوید");
      router.push("/auth/login");
    } catch (error) {
      const elseError = "مشکلی در روند ثبت نام به وجود آمده است";
      errorHandler(error, elseError);
    } finally {
      setIsSubmitted(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={6} md={4} className="text-center">
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col xs={12} className="mb-2">
                <Form.Label htmlFor="userName">نام کاربری</Form.Label>
                <Form.Control
                  id="userName"
                  type="text"
                  placeholder="نام کاربری"
                  isInvalid={!!errors.userName}
                  {...register("userName", { required: "نام کاربری را وارد نمایید" })}
                />
                {errors?.userName && (
                  <Form.Control.Feedback type="invalid">
                    {errors?.userName?.message}
                  </Form.Control.Feedback>
                )}
              </Col>
              <Col xs={12} className="mb-2">
                <Form.Label htmlFor="password">رمز عبور</Form.Label>
                <Form.Control
                  id="password"
                  type="password"
                  placeholder="رمز عبور"
                  isInvalid={!!errors.password}
                  {...register("password", {
                    required: "رمز عبور را وارد نمایید",
                    minLength: {
                      value: 6,
                      message: "رمز عبور باید حداقل 6 کاراکتر داشته باشد",
                    },
                  })}
                />
                {errors?.password && (
                  <Form.Control.Feedback type="invalid">
                    {errors?.password?.message}
                  </Form.Control.Feedback>
                )}
              </Col>
              <Col xs={12} className="mb-3">
                <Form.Label htmlFor="confirmPassword">
                  تکرار رمز عبور
                </Form.Label>
                <Form.Control
                  id="confirmPassword"
                  type="password"
                  placeholder="تکرار رمز عبور"
                  isInvalid={!!errors.confirmPassword}
                  {...register("confirmPassword", {
                    required: "تکرار رمز عبور را وارد نمایید",
                    validate: (value) =>
                      (value && value === watch("password")) ||
                      "رمز عبور با تکرار رمز عبور هم خوانی ندارد",
                  })}
                />
                {errors?.confirmPassword && (
                  <Form.Control.Feedback type="invalid">
                    {errors?.confirmPassword?.message}
                  </Form.Control.Feedback>
                )}
              </Col>
              <Col xs={12} className="mb-3">
                <Form.Group>
                  <Row>
                    <Col>
                      <Form.Label>مدیر دستگاه هستم</Form.Label>
                    </Col>
                    <Col>
                      <Controller
                        name="isOrganManager"
                        control={control}
                        render={({ field }) => (
                          <Switch
                            onChange={(checked) => field.onChange(checked)}
                            checked={field.value || false}
                          />
                        )}
                      />
                    </Col>
                  </Row>
                </Form.Group>
              </Col>
            </Row>

            {isSubmitted ? (
              <Spinner animation="border" role="status" className="mx-3">
                <span className="sr-only">ثبت...</span>
              </Spinner>
            ) : (
              <Button variant="primary" type="submit" className="mx-3">
                ثبت نام
              </Button>
            )}
            <Button
              as={Link}
              variant="outline-info"
              type="button"
              href={"/"}
              className="mx-3"
            >
              بازگشت
            </Button>
            <Button
              as={Link}
              variant="outline-success"
              type="button"
              href={"/auth/login"}
            >
              ورود
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Page;
