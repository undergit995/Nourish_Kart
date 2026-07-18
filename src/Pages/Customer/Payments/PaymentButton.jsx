import { enqueueSnackbar, SnackbarProvider } from "notistack";
import api from "../../../api/axiosConfig";
import { PrimaryButton } from "../../../Components/Common/Buttons";
import { replace, useNavigate } from "react-router-dom";
import { addValue, clearCart, getItems } from "../../../Redux/Slices/CM_CartSlice";
import { useDispatch } from "react-redux";

export default function PaymentButton({ amount, addressId, coupon_id = "" }) {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  if (!addressId) {
    return null;
  }
  const handlePayment = async () => {
    try {
      const { data: order } = await api.post("/api/payment/create-order", {
        amount,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "KitechenCooks",
        description: "Order Payment",

        handler: async function (response) {
          try {
            const { data } = await api.post("/api/payment/verify-payment", {
              ...response,
              amount,
              addressId,
              coupon_id,
            });
            if (data.success) {
              enqueueSnackbar("Payment successfull!", { variant: "success" });
              dispatch(clearCart())
              navigate("/customer/orderlist");
            } else {
              enqueueSnackbar("Verification failed", { variant: "error" });
            }
          } catch (error) {
            console.log(error.message);
            console.error("API Error", error.message);
            enqueueSnackbar("Error verifying payment", { variant: "error" });
          }
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        console.error(response.error);
        enqueueSnackbar(response.error.description || "Payment failed", {
          variant: "error",
        });
      });

      razorpay.open();
    } catch (error) {
      console.log(error?.response?.data.message);
      enqueueSnackbar("Unable to initiate payment", {
        variant: "error",
      });
    }
  };

  return (
    <>
      <SnackbarProvider />

      <PrimaryButton
        onClick={handlePayment}
        sx={{
          mt: 3,
          maxWidth: "60%",
        }}
      >
        Pay Now
      </PrimaryButton>
    </>
  );
}
