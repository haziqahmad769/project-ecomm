import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Spinner from "../../components/Spinner";

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const status = searchParams.get("status_id");
    const orderId = searchParams.get("order_id");

    if (status === "1") {
      navigate(`/payment-success?order_id=${orderId}`);
    } else {
      navigate("/payment-failed");
    }
  });

  return <Spinner />;
};

export default PaymentResult;
