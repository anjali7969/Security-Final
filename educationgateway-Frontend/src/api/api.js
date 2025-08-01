import axios from 'axios';

//  Backend API Base URL
const API_BASE_URL = "https://localhost:5003";  // Change this when deploying

//  Axios Instance for API Calls
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,  // Allows sending cookies if needed
    headers: { 'Content-Type': 'application/json' },
});

// ✅ Attach Token to Requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

//  Register User Function
export const registerUser = async (userData) => {
  try {
    console.log("📤 Sending request to:", `${API_BASE_URL}/auth/register`);
    console.log("📝 Data being sent:", userData);

    // ✅ Fetch CSRF token before sending protected request
    const csrfRes = await api.get("/get-csrf-token");
    const csrfToken = csrfRes.data.csrfToken;

    // ✅ Include CSRF token in headers
    const response = await api.post("/auth/register", userData, {
      headers: {
        "CSRF-Token": csrfToken,
      }
    });

    // ✅ Store token if available
    console.log("✅ Response received:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Registration Error:", error.response?.data || error.message);
    throw error;
  }
};


// ✅ Login User Function
export const loginUser = async (userData) => {
    try {
        console.log("📤 Sending login request to:", `${API_BASE_URL}/auth/login`);
        console.log("📝 Data being sent:", userData);

        const response = await api.post("/auth/login", userData);

        if (response.data.token) {
            localStorage.setItem("authToken", response.data.token);
        }

        console.log("✅ Login Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Login Error:", error.response?.data || error.message);
        throw error;
    }
}; // ✅ Logout User Function

// ✅ Get All Users
export const getAllUsers = async () => {
    try {
        const token = localStorage.getItem("authToken");
        console.log("Sending request to fetch users with token:", token);

        const response = await api.get("/user/all", {
            headers: { Authorization: `Bearer ${token}` },
        });

        console.log("✅ Users received:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error Fetching Users:", error.response?.data || error.message);
        throw error;
    }
};

export const updateUser = async (userId, updatedData) => {
    const token = localStorage.getItem("authToken");
    const response = await api.put(`/user/update/${userId}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const deleteUser = async (userId) => {
    const token = localStorage.getItem("authToken");
    await api.delete(`/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};



// ✅ Create a New Course
export const createCourse = async (courseData) => {
    try {
        const token = localStorage.getItem("authToken");

        console.log("🔍 Sending Course Data:", courseData);

        const response = await api.post("/courses/create", courseData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });

        console.log("✅ Course Created:", response.data);
        return response.data.course;
    } catch (error) {
        console.error("❌ Course Creation Error:", error.response?.data || error.message);
        throw error;
    }
};

// ✅ Get Courses from Backend
export const getCourses = async () => {
    try {
        const response = await api.get("/courses/all");
        return response.data;
    } catch (error) {
        console.error("❌ Error Fetching Courses:", error.response?.data || error.message);
        throw error;
    }
};

// ✅ Update Course (NEW FUNCTION)

export const updateCourse = async (courseId, updatedData, csrfToken) => {
    try {
        const token = localStorage.getItem("authToken");

        console.log("🔄 Updating Course:", updatedData); // ✅ Debug Log

        const response = await api.put(
            `/courses/update/${courseId}`,
            updatedData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    ...(csrfToken && { "csrf-token": csrfToken }) // ✅ Optional CSRF token
                },
                withCredentials: true // ✅ Ensure cookies (if needed)
            }
        );

        console.log("✅ Course Updated:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error Updating Course:", error.response?.data || error.message);
        throw error;
    }
};



