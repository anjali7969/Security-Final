import { useEffect, useState } from "react";
import { FaBook, FaCheckCircle, FaHeart, FaListAlt, FaTimes } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom"; // ✅ Add useParams
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles
import { getCourses, getWishlist } from "../../api/api"; // ✅ Import API call
import profileImage from "../../assets/images/profile-picture.jpg";



import Footer from "../../components/Footer";
import Navbar from "../../components/NavBar";

const StudentDashboard = ({ user }) => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("dashboard"); // Controls which section is visible
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("latest");
    const [statusFilter, setStatusFilter] = useState("all");
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [wishlistCourses, setWishlistCourses] = useState([]);
    const [isEnrolled, setIsEnrolled] = useState(false);





    const openCourseModal = (course) => {
        setSelectedCourse(course);
        setIsModalOpen(true);
    };

    // Function to close modal
    const closeCourseModal = () => {
        setSelectedCourse(null);
    };

    const [cartCount, setCartCount] = useState(() => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        return cart.length; // Set initial cart count
    });

    const handleEnroll = async (courseId) => {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("authToken");
        const csrfToken = localStorage.getItem("csrfToken"); // ✅ Get CSRF token from localStorage

        if (!user || !user._id) {
            toast.error("Please log in to enroll in a course!");
            return;
        }

        // ✅ Step 1: Check Enrollment Status
        const checkResponse = await fetch(`http://localhost:5003/courses/enrollment/check/${user._id}/${courseId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "X-CSRF-Token": csrfToken // ✅ CSRF Token here too
            }
        });

        const checkData = await checkResponse.json();

        if (checkData.enrolled) {
            toast.info("Already Enrolled in this Course!");

            // ✅ Step 2: Fetch Course Details & Update Cart
            const courseResponse = await fetch(`http://localhost:5003/courses/${courseId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "X-CSRF-Token": csrfToken
                }
            });

            const courseData = await courseResponse.json();

            let cart = JSON.parse(localStorage.getItem("cart")) || [];

            const isCourseInCart = cart.some(item => item.id === courseId);
            if (!isCourseInCart) {
                cart.push({
                    id: courseId,
                    name: courseData.title,
                    price: courseData.price,
                    image: courseData.image
                        ? `http://localhost:5003${courseData.image.startsWith("/") ? courseData.image : "/" + courseData.image}`
                        : "/default-image.jpg",
                    quantity: 1
                });

                localStorage.setItem("cart", JSON.stringify(cart));
                setCartCount(cart.length);
                window.dispatchEvent(new Event("storage"));
                console.log("🛒 Course added to cart:", courseData.title);
            }
            return;
        }

        const response = await fetch(`http://localhost:5003/courses/${courseId}/enroll`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-CSRF-Token": csrfToken
    },
    credentials: "include" // ✅ VERY IMPORTANT
});


        const data = await response.json();

        if (!response.ok) {
            toast.error(`Enrollment Failed: ${data.message}`);
            return;
        }

        console.log("✅ Enrollment Successful:", data);

        // ✅ Step 4: Add to Cart After Enrollment
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        const isCourseInCart = cart.some(item => item.id === courseId);
        if (!isCourseInCart) {
            cart.push({
                id: courseId,
                name: data.enrollment.title,
                price: data.enrollment.price,
                image: `http://localhost:5003${data.enrollment.image.startsWith("/") ? data.enrollment.image : "/" + data.enrollment.image}`,
                quantity: 1
            });

            localStorage.setItem("cart", JSON.stringify(cart));
            setCartCount(cart.length);
            window.dispatchEvent(new Event("storage"));
            console.log("🛒 Course added to cart:", data.enrollment.title);
        }

        toast.success("Enrollment Successful! 🎉");

    } catch (error) {
        console.error("❌ Error during enrollment:", error);
    }
};





    const handleRemoveFromWishlist = async (course) => {
        try {
            const storedUser = JSON.parse(localStorage.getItem("user"));
            if (!storedUser) return alert("Please login to use wishlist.");

            // ✅ API Call to Remove from Wishlist
            await removeFromWishlist(storedUser._id, course._id);

            // ✅ Update Local State to Remove the Course
            setWishlistCourses((prevWishlist) =>
                prevWishlist.filter((item) => item._id !== course._id)
            );

            // ✅ Remove from Courses List as well (to remove red heart)
            setCourses((prevCourses) =>
                prevCourses.map((c) =>
                    c._id === course._id ? { ...c, inWishlist: false } : c
                )
            );
        } catch (error) {
            console.error("Error removing from wishlist:", error);
        }
    };

    const handleAddToCart = (course) => {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        // Check if course is already in cart
        const isCourseInCart = cart.some(item => item.id === course._id);

        if (!isCourseInCart) {
            cart.push({
                id: course._id,
                name: course.title,
                price: course.price,
                quantity: 1
            });

            localStorage.setItem("cart", JSON.stringify(cart)); // Save cart to localStorage
            toast.success("Course added to cart! 🛒");
        } else {
            toast.info("Course is already in the cart!");
        }

        // Trigger event to update navbar cart count
        window.dispatchEvent(new Event("storage"));
    };


    // // ✅ Add to Cart Function
    // const handleAddToCart = (course) => {
    //     // Navigate to Cart Page with Selected Course
    //     navigate("/cart", { state: { course } });
    // };

    const handleWishlistClick = async (course) => {
        try {
            const storedUser = JSON.parse(localStorage.getItem("user"));
            const token = localStorage.getItem("authToken");

            if (!storedUser || !storedUser._id || !token) {
                toast.error("Please log in to manage your wishlist.");
                return;
            }

            const isCourseInWishlist = wishlistCourses.some((item) => item._id === course._id);

            if (isCourseInWishlist) {
                console.log("🚀 Removing from wishlist:", course._id);

                // ✅ Remove from Wishlist API Call
                await fetch(`http://localhost:5003/wishlist/remove/${storedUser._id}/${course._id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                });

                // ✅ Update Local State
                setWishlistCourses((prevWishlist) =>
                    prevWishlist.filter((item) => item._id !== course._id)
                );
            } else {
                console.log("📌 Adding to wishlist:", course._id);
                toast.info("Adding to Wishlist...");

                // ✅ Add to Wishlist API Call
                const response = await fetch("http://localhost:5003/wishlist/add", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ userId: storedUser._id, courseId: course._id }),
                });

                const data = await response.json();

                if (!data.success) {
                    console.warn("⚠️ Wishlist API responded with an error:", data.message);
                    return;
                }

                // ✅ Update Local State with New Wishlist
                setWishlistCourses([...wishlistCourses, course]);
            }

            // ✅ Refresh wishlist
            fetchWishlist();

        } catch (error) {
            console.error("❌ Error updating wishlist:", error);
        }
    };





    useEffect(() => {
    const checkEnrollmentStatus = async () => {
        if (!user || !user._id) return;

        const csrfToken = localStorage.getItem("csrfToken"); // ✅ Get CSRF token

        const response = await fetch(`http://localhost:5003/enrollment/check/${user._id}/${courseId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                "X-CSRF-Token": csrfToken // ✅ Add CSRF token header
            }
        });

        const data = await response.json();
        setIsEnrolled(data.enrolled);
    };

    checkEnrollmentStatus();
}, [courseId]);


    // 🚀 Redirect Admins to /admin instead of Student Dashboard
    // useEffect(() => {
    //     const storedUser = JSON.parse(localStorage.getItem("user"));
    //     if (!storedUser) {
    //         navigate("/login"); // Redirect if no user is logged in
    //     } else if (storedUser.role === "Admin") {
    //         navigate("/admin"); // Prevent Admins from seeing student dashboard
    //     }
    // }, [navigate]);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const authToken = localStorage.getItem("authToken");

        console.log("🔍 Checking stored user:", storedUser);
        console.log("🔍 Checking auth token:", authToken);

        if (!storedUser || !storedUser._id || !authToken) {
            console.warn("🚨 User ID or token is missing. Cannot fetch wishlist.");
            return;
        }

        getWishlist(storedUser._id);
    }, []);


    // ✅ Fetch Courses from Backend
    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const fetchedCourses = await getCourses();
            setCourses(fetchedCourses);
        } catch (error) {
            setError("Failed to fetch courses. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Fetch Wishlist on Component Load
    const fetchWishlist = async () => {
        try {
            const storedUser = JSON.parse(localStorage.getItem("user"));
            const token = localStorage.getItem("authToken"); // 🔥 Get the token

            if (!storedUser || !storedUser._id || !token) {
                console.warn("⚠️ User ID or token is missing. Cannot fetch wishlist.");
                return;
            }

            const response = await fetch(`http://localhost:5003/wishlist/${storedUser._id}`, {
                headers: {
                    "Authorization": `Bearer ${token}` // ✅ Send the token
                }
            });

            const data = await response.json();

            if (data.success) {
                setWishlistCourses(data.wishlist || []);
                console.log("✅ Wishlist updated:", data.wishlist);
            } else {
                console.warn("⚠️ Failed to fetch wishlist:", data.message);
            }
        } catch (error) {
            console.error("❌ Error fetching wishlist:", error);
        }
    };



    useEffect(() => {
        fetchWishlist(); // ✅ Load Wishlist when page loads
    }, []);





    // ✅ Filtered Courses Based on Search & Status
    const filteredCourses = courses
        .filter(course =>
            course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => (sortBy === "latest" ? b._id - a._id : a._id - b._id));

    // ✅ Logout function
    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
        window.dispatchEvent(new Event("storage"));
        navigate("/");
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Navbar */}
            <Navbar user={user} />

            {/* Logout Button */}
            <div className="flex justify-end p-4">
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-700 transition-all"
                >
                    Logout
                </button>
            </div>

            {/* Dashboard Container */}
            <section className="container mx-auto px-6 py-20">
                <div className="bg-white shadow-lg rounded-lg p-6 md:p-10 max-w-6xl mx-auto">


                    {/* Student Profile Section */}
                    {/* <div className="flex flex-col md:flex-row items-center justify-between bg-blue-100 p-5 rounded-lg shadow-sm">
                        <div className="flex items-center space-x-3">
                            <img
                                src="/path-to-profile.jpg"
                                alt="Student Profile"
                                className="w-14 h-14 rounded-full object-cover border border-gray-300"
                            />
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">{user?.fullName || "Student"}</h2>
                                <p className="text-gray-500 text-sm">Student</p>
                            </div>
                        </div>
                    </div> */}

                    {/* Navigation Tabs */}
                    <div className="flex justify-around border-b mt-3 pb-2 text-gray-600 text-sm font-medium">
                        <button className={`px-3 py-2 ${activeTab === "dashboard" ? "border-b-2 border-blue-600 text-blue-600" : "hover:text-blue-500"}`} onClick={() => setActiveTab("dashboard")}>Dashboard</button>
                        <button className={`px-3 py-2 ${activeTab === "courses" ? "border-b-2 border-blue-600 text-blue-600" : "hover:text-blue-500"}`} onClick={() => setActiveTab("courses")}>Courses</button>
                        <button className={`px-3 py-2 ${activeTab === "wishlist" ? "border-b-2 border-blue-600 text-blue-600" : "hover:text-blue-500"}`} onClick={() => setActiveTab("wishlist")}>Wishlist</button>
                        <button className={`px-3 py-2 ${activeTab === "purchaseHistory" ? "border-b-2 border-blue-600 text-blue-600" : "hover:text-blue-500"}`} onClick={() => setActiveTab("purchaseHistory")}>Purchase History</button>
                        <button className={`px-3 py-2 ${activeTab === "settings" ? "border-b-2 border-blue-600 text-blue-600" : "hover:text-blue-500"}`} onClick={() => setActiveTab("settings")}>Settings</button>
                    </div>

                    {/* Keep Existing Dashboard and Courses */}
                    {activeTab === "dashboard" && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
                                <div className="bg-red-100 p-4 rounded-lg shadow-md flex items-center">
                                    <FaBook className="text-red-600 text-3xl mr-3" />
                                    <div>
                                        <p className="text-xl font-semibold text-gray-800">12</p>
                                        <p className="text-sm text-gray-600">Enrolled Courses</p>
                                    </div>
                                </div>
                                <div className="bg-blue-100 p-4 rounded-lg shadow-md flex items-center">
                                    <FaListAlt className="text-blue-600 text-3xl mr-3" />
                                    <div>
                                        <p className="text-xl font-semibold text-gray-800">5</p>
                                        <p className="text-sm text-gray-600">Active Courses</p>
                                    </div>
                                </div>
                                <div className="bg-green-100 p-4 rounded-lg shadow-md flex items-center">
                                    <FaCheckCircle className="text-green-600 text-3xl mr-3" />
                                    <div>
                                        <p className="text-xl font-semibold text-gray-800">9</p>
                                        <p className="text-sm text-gray-600">Completed Courses</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* ✅ Courses Section */}
                    {activeTab === "courses" && (
                        <>
                            {/* Courses Header */}
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold text-gray-800">Courses ({courses.length})</h2>
                            </div>

                            {/* Filters: Search & Sort By */}
                            {/* Filters: Search, Sort By, Status */}
                            <div className="flex flex-wrap gap-4 mb-6">
                                {/* Search Input */}
                                <input
                                    type="text"
                                    placeholder="Search in your courses..."
                                    className="border p-2 rounded w-1/3 bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />

                                {/* Sort By Dropdown */}
                                <select
                                    className="border p-2 rounded bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="latest">Latest</option>
                                    <option value="oldest">Oldest</option>
                                </select>

                                {/* Status Filter Dropdown */}
                                <select
                                    className="border p-2 rounded bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="all">All Courses</option>
                                    <option value="completed">Completed</option>
                                    <option value="inprogress">In Progress</option>
                                </select>
                            </div>


                            {/* ✅ Courses Grid */}
                            {loading ? (
                                <p>Loading courses...</p>
                            ) : error ? (
                                <p className="text-red-500">{error}</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {filteredCourses.map((course) => (
                                        <div key={course._id} className="bg-white p-4 rounded-lg shadow-md">
                                            <img
                                                src={course.image ? `http://localhost:5003${course.image.startsWith("/") ? course.image : "/" + course.image}` : "/default-image.jpg"}
                                                alt={course.title || "Course Image"}
                                                className="w-full h-36 object-cover rounded"
                                            />



                                            <h4 className="text-lg font-semibold text-gray-800 mt-3">{course.title}</h4>
                                            <p className="text-gray-600 text-sm">{course.description}</p>

                                            <div className="flex justify-between items-center mt-3">
                                                <button
                                                    onClick={() => openCourseModal(course)}
                                                    className="bg-blue-500 text-white py-2 px-4 rounded text-sm hover:bg-blue-600"
                                                >
                                                    Watch Lecture
                                                </button>

                                                {/* Wishlist Toggle Button */}
                                                <button onClick={() => handleWishlistClick(course)} className="transition-all">
                                                    <FaHeart
                                                        size={20}
                                                        className={wishlistCourses.some((item) => item._id === course._id) ? "text-red-500" : "text-gray-500"}
                                                    />
                                                </button>


                                            </div>

                                        </div>
                                    ))}

                                </div>
                            )}
                        </>
                    )}




                    {/* ✅ Course Details Modal */}
                    {selectedCourse && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4">
                            <div className="bg-white w-full md:w-2/3 lg:w-1/2 p-6 rounded-2xl shadow-2xl flex flex-col md:flex-row relative">

                                {/* ❌ Close Button */}
                                <button
                                    onClick={closeCourseModal}
                                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-all"
                                >
                                    <FaTimes size={20} />
                                </button>

                                {/* 📌 Left Side - Course Image */}
                                <div className="md:w-1/2 flex justify-center items-center">
                                    <img
                                        src={selectedCourse.image ? `http://localhost:5003${selectedCourse.image.startsWith("/") ? selectedCourse.image : "/" + selectedCourse.image}` : "/default-image.jpg"}
                                        alt={selectedCourse.title}
                                        className="w-full h-64 object-cover rounded-lg"
                                    />
                                </div>

                                {/* 📌 Right Side - Course Details */}
                                <div className="md:w-1/2 md:pl-6 flex flex-col justify-center">
                                    <h2 className="text-2xl font-bold text-gray-900">{selectedCourse.title}</h2>
                                    <p className="text-gray-600 mt-2 text-sm">{selectedCourse.description}</p>

                                    {/* 📌 Course Price */}
                                    <p className="text-green-600 font-bold text-xl mt-3">Rs {selectedCourse.price}</p>

                                    {/* 📌 Enroll Button (Adds to Cart) */}
                                    <div className="mt-4">
                                        <button
                                            onClick={() => !isEnrolled && handleEnroll(selectedCourse._id)}
                                            className={`px-4 py-2 rounded-lg ${isEnrolled ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"} text-white`}
                                            disabled={isEnrolled}
                                        >
                                            {isEnrolled ? "Enrolled" : "Enroll Now"}
                                        </button>


                                        <p className="text-gray-500 text-sm mt-2 text-center">
                                            Try for Free: Enroll to start your 7-day full access free trial.
                                            <br /> Financial aid available.
                                        </p>
                                    </div>

                                    {/* 📌 Additional Course Details */}
                                    <div className="bg-gray-100 p-4 rounded-lg mt-4">
                                        <p className="text-gray-700 font-semibold">✔ Unlimited access to all course materials</p>
                                        <p className="text-gray-700">✔ Cancel anytime with no penalties</p>
                                        <p className="text-gray-700 font-semibold">✔ Earn a certificate after completion</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}










                    {/* ✅ Wishlist Tab */}
                    {activeTab === "wishlist" && (
                        <>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4 py-6">
                                Wishlist ({wishlistCourses.length})
                            </h2>
                            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                                <table className="w-full border-collapse">
                                    <thead className="bg-gray-100 text-gray-700">
                                        <tr className="text-left">
                                            <th className="p-4">Course</th>
                                            <th className="p-4">Price</th>
                                            <th className="p-4 text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {wishlistCourses.length > 0 ? (
                                            wishlistCourses.map((course) => (
                                                <tr key={course._id} className="border-b">
                                                    {/* ✅ Course Image & Name */}
                                                    <td className="p-4 flex items-center space-x-4">
                                                        <img
                                                            src={course.image ? `http://localhost:5003${course.image}` : "/default-course.jpg"}
                                                            alt={course.title}
                                                            className="w-16 h-16 rounded object-cover"
                                                        />
                                                        <div>
                                                            <p className="font-semibold text-gray-700">{course.title}</p>
                                                        </div>
                                                    </td>

                                                    {/* ✅ Price */}
                                                    <td className="p-4 text-black font-semibold">
                                                        {course.price ? `Rs ${course.price.toFixed(2)}` : "Free"}
                                                    </td>

                                                    {/* ✅ Remove from Wishlist */}
                                                    <td className="p-4 text-center">
                                                        <div className="flex justify-center items-center space-x-2">
                                                            <button
                                                                onClick={() => handleWishlistClick(course)}
                                                                className="transition-all flex items-center"
                                                            >
                                                                <FaHeart
                                                                    size={20}
                                                                    className={wishlistCourses.some((item) => item._id === course._id) ? "text-red-500" : "text-gray-500"}
                                                                />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="text-center text-gray-500 py-4">
                                                    No courses in wishlist
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}







                    {activeTab === "purchaseHistory" && (
                        <>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4 py-6">Purchase History</h2>

                            <div className="bg-white text-gray-800 shadow-md rounded-lg overflow-hidden">
                                {[
                                    {
                                        date: "1st September, 2021 at 11:30 PM",
                                        courses: 3,
                                        total: "Rs. 2000",
                                        paymentMethod: "Credit Card",
                                        expanded: true,
                                        details: [
                                            {
                                                title: "Learn Ethical Hacking From Scratch",

                                                price: "Rs. 2000",
                                                rating: "4.7 (451,444 Reviews)",
                                                image: "/path-to-hacking-course.jpg",
                                            },
                                            {
                                                title: "Mega Digital Marketing Course A-Z: 12 Courses in 1 + Updates",

                                                price: "Rs. 1500",
                                                rating: "4.7 (451,444 Reviews)",
                                                image: "/path-to-marketing-course.jpg",
                                            },
                                        ],
                                    },
                                    {
                                        date: "31st August, 2021 at 11:30 PM",
                                        courses: 2,
                                        total: "Rs. 2000",
                                        paymentMethod: "Esewa",
                                    },
                                    {
                                        date: "24th August, 2021 at 6:34 PM",
                                        courses: 1,
                                        total: "Rs. 1000 ",
                                        paymentMethod: "Khalti",
                                    },
                                    {
                                        date: "1st September, 2021 at 8:47 PM",
                                        courses: 1,
                                        total: "Rs. 1500",
                                        paymentMethod: "Esewa",
                                    },
                                    {
                                        date: "1st September, 2021 at 11:30 PM",
                                        courses: 5,
                                        total: "Rs. 2999",
                                        paymentMethod: "Esewa",
                                    },
                                    {
                                        date: "17th July, 2021 at 10:51 AM",
                                        courses: 7,
                                        total: "Rs. 3500",
                                        paymentMethod: "Credit Card",
                                    },
                                ].map((purchase, index) => (
                                    <div key={index} className="border-b p-4">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-lg font-semibold">{purchase.date}</p>
                                                <p className="text-sm text-gray-600">{purchase.courses} Courses • <span className="text-green-600">{purchase.total}</span> • {purchase.paymentMethod}</p>
                                            </div>
                                            <button className="p-2 text-gray-500 hover:text-gray-700">
                                                {purchase.expanded ? "⬆" : "⬇"}
                                            </button>
                                        </div>

                                        {purchase.expanded && purchase.details && (
                                            <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
                                                {purchase.details.map((course, i) => (
                                                    <div key={i} className="flex items-center mb-4 border-b pb-3">
                                                        <img src={course.image} alt={course.title} className="w-16 h-16 rounded mr-6" />
                                                        <div>
                                                            <p className="font-semibold text-gray-700">{course.title}</p>
                                                            {/* <p className="text-sm text-gray-500">Course by: {course.instructor}</p> */}
                                                            <p className="text-yellow-500 text-sm font-semibold">{course.rating}</p>
                                                        </div>
                                                        <p className="ml-auto font-semibold text-gray-900">{course.price}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <p className="text-center text-gray-500 mt-4">Yay! You have seen all your purchase history. 😎</p>
                        </>
                    )}

                    {activeTab === "settings" && (
                        <>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Account Settings</h2>

                            {/* Account Settings Section */}
                            <div className="bg-white shadow-md rounded-lg p-6 md:p-10">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Profile Picture Upload */}
                                    <div className="flex flex-col items-center">
                                        {/* Profile Image */}
                                        <img
                                            src={profileImage}
                                            className="w-32 h-32 rounded-full object-cover border-4 border-gray-300 shadow-md"
                                            alt="Profile"
                                        />

                                        {/* Hidden File Input for Upload */}
                                        <input type="file" id="profile-upload" className="hidden" />

                                        {/* Upload Button */}
                                        <label
                                            htmlFor="profile-upload"
                                            className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-300 transition-all"
                                        >
                                            Upload Photo
                                        </label>
                                    </div>


                                    {/* Account Details */}
                                    <div className="col-span-2">
                                        <div className="grid grid-cols-2 gap-4">
                                            <input type="text" placeholder="First name" className="border p-3 rounded-lg w-full bg-white text-gray-700" />
                                            <input type="text" placeholder="Last name" className="border p-3 rounded-lg w-full bg-white text-gray-700" />
                                        </div>
                                        <input type="text" placeholder="Username" className="border p-3 rounded-lg w-full mt-4 bg-white text-gray-700" />
                                        <input type="email" placeholder="Email address" className="border p-3 rounded-lg w-full mt-4 bg-white text-gray-700" />
                                        <textarea placeholder="Your title, profession, or small biography" className="border p-3 rounded-lg w-full mt-4 h-20 bg-white text-gray-700"></textarea>
                                        <button className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition-all">
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Change Password Section */}
                            <h2 className="text-2xl font-semibold text-gray-800 my-6">Change Password</h2>
                            <div className="bg-white shadow-md rounded-lg p-6 md:p-10">
                                <div className="grid grid-cols-1 gap-4">
                                    <input type="password" placeholder="Current Password" className="border p-3 rounded-lg w-full bg-white text-gray-700" />
                                    <input type="password" placeholder="New Password" className="border p-3 rounded-lg w-full bg-white text-gray-700" />
                                    <input type="password" placeholder="Confirm New Password" className="border p-3 rounded-lg w-full bg-white text-gray-700" />
                                </div>
                                <button className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition-all">
                                    Change Password
                                </button>
                            </div>
                        </>
                    )}


                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default StudentDashboard;

