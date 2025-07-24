import { useEffect, useState } from "react";
import { MdModeEditOutline } from "react-icons/md"; // ✅ Edit Icon
import { RiDeleteBin6Line } from "react-icons/ri"; // ✅ Delete Icon
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCourses } from "../../api/api";
import axios from "../../api/axiosInstance"; // ✅ Add your custom axios instance

const ManageCourses = () => {
    const [courses, setCourses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editCourse, setEditCourse] = useState(null);
    const [csrfToken, setCsrfToken] = useState(""); // ✅ CSRF token

    const [newCourse, setNewCourse] = useState({
        title: "",
        description: "",
        videoUrl: "",
        price: "",
        image: null,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ✅ Fetch Courses and CSRF Token from Backend
    useEffect(() => {
        fetchAllCourses();
        fetchCsrfToken();
    }, []);

    const fetchCsrfToken = async () => {
        try {
            const res = await axios.get("/get-csrf-token", { withCredentials: true });
            setCsrfToken(res.data.csrfToken);
        } catch (err) {
            console.error("❌ Failed to fetch CSRF token", err);
        }
    };

    const fetchAllCourses = async () => {
        try {
            const fetchedCourses = await getCourses();
            setCourses(fetchedCourses);
        } catch (error) {
            setError("Failed to fetch courses. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Handle Course Addition
    const handleAddCourse = async () => {
        try {
            const formData = new FormData();
            formData.append("title", newCourse.title);
            formData.append("description", newCourse.description);
            formData.append("videoUrl", newCourse.videoUrl);
            formData.append("price", newCourse.price.replace(/[^\d]/g, ""));
            formData.append("profilePicture", newCourse.image);

            const response = await axios.post("/courses/create", formData, {
                headers: {
                    "csrf-token": csrfToken,
                },
                withCredentials: true,
            });

            setCourses([...courses, response.data]);
            setNewCourse({ title: "", description: "", videoUrl: "", price: "", image: null });
            setIsModalOpen(false);
            toast.success("Course added successfully!");
        } catch (error) {
            toast.error("Failed to add course. Please try again.");
        }
    };

    // ✅ Handle Course Deletion
    const handleDeleteCourse = async (id) => {
        if (window.confirm("Are you sure you want to delete this course?")) {
            try {
                await axios.delete(`/courses/delete/${id}`, {
                    headers: {
                        "csrf-token": csrfToken,
                    },
                    withCredentials: true,
                });
                setCourses((prevCourses) => prevCourses.filter((course) => course._id !== id));
            } catch (error) {
                toast.error("Failed to delete course. Please try again.");
            }
        }
    };

    // ✅ Open Edit Modal
    const openEditModal = (course) => {
        setEditCourse(course);
        setIsEditModalOpen(true);
    };

    // ✅ Handle Course Edit
const handleEditCourse = async () => {
  if (
    !editCourse.title ||
    !editCourse.description ||
    editCourse.price === "" ||
    isNaN(Number(editCourse.price))
  ) {
    toast.info("Title, Description, and valid Price are required.");
    return;
  }

  try {
    const response = await axios.put(
      `/courses/update/${editCourse._id}`,
      {
        title: editCourse.title,
        description: editCourse.description,
        price: Number(editCourse.price),
      },
      {
        headers: {
          "Content-Type": "application/json",
          "csrf-token": csrfToken,
        },
        withCredentials: true,
      }
    );

    const updatedCourse = response.data.course;

    // ✅ Replace updated course in UI
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course._id === updatedCourse._id ? updatedCourse : course
      )
    );

    setIsEditModalOpen(false);
    setEditCourse(null);
    toast.success("Course updated successfully!");
  } catch (error) {
    console.error("❌ Edit Error:", error.response?.data || error.message);
    toast.error("Failed to update course.");
  }
};






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
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Management</h1>
                        <p className="text-gray-600">Manage and organize your courses efficiently</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm hover:shadow-md"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Course
                    </button>
                </div>

                {/* Content Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="flex items-center space-x-3">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                <span className="text-gray-600 font-medium">Loading courses...</span>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-red-600 font-medium">{error}</p>
                            </div>
                        </div>
                    ) : courses.length === 0 ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
                                <p className="text-gray-500">Get started by creating your first course</p>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-hidden">
                            {/* Table Header */}
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                <div className="grid grid-cols-12 gap-4 items-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    <div className="col-span-1">#</div>
                                    <div className="col-span-3">Course Details</div>
                                    <div className="col-span-2">Price</div>
                                    <div className="col-span-2">Video</div>
                                    <div className="col-span-2">Image</div>
                                    <div className="col-span-2">Actions</div>
                                </div>
                            </div>

                            {/* Table Body */}
                            <div className="divide-y divide-gray-200">
                                {courses.map((course, index) => (
                                    <div key={course._id} className="px-6 py-6 hover:bg-gray-50 transition-colors duration-150">
                                        <div className="grid grid-cols-12 gap-4 items-center">
                                            {/* Index */}
                                            <div className="col-span-1">
                                                <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                                                    {index + 1}
                                                </span>
                                            </div>

                                            {/* Course Details */}
                                            <div className="col-span-3">
                                                <h3 className="text-sm font-semibold text-gray-900 mb-1">{course.title}</h3>
                                                <p className="text-sm text-gray-500 line-clamp-2">{course.description}</p>
                                            </div>

                                            {/* Price */}
                                            <div className="col-span-2">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                                                    ${course.price}
                                                </span>
                                            </div>

                                            {/* Video */}
                                            <div className="col-span-2">
                                                <a 
                                                    href={course.videoUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="inline-flex items-center px-3 py-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors duration-150"
                                                >
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Watch
                                                </a>
                                            </div>

                                            {/* Image */}
                                            <div className="col-span-2">
                                                <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                                    <img 
                                                        src={`http://localhost:5003${course.image}`} 
                                                        alt={course.title} 
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="col-span-2">
                                                <div className="flex items-center space-x-2">
                                                    <button 
                                                        onClick={() => openEditModal(course)}
                                                        className="inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors duration-150"
                                                        title="Edit course"
                                                    >
                                                        <MdModeEditOutline size={18} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteCourse(course._id)}
                                                        className="inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-150"
                                                        title="Delete course"
                                                    >
                                                        <RiDeleteBin6Line size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ✅ Edit Course Modal */}
            {isEditModalOpen && editCourse && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-gray-900">Edit Course</h3>
                                <button 
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors duration-150"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
                                    <input 
                                        type="text" 
                                        placeholder="Enter course title" 
                                        value={editCourse.title} 
                                        onChange={(e) => setEditCourse({ ...editCourse, title: e.target.value })} 
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-150"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <textarea 
                                        placeholder="Enter course description" 
                                        value={editCourse.description} 
                                        onChange={(e) => setEditCourse({ ...editCourse, description: e.target.value })} 
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-150 resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (Rs.)</label>
                                    <input
                                    type="number"
                                    name="price"
                                    value={editCourse.price || ""}
                                    onChange={(e) =>
                                        setEditCourse((prev) => ({
                                        ...prev,
                                        price: e.target.value === "" ? "" : Number(e.target.value),
                                        }))
                                    }
                                    placeholder="Enter Price"
                                    className="border w-full px-3 py-2 rounded"
                                    />

                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-8">
                                <button 
                                    onClick={() => setIsEditModalOpen(false)} 
                                    className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-150"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleEditCourse} 
                                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-150"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ✅ Modal for Adding Course */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-gray-900">Add New Course</h3>
                                <button 
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors duration-150"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
                                    <input 
                                        type="text" 
                                        placeholder="Enter course title" 
                                        value={newCourse.title} 
                                        onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })} 
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-150"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <textarea 
                                        placeholder="Enter course description" 
                                        value={newCourse.description} 
                                        onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })} 
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-150 resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Video URL</label>
                                    <input 
                                        type="text" 
                                        placeholder="Enter video URL" 
                                        value={newCourse.videoUrl} 
                                        onChange={(e) => setNewCourse({ ...newCourse, videoUrl: e.target.value })} 
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-150"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (Rs.)</label>
                                    <input
                                        type="text"
                                        placeholder="Enter price"
                                        value={newCourse.price}
                                        onChange={(e) => setNewCourse({
                                            ...newCourse,
                                            price: e.target.value.replace(/[^\d]/g, "")
                                        })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-150"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Course Image</label>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={(e) => setNewCourse({ ...newCourse, image: e.target.files[0] })} 
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-150 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-8">
                                <button 
                                    onClick={() => setIsModalOpen(false)} 
                                    className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-150"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleAddCourse} 
                                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-150"
                                >
                                    Add Course
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageCourses;