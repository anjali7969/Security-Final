import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../components/Footer"; // ✅ Import Footer
import Navbar from "../components/NavBar"; // ✅ Import Navbar

// ✅ CSRF Support
import axios from "../api/axiosInstance";

const ShoppingCart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [showOrderPopup, setShowOrderPopup] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);

    // ✅ Fetch CSRF token once on load
    axios
      .get("/get-csrf-token", { withCredentials: true })
      .then((res) => {
        localStorage.setItem("csrfToken", res.data.csrfToken);
      })
      .catch((err) => {
        console.error("❌ CSRF Token fetch failed", err);
      });
  }, []);

  const handleConfirmOrder = async () => {
    if (cart.length === 0) {
      toast.info("Cart cannot be empty.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user._id) {
      toast.info("You need to log in to place an order.");
      return;
    }

    if (!phoneNumber) {
      toast.info("Please fill in all shipping details.");
      return;
    }

    const orderData = {
      userId: user._id,
      cart: cart.map((item) => ({
        courseId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      totalAmount: cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
      paymentMethod: "Card Payment",
      phoneNumber,
    };

    try {
      setIsProcessing(true);
      const response = await axios.post(
        "http://localhost:5003/order/confirm",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "csrf-token": localStorage.getItem("csrfToken"),
          },
          withCredentials: true,
        }
      );

      toast.success("🎉 Your order has been placed successfully!");
      setOrderConfirmed(true);
      setShowOrderPopup(false);
      setTimeout(() => {
        setCart([]);
        localStorage.removeItem("cart");
        window.dispatchEvent(new Event("storage"));
      }, 500);
    } catch (error) {
      console.error("❌ Order confirm failed:", error);
      toast.error(error.response?.data?.message || "Failed to place the order.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelOrder = () => {
    setShowCancelPopup(false);
    setCart([]);
    localStorage.removeItem("cart");
    window.dispatchEvent(new Event("storage"));
    toast.success("Your order has been canceled.");
  };

  const increaseQuantity = (id) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const decreaseQuantity = (id) => {
    const updatedCart = cart
      .map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const getTotalPrice = () => {
    return cart.reduce(
      (total, item) => total + (item.price ? item.price * item.quantity : 0),
      0
    );
  };

  return (
    <>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />

      <section className="bg-gray-50 pt-36 pb-10 min-h-screen">
        <div className="w-full max-w-7xl px-6 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Order Summary
            </h2>

            {cart.length > 0 ? (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-5 p-5 border rounded-lg shadow-sm bg-white mb-4"
                >
                  <div className="w-full md:max-w-[126px]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="mx-auto rounded-xl object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-gray-900">
                      {item.name}
                    </p>
                  </div>

                  <div className="flex items-center">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="px-3 py-2 border rounded-l-md bg-gray-200 hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="px-4 py-2">{item.quantity}</span>
                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="px-3 py-2 border rounded-r-md bg-gray-200 hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 mt-6">
                Your cart is empty.
              </p>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center pb-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                Shopping Cart
              </h2>
              <span className="text-blue-600 font-bold">{cart.length} Items</span>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-900 text-lg mt-2">
                <span>Total</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <input
                type="text"
                placeholder="Phone Number"
                className="w-full px-4 py-2 border rounded-lg text-gray-900 bg-transparent placeholder-gray-500 focus:ring-2 focus:ring-gray-300"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

            <div className="mt-6 space-y-2">
              <p className="text-lg font-semibold text-gray-900">Payment</p>
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="payment"
                  className="h-5 w-5 text-indigo-600 focus:ring-indigo-500"
                  defaultChecked
                />
                <span className="text-gray-700">Card Payment</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="payment"
                  className="h-5 w-5 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-gray-700">PayPal Payment</span>
              </label>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                className="py-3 px-6 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                onClick={() => setShowCancelPopup(true)}
              >
                Cancel
              </button>
              <button
                className="py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => setShowOrderPopup(true)}
              >
                Order
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {showOrderPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold text-gray-800">Confirm Your Order</h2>
            <p className="text-gray-600 mt-2">
              Are you sure you want to place this order?
            </p>
            <div className="mt-4 flex justify-center space-x-4">
              <button
                onClick={() => setShowOrderPopup(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmOrder}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {orderConfirmed && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold text-green-600">Order Confirmed!</h2>
            <p className="text-gray-600 mt-2">
              Thank you for your purchase! Your order has been placed successfully.
            </p>
            <button
              onClick={() => setOrderConfirmed(false)}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showCancelPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold text-red-600">Cancel Order</h2>
            <p className="text-gray-600 mt-2">
              Are you sure you want to cancel your order?
            </p>
            <div className="mt-4 flex justify-center space-x-4">
              <button
                onClick={() => setShowCancelPopup(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
              >
                No, Keep It
              </button>
              <button
                onClick={handleCancelOrder}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShoppingCart;
