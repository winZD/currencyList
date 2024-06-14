import React from "react";
import { useParams } from "react-router-dom";

function History() {
  const { currency } = useParams();
  return <div>{currency}</div>;
}

export default History;
