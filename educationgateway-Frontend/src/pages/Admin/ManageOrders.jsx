// import axios from "axios";
// import { useEffect, useState } from "react";
// import { getAllOrders } from "../../api/api"; // ✅ Adjust the path as needed


// const ManageOrders = () => {
//     const [orders, setOrders] = useState([]);


//     // useEffect(() => {
//     //     const fetchOrders = async () => {
//     //         try {
//     //             const data = await getAllOrders();
//     //             setOrders(data || []);  // ✅ Ensure it's always an array
//     //         } catch (error) {
//     //             console.error("Error fetching orders:", error);
//     //             setOrders([]);  // Prevent errors by setting an empty array
//     //         }
//     //     };
//     //     fetchOrders();
//     // }, []);

//     useEffect(() => {
//         const fetchOrders = async () => {
//             try {
//                 const data = await getAllOrders();
//                 console.log("Fetched Orders:", data); // ✅ Debugging
//                 setOrders(data || []);
//             } catch (error) {
//                 console.error("Error fetching orders:", error);
//                 setOrders([]);
//             }
//         };
//         fetchOrders();
//     }, []);




//     const updateStatus = async (orderId, newStatus) => {
//         try {
//             await axios.put(`/order/update/${orderId}`, { status: newStatus });
//             setOrders((prevOrders) =>
//                 prevOrders.map((order) =>
//                     order._id === orderId ? { ...order, status: newStatus } : order
//                 )
//             );
//         } catch (error) {
//             console.error("Error updating status:", error);
//         }
//     };

//     const deleteOrder = async (orderId) => {
//         try {
//             await axios.delete(`/order/delete/${orderId}`);
//             setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
//         } catch (error) {
//             console.error("Error deleting order:", error);
//         }
//     };

//     return (
//         <div className="p-6">
//             <h2 className="text-2xl font-semibold text-black mb-4">Manage Orders</h2>
//             <div className="overflow-x-auto">
//                 <table className="min-w-full bg-transparent border border-gray-300 rounded-lg shadow-md">
//                     <thead>
//                         <tr className="bg-gray-100 text-black">
//                             <th className="py-3 px-6 text-left border-b">Order ID</th>
//                             <th className="py-3 px-6 text-left border-b">User</th>
//                             <th className="py-3 px-6 text-left border-b">Total</th>
//                             <th className="py-3 px-6 text-left border-b">Shipping Address</th>
//                             <th className="py-3 px-6 text-left border-b">Status</th>
//                             <th className="py-3 px-6 text-left border-b">Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {Array.isArray(orders) && orders.length > 0 ? (
//                             orders.map((order) => (
//                                 <tr key={order._id} className="border-b text-gray-800">
//                                     <td className="py-3 px-6">{order._id}</td>
//                                     <td className="py-3 px-6">{order.user?.name || "Unknown"}</td>
//                                     <td className="py-3 px-6">${order.total}</td>
//                                     <td className="py-3 px-6">{order.Address}</td>
//                                     <td className="py-3 px-6">
//                                         <select
//                                             className="border bg-gray-200 rounded px-2 py-1"
//                                             value={order.status}
//                                             onChange={(e) => updateStatus(order._id, e.target.value)}
//                                         >
//                                             <option value="Pending">Pending</option>
//                                             <option value="Confirmed">Confirmed</option>
//                                             <option value="Shipped">Shipped</option>
//                                         </select>
//                                     </td>
//                                     <td className="py-3 px-6">
//                                         <button
//                                             className="bg-red-500 text-white px-4 py-1 rounded"
//                                             onClick={() => deleteOrder(order._id)}
//                                         >
//                                             Cancel Order
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td colSpan="6" className="text-center py-4 text-gray-500">
//                                     No orders found.
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>

//                 </table>
//             </div>
//         </div>
//     );
// };

// export default ManageOrders;


import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { deleteOrder, getAllOrders, updateOrderStatus } from "../../api/api"; // ✅ Correct import

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getAllOrders();
                console.log("Fetched Orders:", data); // ✅ Debugging
                setOrders(data || []);
            } catch (error) {
                console.error("Error fetching orders:", error);
                setOrders([]); // Prevent errors by setting an empty array
            }
        };
        fetchOrders();
    }, []);

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus); // ✅ Fixed function call
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === orderId ? { ...order, status: newStatus } : order
                )
            );
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleDeleteOrder = async (orderId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this order?");

        if (confirmDelete) {
            try {
                await deleteOrder(orderId);
                setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
                alert("Order deleted successfully!"); // ✅ Alert after successful deletion
            } catch (error) {
                console.error("Error deleting order:", error);
                alert("Failed to delete the order. Please try again."); // ✅ Error alert
            }
        }
    };


    return (
        <div className="p-6">
            <ToastContainer position="top-right" autoClose={3000} />

            <h2 className="text-2xl font-semibold  text-black mb-4">Manage Orders</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300 rounded-lg shadow-md">
                    <thead>
                        <tr className="bg-gray-200 text-black">
                            <th className="py-3 px-6 text-left border-b">Order ID</th>
                            <th className="py-3 px-6 text-left border-b">User</th>
                            <th className="py-3 px-6 text-left border-b">Total</th>
                            <th className="py-3 px-6 text-left border-b">Shipping Address</th>
                            <th className="py-3 px-6 text-left border-b">Status</th>
                            <th className="py-3 px-6 text-left border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(orders) && orders.length > 0 ? (
                            orders.map((order) => (
                                <tr key={order._id} className="border-collapse border text-gray-800">
                                    <td className="py-3 px-6">{order._id}</td>
                                    <td className="py-3 px-6">{order.user?.name || "Unknown"}</td>
                                    <td className="py-3 px-6">${order.totalAmount}</td> {/* ✅ Fixed totalAmount */}
                                    <td className="py-3 px-6">{order.address}</td> {/* ✅ Fixed address field */}
                                    <td className="py-3 px-6">
                                        <select
                                            className="border bg-gray-200 rounded px-2 py-1"
                                            value={order.status}
                                            onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="shipped">Shipped</option>
                                        </select>
                                    </td>
                                    <td className="py-3 px-6">
                                        <button
                                            className="bg-red-500 text-white px-4 py-1 rounded"
                                            onClick={() => handleDeleteOrder(order._id)}
                                        >
                                            Cancel Order
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-4 text-gray-500">
                                    No orders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageOrders;



