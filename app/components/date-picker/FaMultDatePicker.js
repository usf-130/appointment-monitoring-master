
import React, { useEffect, useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import { Form } from "react-bootstrap";



const FaMultDatePicker = ({ onChange, defaultValues }) => {
  const [defValues, setDefValues] = useState();

  useEffect(() => {
    if (defaultValues) {
      const dateStrings = (defaultValues + "")?.split(",");
      const dateObjects = [];
      dateStrings?.forEach((dateString) => {
        const dateObject = (new DateObject({
          date: dateString,
          format: "YYYY/MM/DD",
          calendar: persian,
          locale: persian_fa,
        }));

        dateObjects.push(dateObject);
      });
      setDefValues(dateObjects);
    }
  }, [defaultValues]);

  return (
    <div style={{ direction: "rtl" }}>
      <DatePicker
        onChange={(date) => {
          onChange(date);
        }}
        calendar={persian}
        locale={persian_fa}
        multiple
        dateSeparator=","
        multipleRangeSeparator=","
        value={defValues || ""}
        render={<CustomInput />}
        maxDate={new DateObject({ calendar: persian })}
        calendarPosition="top-right"
        plugins={[
          <DatePanel
            sort="date"
            markFocused
            focusedClassName="bg-green"
            header="... تاریخ های انتصاب و پایان مدیریت ..."
          />,
        ]}
      />
    </div>
  );
};

export default FaMultDatePicker;

function CustomInput({ onFocus, value, onChange }) {
  return (
    <Form.Control onFocus={onFocus} value={value || ""} onChange={onChange} />
  );
}
