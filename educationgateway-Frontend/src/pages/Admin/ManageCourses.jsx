import React, { useEffect, useState } from "react";
import { MdModeEditOutline } from "react-icons/md"; // ✅ Edit Icon
import { RiDeleteBin6Line } from "react-icons/ri"; // ✅ Delete Icon
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createCourse, deleteCourse, getCourses, updateCourse } from "../../api/api";

const ManageCourses = () => {
    const [courses, setCourses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editCourse, setEditCourse] = useState(null);

    const [newCourse, setNewCourse] = useState({
        title: "",
        description: "",
        videoUrl: "",
        price: "",
        image: null,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ✅ Fetch Courses from Backend
    useEffect(() => {
        fetchAllCourses();
    }, []);

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
            formData.append("price", newCourse.price.replace(/[^\d]/g, "")); // ✅ Remove any non-numeric values
            formData.append("profilePicture", newCourse.image); // ✅ File Upload Key

            const addedCourse = await createCourse(formData);
            setCourses([...courses, addedCourse]);
            setNewCourse({ title: "", description: "", videoUrl: "", price: "", image: null });
            setIsModalOpen(false);

            // ✅ Show Success Toast
            toast.success("Course added successfully!");

        } catch (error) {
            toast.error("Failed to add course. Please try again.");
        }
    };


    // ✅ Handle Course Deletion
    const handleDeleteCourse = async (id) => {
        if (window.confirm("Are you sure you want to delete this course?")) {
            try {
                await deleteCourse(id);
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
        if (!editCourse.title || !editCourse.description || !editCourse.price) {
            toast.info("Title, Description, and Price are required.");
            return;
        }

        try {
            const updatedCourse = await updateCourse(editCourse._id, {
                title: editCourse.title,
                description: editCourse.description,
                price: editCourse.price,
            });

            setCourses((prevCourses) =>
                prevCourses.map((course) =>
                    course._id === updatedCourse._id ? updatedCourse : course
                )
            );

            setIsEditModalOpen(false);
            setEditCourse(null);
        } catch (error) {
            toast.error("Failed to update course. Please try again.");
        }
    };

    return (

        <div className="p-6 bg-white rounded-lg shadow-md">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl text-gray-800 font-semibold">Manage Courses</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    + Add Course
                </button>
            </div>

            {/* Display Courses in Table Format */}
            {loading ? (
                <p>Loading courses...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : null}

            {!loading && courses.length > 0 ? (
                <table className="w-full border-collapse border border-gray-300 text-center">
                    <thead>
                        <tr className="bg-gray-200 text-gray-800">
                            <th className="border p-3">No.</th>
                            <th className="border p-3">Title</th>
                            <th className="border p-3">Price</th>
                            <th className="border p-3">Video</th>
                            <th className="border p-3">Image</th>
                            <th className="border p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course, index) => (
                            <tr key={course._id} className="text-gray-700">
                                <td className="border p-3">{index + 1}</td>
                                <td className="border p-3">{course.title}</td>
                                <td className="border p-3 font-bold text-green-600">${course.price}</td>
                                <td className="border p-3">
                                    <a href={course.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                        Watch
                                    </a>
                                </td>
                                <td className="border p-3">
                                    <img src={`http://localhost:5003${course.image}`} alt={course.title} className="w-20 h-20 object-cover rounded" />
                                </td>
                                <td className="border p-3 flex justify-center gap-3">
                                    <button onClick={() => openEditModal(course)} className="text-blue-500 hover:text-blue-700">
                                        <MdModeEditOutline size={20} />
                                    </button>
                                    <button onClick={() => handleDeleteCourse(course._id)} className="text-red-500 hover:text-red-700">
                                        <RiDeleteBin6Line size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                !loading && <p className="text-gray-500">No courses found.</p>
            )}

            {/* ✅ Edit Course Modal */}
            {isEditModalOpen && editCourse && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h3 className="text-xl text-gray-700 font-semibold mb-4">Edit Course</h3>

                        <input type="text" placeholder="Course Title" value={editCourse.title} onChange={(e) => setEditCourse({ ...editCourse, title: e.target.value })} className="border p-2 w-full mb-3 bg-white text-gray-900 rounded" />
                        <textarea placeholder="Course Description" value={editCourse.description} onChange={(e) => setEditCourse({ ...editCourse, description: e.target.value })} className="border p-2 w-full mb-3 bg-white text-gray-900 rounded" />
                        <input
                            type="text"
                            placeholder="Price (Rs.)"
                            value={newCourse.price}
                            onChange={(e) => setNewCourse({
                                ...newCourse,
                                price: e.target.value.replace(/[^\d]/g, "") // ✅ Removes "$" or any non-numeric values
                            })}
                            className="border p-2 w-full mb-3 bg-white text-gray-900 rounded"
                        />

                        <div className="flex justify-end gap-2">
                            <button onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">Cancel</button>
                            <button onClick={handleEditCourse} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ✅ Modal for Adding Course */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h3 className="text-xl text-gray-700 font-semibold mb-4">Add New Course</h3>

                        <input type="text" placeholder="Course Title" value={newCourse.title} onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })} className="border p-2 w-full mb-3 bg-white text-gray-900 rounded" />
                        <textarea placeholder="Course Description" value={newCourse.description} onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })} className="border p-2 w-full mb-3 bg-white text-gray-900 rounded" />
                        <input type="text" placeholder="Video URL" value={newCourse.videoUrl} onChange={(e) => setNewCourse({ ...newCourse, videoUrl: e.target.value })} className="border p-2 w-full mb-3 bg-white text-gray-900 rounded" />
                        <input
                            type="text"
                            placeholder="Price (Rs.)"
                            value={newCourse.price}
                            onChange={(e) => setNewCourse({
                                ...newCourse,
                                price: e.target.value.replace(/[^\d]/g, "") // ✅ Removes "$" or any non-numeric values
                            })}
                            className="border p-2 w-full mb-3 bg-white text-gray-900 rounded"
                        />
                        <input type="file" accept="image/*" onChange={(e) => setNewCourse({ ...newCourse, image: e.target.files[0] })} className="border p-2 w-full mb-3 bg-white text-gray-900 rounded" />

                        <div className="flex justify-end gap-2">
                            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">Cancel</button>
                            <button onClick={handleAddCourse} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add Course</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageCourses;
