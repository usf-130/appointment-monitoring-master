"use client";
import React from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import transition from "react-element-popper/animations/transition";
import opacity from "react-element-popper/animations/opacity";
import { Form } from "react-bootstrap";

const FaDatePicker = ({ onChange, defaultValue }) => {
  return (
    <div style={{ direction: "rtl" }}>
      <DatePicker
        render={<CustomInput />}
        onChange={(date) => {
          onChange(date?.format?.("YYYY/MM/DD"));
        }}
        format={"YYYY/MM/DD"}
        containerClassName="w-100"
        calendar={persian}
        maxDate={new DateObject({ calendar: persian })}

        locale={persian_fa}
        value={defaultValue? new DateObject({
                date: defaultValue,
                format: "YYYY/MM/DD",
                calendar: persian,
                locale: persian_fa,
              }):""
        }
        animations={[
          opacity(),
          transition({
            from: 40,
            transition: "all 400ms cubic-bezier(0.335, 0.010, 0.030, 1.360)",
          }),
        ]}
        calendarPosition="top-right"
      />
    </div>
  );
};

export default FaDatePicker;

function CustomInput({ onFocus, value, onChange }) {
  return <Form.Control onFocus={onFocus} value={value} onChange={onChange} />;
}
