import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Checkout = () => {
    const { orderId } = useParams(); // Get orderId from the URL
    const [orderDetails, setOrderDetails] = useState(null);
    const [csrfToken, setCsrfToken] = useState(""); // ✅ CSRF Token

    // ✅ Fetch CSRF token on mount
    useEffect(() => {
        const fetchCsrf = async () => {
            try {
                const res = await fetch("https://localhost:5003/get-csrf-token", {
                    credentials: "include"
                });
                const data = await res.json();
                setCsrfToken(data.csrfToken);
            } catch (error) {
                console.error("❌ CSRF fetch failed:", error.message);
            }
        };

        fetchCsrf();
    }, []);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await fetch(`https://localhost:5003/checkout/user-orders/${orderId}`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
                        "csrf-token": csrfToken // ✅ Include CSRF token
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    setOrderDetails(data);
                    console.log("✅ Fetched order details:", data);
                } else {
                    console.error("❌ Error fetching order:", data.message);
                }
            } catch (error) {
                console.error("❌ Fetch error:", error.message);
            }
        };

        if (orderId && csrfToken) fetchOrderDetails();
    }, [orderId, csrfToken]);

    if (!orderDetails) return <p>Loading...</p>;

    return (
        <div className="container mx-auto p-8">
            <h2 className="text-2xl font-bold">Checkout for {orderDetails.course.title}</h2>
            <p className="text-lg">Price: ${orderDetails.course.price}</p>
            <p>Status: {orderDetails.status}</p>
            <button className="mt-4 bg-green-500 text-white px-6 py-2 rounded">
                Proceed to Payment
            </button>
        </div>
    );
};

export default Checkout;
