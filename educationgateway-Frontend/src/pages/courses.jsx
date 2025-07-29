import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { FiGrid, FiList, FiSearch } from "react-icons/fi";
import Footer from "../components/Footer";
import Navbar from "../components/NavBar";

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [viewMode, setViewMode] = useState("grid");
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const categories = ["All", "Programming", "Data Science", "Design"];

    // ✅ Fetch courses from backend
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const authToken = localStorage.getItem("authToken");
                if (!authToken) {
                    setError("Unauthorized access. Please log in.");
                    setLoading(false);
                    return;
                }

                const response = await axios.get("https://localhost:5003/courses/all", {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        "Content-Type": "application/json",
                    },
                });

                setCourses(response.data);
            } catch (error) {
                setError("Failed to load courses. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    // ✅ Filter courses based on search and category
    const filteredCourses = useMemo(() => {
        return courses.filter(course => {
            const matchesSearch = course?.title?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === "All" || course?.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, selectedCategory, courses]);

    return (
        <>
            <Navbar />

            {/* ✅ Title: Available Courses (Properly Positioned) */}
            <div className="w-full max-w-screen-xl mx-auto bg-white px-6 py-4  rounded-lg mt-28">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Available Courses</h2>

                {/* ✅ Search & Filters - Now Positioned Correctly */}
                <div className="w-full max-w-7xl bg-white px-6 py-4 shadow-md rounded-lg relative">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        {/* ✅ Search Input */}
                        <div className="relative flex-1 max-w-xl">
                            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search courses..."
                                className="w-full pl-12 pr-4 py-2 h-12 border border-gray-300 bg-white rounded-md focus:ring-2 focus:ring-blue-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* ✅ Category Dropdown */}
                        <select
                            className="w-48 h-12 px-4 border border-gray-300 bg-white rounded-md focus:ring-2 focus:ring-blue-500"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {categories.map(category => (
                                <option key={category} value={category} className="text-gray-800">
                                    {category}
                                </option>
                            ))}
                        </select>

                        {/* ✅ Grid/List Toggle */}
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-3 rounded-md ${viewMode === "grid" ? "bg-blue-500 text-white" : "text-gray-600"}`}
                            >
                                <FiGrid size={20} />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-3 rounded-md ${viewMode === "list" ? "bg-blue-500 text-white" : "text-gray-600"}`}
                            >
                                <FiList size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* ✅ Courses List - Now Spaced Correctly */}
                <div className="w-full max-w-7xl mt-10 px-6">
                    {loading ? (
                        <p className="text-center text-gray-500">Loading courses...</p>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : filteredCourses.length === 0 ? (
                        <p className="text-center text-gray-600 py-12">No courses found.</p>
                    ) : (
                        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                            {filteredCourses.map(course => (
                                <div
                                    key={course._id}
                                    className={`bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl transition-shadow cursor-pointer ${viewMode === "list" ? "flex items-center space-x-4" : ""}`}
                                    onClick={() => setSelectedCourse(course)}
                                >
                                    <img
                                        src={course.image ? `https://localhost:5003${course.image}` : "/default-image.png"} // ✅ Fixed Image Path
                                        alt={course.title}
                                        className={`rounded-md ${viewMode === "list" ? "w-24 h-24" : "w-full h-48"} object-cover`}
                                        onError={(e) => { e.target.src = "/default-image.png"; }} // ✅ Fallback Image
                                    />

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                                        <p className="text-gray-800 font-bold mt-1">Rs {course.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
};

export default Courses;
