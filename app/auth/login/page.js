"use client";
import Loadingx from "@/app/components/ui/Loadingx";
import { loginMe } from "@/app/services/api/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const Page = () => {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const {
    handleSubmit,
    register,
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
      const response = await loginMe(data);
      const { token, tokenExpire, refreshToken, roles } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("tokenExpire", tokenExpire);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("roles", JSON.stringify(roles));

      let routing = "/manager";
      if (roles.includes("admin")) {
        routing = "/admin";
      } else if (roles.includes("organManager")) {
        routing = "/organ-manager";
      }
      setIsRedirecting(true);
      router.push(routing);
    } catch (error) {
      const elseError = "مشکلی در روند ورود به حساب کاربری به وجود آمده است";
      errorHandler(error, elseError);
    } finally {
      setIsSubmitted(false);
    }
  };

  if (isRedirecting) {
    return <Loadingx />;
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={6} md={4} className="text-center">
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col xs={12} className="mb-2">
                <Form.Label htmlFor="username">نام کاربری</Form.Label>
                <Form.Control
                  id="username"
                  type="text"
                  placeholder="نام کاربری"
                  isInvalid={!!errors.username}
                  {...register("username", { required: "نام کاربری را وارد نمایید" })}
                />
                {errors?.username && (
                  <Form.Control.Feedback type="invalid">
                    {errors?.username?.message}
                  </Form.Control.Feedback>
                )}
              </Col>
              <Col xs={12} className="mb-4">
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
                {errors.password && (
                  <Form.Control.Feedback type="invalid">
                    {errors?.password?.message}
                  </Form.Control.Feedback>
                )}
              </Col>
            </Row>

            {isSubmitted ? (
              <Spinner animation="border" role="status" className="mx-3">
                <span className="sr-only">ورود...</span>
              </Spinner>
            ) : (
              <Button variant="primary" type="submit" className="mx-3">
                ورود
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
              href={"/auth/register"}
            >
              ثبت نام
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Page;
