import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CourseDetails = () => {
    const { courseId } = useParams(); // Get courseId from URL
    const [course, setCourse] = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const userId = localStorage.getItem("userId"); // Fetch user ID from localStorage

    // ✅ Fetch Course Details
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await axios.get(`https://localhost:5003/courses/${courseId}`);
                setCourse(response.data);
            } catch (error) {
                console.error("Error fetching course:", error.response?.data || error.message);
            }
        };

        const checkEnrollment = async () => {
            try {
                const response = await axios.get(`https://localhost:5003/checkout/user-orders/${userId}`);
                const enrolledCourses = response.data.map(order => order.course._id);
                setIsEnrolled(enrolledCourses.includes(courseId));
            } catch (error) {
                console.error("Error checking enrollment:", error.response?.data || error.message);
            }
        };

        fetchCourse();
        if (userId) checkEnrollment();
    }, [courseId, userId]);

    // ✅ Handle Enrollment
    const handleEnroll = async () => {
        try {
            if (!userId) {
                alert("Please log in to enroll.");
                return;
            }

            const response = await axios.post("https://localhost:5003/checkout/create-order", {
                userId,
                courseId
            });

            alert(response.data.message);

            // ✅ If paid, redirect to payment
            if (course.price > 0) {
                redirectToPayment(response.data.orderId);
            } else {
                setIsEnrolled(true);
            }
        } catch (error) {
            console.error("Error enrolling in course:", error.response?.data || error.message);
        }
    };

    // ✅ Redirect to Payment for Paid Courses
    const redirectToPayment = async (orderId) => {
        try {
            const response = await axios.get(`https://localhost:5003/checkout/checkout/${orderId}`);
            if (response.data.paymentUrl) {
                window.location.href = response.data.paymentUrl;
            }
        } catch (error) {
            console.error("Error redirecting to payment:", error.response?.data || error.message);
        }
    };

    if (!course) return <p>Loading...</p>;

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-3xl font-bold">{course.title}</h2>
            <p className="text-gray-700">{course.description}</p>
            <p className="text-green-600 font-bold text-lg">Rs {course.price}</p>

            {/* ✅ Show "Enroll Now" or "Watch Lecture" */}
            {isEnrolled ? (
                <button className="bg-green-500 text-white py-2 px-4 rounded mt-4">
                    Watch Lecture
                </button>
            ) : (
                <button
                    onClick={handleEnroll}
                    className="bg-blue-500 text-white py-2 px-4 rounded mt-4 hover:bg-blue-600"
                >
                    Enroll Now
                </button>
            )}
        </div>
    );
};

export default CourseDetails;
