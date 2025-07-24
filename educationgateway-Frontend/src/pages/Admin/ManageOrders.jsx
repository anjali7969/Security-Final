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
import { FiCheck, FiClock, FiDollarSign, FiPackage, FiShoppingCart, FiTrash2, FiTruck } from "react-icons/fi";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { deleteOrder, getAllOrders, updateOrderStatus } from "../../api/api";
import axios from "../../api/axiosInstance"; // ✅ Import axios instance for CSRF

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [csrfToken, setCsrfToken] = useState(""); // ✅ CSRF token state
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ordersRes, csrfRes] = await Promise.all([
                    getAllOrders(),
                    axios.get("/get-csrf-token", { withCredentials: true }),
                ]);
                setOrders(ordersRes || []);
                setCsrfToken(csrfRes.data.csrfToken);
            } catch (error) {
                console.error("Error fetching data or CSRF:", error);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleUpdateStatus = async (orderId, newStatus) => {
    try {
        await updateOrderStatus(orderId, newStatus); // ✅ API call handles token
        setOrders((prev) =>
            prev.map((order) =>
                order._id === orderId ? { ...order, status: newStatus } : order
            )
        );
    } catch (error) {
        console.error("Error updating status:", error);
    }
};

const handleDeleteOrder = async (orderId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this order?");
    if (!confirmDelete) return;

    try {
        await deleteOrder(orderId); // ✅ API call handles token
        setOrders((prev) => prev.filter((order) => order._id !== orderId));
        alert("Order deleted successfully!");
    } catch (error) {
        console.error("Error deleting order:", error);
        alert("Failed to delete the order. Please try again.");
    }
};


    const getStatusIcon = (status) => {
        switch (status) {
            case "pending":
                return <FiClock className="w-4 h-4" />;
            case "confirmed":
                return <FiCheck className="w-4 h-4" />;
            case "shipped":
                return <FiTruck className="w-4 h-4" />;
            default:
                return <FiClock className="w-4 h-4" />;
        }
    };

    const getStatusBadge = (status) => {
        const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium gap-1";
        switch (status) {
            case "pending":
                return `${baseClasses} bg-yellow-100 text-yellow-800`;
            case "confirmed":
                return `${baseClasses} bg-blue-100 text-blue-800`;
            case "shipped":
                return `${baseClasses} bg-green-100 text-green-800`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800`;
        }
    };

    const getOrderStats = () => {
        const totalOrders = orders.length;
        const pendingOrders = orders.filter(order => order.status === "pending").length;
        const confirmedOrders = orders.filter(order => order.status === "confirmed").length;
        const shippedOrders = orders.filter(order => order.status === "shipped").length;
        const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        return { totalOrders, pendingOrders, confirmedOrders, shippedOrders, totalRevenue };
    };

    const { totalOrders, pendingOrders, confirmedOrders, shippedOrders, totalRevenue } = getOrderStats();

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <ToastContainer 
                position="top-right" 
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                className="mt-16"
            />

            {/* Header Section */}
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <FiShoppingCart className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
                            <p className="text-gray-600">Track and manage customer orders</p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    {!loading && orders.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Orders</p>
                                        <p className="text-3xl font-bold text-gray-900">{totalOrders}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                                        <FiPackage className="w-6 h-6 text-indigo-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Pending</p>
                                        <p className="text-3xl font-bold text-yellow-600">{pendingOrders}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                        <FiClock className="w-6 h-6 text-yellow-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Confirmed</p>
                                        <p className="text-3xl font-bold text-blue-600">{confirmedOrders}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <FiCheck className="w-6 h-6 text-blue-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Shipped</p>
                                        <p className="text-3xl font-bold text-green-600">{shippedOrders}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                        <FiTruck className="w-6 h-6 text-green-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                                        <p className="text-3xl font-bold text-emerald-600">${totalRevenue}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                                        <FiDollarSign className="w-6 h-6 text-emerald-600" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="flex items-center space-x-3">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                <span className="text-gray-600 font-medium">Loading orders...</span>
                            </div>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                    <FiShoppingCart className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                                <p className="text-gray-500">No customer orders have been placed yet</p>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-hidden">
                            {/* Table Header */}
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                            <div className="grid grid-cols-10 gap-4 items-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                <div className="col-span-3">Order Details</div>
                                <div className="col-span-2">Customer</div>
                                <div className="col-span-1">Total</div>
                                <div className="col-span-2">Status</div>
                                <div className="col-span-2">Actions</div>
                            </div>
                            </div>

                            {/* Table Body */}
                            
                        <div className="divide-y divide-gray-200">
                        {orders.map((order) => (
                            <div key={order._id} className="px-6 py-6 hover:bg-gray-50 transition-colors duration-150">
                            <div className="grid grid-cols-10 gap-4 items-center">

                                {/* Order Details */}
                                <div className="col-span-3">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                    <FiPackage className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div>
                                    <h3 className="text-sm font-semibold text-gray-900">#{order._id.slice(-8)}</h3>
                                    <p className="text-xs text-gray-500">Order ID</p>
                                    </div>
                                </div>
                                </div>

                                {/* Customer */}
                                <div className="col-span-2">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                    {(order.user?.name || "U").charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                    <p className="text-sm font-medium text-gray-900">{order.user?.name || "Unknown"}</p>
                                    <p className="text-xs text-gray-500">Customer</p>
                                    </div>
                                </div>
                                </div>

                                {/* Total */}
                                <div className="col-span-1">
                                <div className="flex items-center space-x-1">
                                    <FiDollarSign className="w-4 h-4 text-emerald-600" />
                                    <span className="text-lg font-bold text-emerald-600">{order.totalAmount}</span>
                                </div>
                                </div>

                                {/* Status */}
                                <div className="col-span-2 flex flex-col justify-start gap-1">
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-150"
                                    value={order.status}
                                    onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="shipped">Shipped</option>
                                </select>
                                <span className={getStatusBadge(order.status)}>
                                    {getStatusIcon(order.status)}
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                                </div>

                                {/* Actions */}
                                <div className="col-span-2">
                                <button
                                    onClick={() => handleDeleteOrder(order._id)}
                                    className="inline-flex items-center px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-colors duration-150 text-sm font-medium"
                                >
                                    <FiTrash2 className="w-4 h-4 mr-2" />
                                    Cancel Order
                                </button>
                                </div>
                            </div>
                            </div>
                        ))}
                        </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageOrders;




