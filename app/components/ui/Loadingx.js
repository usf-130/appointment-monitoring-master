"use client";
import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loadingx = ({variant}) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Spinner animation="grow" variant={variant || "warning"} style={{ width: '150px', height: '150px' }}  />
    </div>
  );
};

export default Loadingx;
