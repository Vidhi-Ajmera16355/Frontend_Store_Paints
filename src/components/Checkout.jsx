import React, { useContext, useEffect, useState } from "react";
import AppContext from "../context/AppContext";
import axios from "axios";
import TableProduct from "./TableProduct";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { cart, userAddress, url, user, clearCart } = useContext(AppContext);
  const [qty, setQty] = useState(0);
  const [price, setPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let qty = 0;
    let price = 0;
    if (cart?.items) {
      for (let i = 0; i < cart.items?.length; i++) {
        qty += cart.items[i].qty;
        price += cart.items[i].price;
      }
    }
    setPrice(price);
    setQty(qty);
  }, [cart]);

  const handlePayment = async () => {
    console.log("🟡 handlePayment triggered");
    console.log("Price:", price, "Qty:", qty);
    console.log("Cart:", cart);
    console.log("User:", user);
    console.log("UserAddress:", userAddress);

    // Check if Razorpay script is loaded
    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded. Check your index.html script tag.");
      return;
    }

    try {
      console.log("🟡 Calling backend /payment/checkout...");
      const orderResponse = await axios.post(`${url}/payment/checkout`, {
        amount: price,
        qty: qty,
        cartItems: cart?.items,
        userShipping: userAddress,
        userId: user._id,
      });

      console.log("✅ Order response:", orderResponse.data);

      const { orderId, amount: orderAmount } = orderResponse.data;

      if (!orderId) {
        alert(
          "No orderId returned from backend. Check your /payment/checkout route.",
        );
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderAmount,
        currency: "INR",
        name: "Ajmera Paints",
        description: "Ajmera Paints",
        order_id: orderId,
        handler: async function (response) {
          console.log("✅ Payment success response:", response);
          const paymentData = {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            amount: orderAmount,
            orderItems: cart?.items,
            userId: user._id,
            userShipping: userAddress,
          };

          const api = await axios.post(
            `${url}/payment/verify-payment`,
            paymentData,
          );
          console.log("✅ Verify response:", api.data);

          if (api.data.success) {
            clearCart();
            navigate("/orderconfirmation");
          } else {
            alert("Payment verification failed. Contact support.");
          }
        },
        prefill: {
          name: "Ajmera Paints",
          email: "ajmerapaintsksg@example.com",
          contact: "9837140458",
        },
        theme: { color: "#3399cc" },
      };

      console.log("🟡 Opening Razorpay with options:", options);
      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        console.error("❌ Payment failed:", response.error);
        alert(`Payment failed: ${response.error.description}`);
      });

      rzp.open();
      console.log("✅ Razorpay modal should be open now");
    } catch (error) {
      console.error("❌ handlePayment error:", error);
      console.error("Error response:", error.response?.data);
      alert(`Error: ${error.message}`);
    }
  };
  // console.log("my cart", cart);
  return (
    <>
      <div className="container  my-3">
        <h1 className="text-center">Order Summary</h1>

        <table className="table table-bordered border-primary bg-dark">
          <thead className="bg-dark">
            <tr>
              <th scope="col" className="bg-dark text-light text-center">
                Product Details
              </th>

              <th scope="col" className="bg-dark text-light text-center">
                Shipping Address
              </th>
            </tr>
          </thead>
          <tbody className="bg-dark">
            <tr>
              <td className="bg-dark text-light">
                <TableProduct cart={cart} />
              </td>
              <td className="bg-dark text-light">
                <ul style={{ fontWeight: "bold" }}>
                  <li>Name : {userAddress?.fullName}</li>
                  <li>Phone : {userAddress?.phoneNumber}</li>
                  <li>Country : {userAddress?.country}</li>
                  <li>State : {userAddress?.state}</li>
                  <li>PinCode : {userAddress?.pincode}</li>
                  <li>Near By : {userAddress?.address}</li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="container text-center my-5">
        <button
          className="btn btn-secondary btn-lg"
          style={{ fontWeight: "bold" }}
          onClick={handlePayment}
        >
          Procced To Pay
        </button>
      </div>
    </>
  );
};

export default Checkout;
