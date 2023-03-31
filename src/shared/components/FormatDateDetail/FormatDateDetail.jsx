import React from "react";
import "./styles.css";

const FormatDateDetail = date => {
  const fecha = date.date.slice(0, 10);
  const horas = date.date.slice(11, 19);

  return (
    <>
      <p className='format-date'>{fecha}</p>
      <p className='format-hours'>{horas}</p>
    </>
  );
};

export default FormatDateDetail;
