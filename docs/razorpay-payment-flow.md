# Razorpay Frontend Payment Flow

This document explains how the frontend triggers and verifies Razorpay payments for customer checkout.

## 1. Main frontend files

- [frontend/src/Pages/Customer/Payments/PaymentButton.jsx](../src/Pages/Customer/Payments/PaymentButton.jsx)  
  Handles the payment button click, creates the Razorpay order, opens the payment modal, and verifies the payment response.

- [frontend/src/Pages/Customer/Cart/CustomerCart.jsx](../src/Pages/Customer/Cart/CustomerCart.jsx)  
  Passes the checkout values to the payment button (`amount`, `addressId`, and coupon data).

- [frontend/src/api/axiosConfig.jsx](../src/api/axiosConfig.jsx)  
  Configures Axios with the backend base URL and adds the JWT token to requests.

## 2. Backend endpoints used

The frontend calls these endpoints:

- `POST /payment/create-order`
  - Request body:
    ```json
    {
      "amount": 500
    }
    ```
  - Response from backend:
    ```json
    {
      "id": "order_xxx",
      "amount": 50000,
      "currency": "INR"
    }
    ```

- `POST /payment/verify-payment`
  - Request body after Razorpay success:
    ```json
    {
      "razorpay_order_id": "order_xxx",
      "razorpay_payment_id": "pay_xxx",
      "razorpay_signature": "signature",
      "amount": 500,
      "addressId": "address_id",
      "coupon_id": "coupon_id"
    }
    ```

## 3. Payment flow

1. The cart page gets the total payable amount and selected address.
2. The `PaymentButton` component is rendered.
3. On click:
   - A request is sent to `/payment/create-order`.
   - The backend returns Razorpay order details.
   - A Razorpay checkout modal is opened.
4. After the user completes payment:
   - Razorpay calls the `handler` callback.
   - The frontend sends the payment response to `/payment/verify-payment`.
   - If verification succeeds, the user is redirected to the order list page.

## 4. Required frontend values

Before the payment starts, the UI should ensure:

- `amount` is a valid number.
- `addressId` exists.
- The user is logged in so the auth token is attached automatically.
- `VITE_RAZORPAY_KEY_ID` is available in the frontend environment.

## 5. Environment setup

Add the Razorpay public key in the frontend `.env` file:

```env
VITE_RAZORPAY_KEY_ID=your_public_key_here
```

## 6. Important frontend behavior

- The payment modal is opened using `new window.Razorpay(options)`.
- Success handling is done inside the `handler` callback.
- If Razorpay fails or verification fails, an error snackbar is shown.
- After successful verification, the user is sent to the order page.

## 7. Notes

- The frontend uses the shared Axios instance from [frontend/src/api/axiosConfig.jsx](../src/api/axiosConfig.jsx).
- All requests automatically include the JWT token from local storage.
- The final order is created only after the backend verifies the payment signature.
