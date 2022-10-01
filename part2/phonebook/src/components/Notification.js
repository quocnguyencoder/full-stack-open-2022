import React from "react";
import "../index.css";

const Notification = ({ type, message }) => {
  return message ? <h2 className={`${type}-message`}>{message}</h2> : null;
};

export default Notification;