// ✅ Delete Course
export const deleteCourse = async (id) => {
    try {
        const response = await fetch(`https://localhost:5003/courses/delete/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete course");

        console.log("✅ Course deleted successfully");
    } catch (error) {
        console.error("❌ Error deleting course:", error);
    }
};


export const getWishlist = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("authToken");

    if (!storedUser || !storedUser._id || !token) {
        console.warn("🚨 User ID or token is missing. Cannot fetch wishlist.");
        return;
    }

    console.log("✅ Fetching wishlist for User ID:", storedUser._id);

    try {
        const response = await api.get(`/wishlist/${storedUser._id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching wishlist:", error);
        throw error;
    }
};


export const addToWishlist = async (courseId) => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("authToken");

    if (!storedUser || !storedUser._id || !token) {
        console.warn("🚨 User ID or token is missing. Cannot add to wishlist.");
        return;
    }

    console.log("✅ Adding course to wishlist for User ID:", storedUser._id);

    try {
        const response = await api.post(`/wishlist/add`, { userId: storedUser._id, courseId }, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("❌ Error adding to wishlist:", error);
        throw error;
    }
};


export const removeFromWishlist = async (userId, courseId) => {
    try {
        const response = await axios.delete(`https://localhost:5003/wishlist/remove`, {
            data: { userId, courseId }, // Ensure correct format for DELETE request
        });

        return response.data;
    } catch (error) {
        console.error("❌ Error removing from wishlist:", error.response?.data || error);
        throw error;
    }
};

// export const getUserOrders = async (userId) => {
//     try {
//         const token = localStorage.getItem("authToken");
//         const response = await api.get(`/checkout/user-orders/${userId}`, {
//             headers: { Authorization: `Bearer ${token}` },
//         });

//         console.log("✅ Fetched user orders:", response.data);
//         return response.data;
//     } catch (error) {
//         console.error("❌ Error fetching orders:", error.response?.data || error.message);
//         throw error;
//     }
// };

// ✅ Get All Orders
export const getAllOrders = async () => {
    try {
        console.log("📤 Fetching all orders...");
        const response = await api.get("/order/all-orders"); // ✅ Use "API" not "api"
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching orders:", error?.response?.data || error.message);
        throw error;
    }
};

// ✅ Update Order Status
export const updateOrderStatus = async (orderId, newStatus) => {
    try {
        const token = localStorage.getItem("authToken");

        // ✅ Get CSRF token
        const csrfRes = await api.get("/get-csrf-token");
        const csrfToken = csrfRes.data.csrfToken;

        console.log(`📦 Updating order ${orderId} to ${newStatus}`);

        const response = await api.put(
            `/order/update/${orderId}`,
            { status: newStatus },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "CSRF-Token": csrfToken,
                },
                withCredentials: true,
            }
        );

        return response.data;
    } catch (error) {
        console.error("❌ Error updating status:", error?.response?.data || error.message);
        throw error;
    }
};


// ✅ Delete Order
export const deleteOrder = async (orderId) => {
    try {
        const token = localStorage.getItem("authToken");

        // ✅ Get fresh CSRF token
        const csrfRes = await api.get("/get-csrf-token");
        const csrfToken = csrfRes.data.csrfToken;

        const response = await api.delete(`/order/delete/${orderId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "CSRF-Token": csrfToken,
            },
            withCredentials: true,
        });

        console.log("✅ Order Deleted Successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error Deleting Order:", error?.response?.data || error.message);
        throw error;
    }
};


// ✅ Get All Enrollments
export const getAllEnrollments = async () => {
    try {
        console.log("📤 Fetching all enrollments...");
        const response = await api.get("/enrollment/all");  // ✅ API Call
        console.log("✅ Enrollments received:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching enrollments:", error.response?.data || error.message);
        throw error;
    }
};

// ✅ Update User Profile (Name, Email)
export const updateUserProfile = async (userId, updatedData) => {
    try {
        const response = await api.put(`/user/update/${userId}`, updatedData);
        console.log("✅ Profile Updated:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error updating profile:", error.response?.data || error.message);
        throw error;
    }
};

// ✅ Change User Password
export const changeUserPassword = async (userId, newPassword) => {
    try {
        const response = await api.put(`/user/change-password/${userId}`, { password: newPassword });
        console.log("✅ Password Updated:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error changing password:", error.response?.data || error.message);
        throw error;
    }
};


// ✅ Fetch Dashboard Statistics for Admin Panel
// export const getDashboardStats = async () => {
//     try {
//         console.log("📤 Fetching dashboard statistics...");
//         const response = await api.get("/admin/dashboard-stats");
//         console.log("✅ Dashboard Stats Received:", response.data);
//         return response.data;
//     } catch (error) {
//         console.error("❌ Error fetching dashboard stats:", error.response?.data || error.message);
//         throw error;
//     }
// };


// ✅ Get User Orders by ID
// export const getUserOrders = async (userId) => {
//     try {
//         const token = localStorage.getItem("authToken");
//         const response = await api.get(`/checkout/user-orders/${userId}`, {
//             headers: { Authorization: `Bearer ${token}` },
//         });

//         console.log("✅ Fetched user orders:", response.data);
//         return response.data;
//     } catch (error) {
//         console.error("❌ Error fetching orders:", error.response?.data || error.message);
//         throw error;
//     }
// };









export default api;
