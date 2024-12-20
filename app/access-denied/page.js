"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button, Container, Row } from "react-bootstrap";

const page = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <Row>
          <Image
            height={500}
            width={500}
            src={"/img/errors/403.gif"}
            alt="Access Denied"
            className="mb-4 d-block"
          />
        </Row>
        <Row>
       
            <Button variant="outline-primary" as={Link} href={"/"} className="d-block">
              بازگشت به صفحه اصلی
            </Button>
         
        </Row>
      </div>
    </Container>
  );
};

export default page;
