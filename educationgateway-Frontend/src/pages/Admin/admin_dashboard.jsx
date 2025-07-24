// import React, { useEffect, useState } from "react";
// import { FaBook, FaCheckCircle, FaShoppingCart, FaUsers } from "react-icons/fa";
// import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
// import { getAllEnrollments, getAllOrders, getAllUsers, getCourses } from "../../api/api";

// const AdminDashboard = () => {
//     const [totalUsers, setTotalUsers] = useState(0);
//     const [totalCourses, setTotalCourses] = useState(0);
//     const [totalOrders, setTotalOrders] = useState(0);
//     const [totalEnrollments, setTotalEnrollments] = useState(0);
//     const [userStats, setUserStats] = useState([]);

//     useEffect(() => {
//         const fetchUsers = async () => {
//             try {
//                 const users = await getAllUsers();
//                 setTotalUsers(users.length);

//                 // ✅ Get Today's Date
//                 const userCounts = {};
//                 users.forEach((user) => {
//                     const date = user.createdAt.split("T")[0]; // Extract only the date part
//                     userCounts[date] = (userCounts[date] || 0) + 1; // Count users per date
//                 });

//                 // ✅ Convert Data into Chart Format
//                 const chartData = Object.keys(userCounts).map(date => ({
//                     date,
//                     users: userCounts[date],
//                 }));

//                 setUserStats(chartData);
//             } catch (error) {
//                 console.error("❌ Error fetching users:", error);
//             }
//         };

//         const fetchCourses = async () => {
//             try {
//                 const courses = await getCourses();
//                 setTotalCourses(courses.length);
//             } catch (error) {
//                 console.error("❌ Error fetching courses:", error);
//             }
//         };

//         const fetchOrders = async () => {
//             try {
//                 const orders = await getAllOrders();
//                 setTotalOrders(orders.length);
//             } catch (error) {
//                 console.error("❌ Error fetching orders:", error);
//             }
//         };

//         const fetchEnrollments = async () => {
//             try {
//                 const enrollments = await getAllEnrollments();
//                 setTotalEnrollments(enrollments.length);
//             } catch (error) {
//                 console.error("❌ Error fetching enrollments:", error);
//             }
//         };

//         fetchUsers();
//         fetchCourses();
//         fetchOrders();
//         fetchEnrollments();
//     }, []);

//     return (
//         <div className="p-6">
//             {/* ✅ Dashboard Stats */}
//             <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                 <div className="bg-blue-100 p-4 rounded-lg shadow-md flex items-center">
//                     <FaUsers className="text-blue-600 text-3xl mr-3" />
//                     <div>
//                         <p className="text-xl font-semibold text-gray-800">{totalUsers}</p>
//                         <p className="text-sm text-gray-600">Total Users</p>
//                     </div>
//                 </div>

//                 <div className="bg-red-100 p-4 rounded-lg shadow-md flex items-center">
//                     <FaBook className="text-red-600 text-3xl mr-3" />
//                     <div>
//                         <p className="text-xl font-semibold text-gray-800">{totalCourses}</p>
//                         <p className="text-sm text-gray-600">Total Courses</p>
//                     </div>
//                 </div>

//                 <div className="bg-yellow-100 p-4 rounded-lg shadow-md flex items-center">
//                     <FaShoppingCart className="text-yellow-600 text-3xl mr-3" />
//                     <div>
//                         <p className="text-xl font-semibold text-gray-800">{totalOrders}</p>
//                         <p className="text-sm text-gray-600">Total Orders</p>
//                     </div>
//                 </div>

//                 <div className="bg-green-100 p-4 rounded-lg shadow-md flex items-center">
//                     <FaCheckCircle className="text-green-600 text-3xl mr-3" />
//                     <div>
//                         <p className="text-xl font-semibold text-gray-800">{totalEnrollments}</p>
//                         <p className="text-sm text-gray-600">Enrolled Courses</p>
//                     </div>
//                 </div>
//             </div>

//             {/* ✅ Users Report Chart */}
//             <div className="bg-white rounded-lg shadow-md p-6 mt-6">
//                 <h5 className="text-xl font-bold text-gray-900 mb-4">User Signups Over Time</h5>

//                 {/* ✅ Chart */}
//                 <ResponsiveContainer width="100%" height={250}>
//                     <LineChart data={userStats}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="date" />
//                         <YAxis allowDecimals={false} />
//                         <Tooltip />
//                         <Line type="monotone" dataKey="users" stroke="#4F46E5" strokeWidth={3} dot={{ r: 5 }} />
//                     </LineChart>
//                 </ResponsiveContainer>
//             </div>
//         </div>
//     );
// };

// export default AdminDashboard;


import {
  BarChart3,
  Book,
  GraduationCap,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  LineChart,
  Line as ReLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  getAllEnrollments,
  getAllOrders,
  getAllUsers,
  getCourses,
} from "../../api/api";

const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalEnrollments, setTotalEnrollments] = useState(0);
  const [userStats, setUserStats] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAllUsers();
        setTotalUsers(users.length);

        const userCounts = {};
        users.forEach((user) => {
          const date = user.createdAt?.split("T")[0];
          userCounts[date] = (userCounts[date] || 0) + 1;
        });

        const chartData = Object.keys(userCounts).map((date) => ({
          date,
          users: userCounts[date],
        }));

        setUserStats(chartData);
      } catch (error) {
        console.error("❌ Error fetching users:", error);
      }
    };

    const fetchCourses = async () => {
      try {
        const courses = await getCourses();
        setTotalCourses(courses.length);
      } catch (error) {
        console.error("❌ Error fetching courses:", error);
      }
    };

    const fetchOrders = async () => {
      try {
        const orders = await getAllOrders();
        setTotalOrders(orders.length);
      } catch (error) {
        console.error("❌ Error fetching orders:", error);
      }
    };

    const fetchEnrollments = async () => {
      try {
        const enrollments = await getAllEnrollments();
        setTotalEnrollments(enrollments.length);
      } catch (error) {
        console.error("❌ Error fetching enrollments:", error);
      }
    };

    fetchUsers();
    fetchCourses();
    fetchOrders();
    fetchEnrollments();
  }, []);

  const statsCards = [
    {
      icon: Users,
      value: totalUsers,
      label: "Total Students",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      icon: Book,
      value: totalCourses,
      label: "Active Courses",
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      icon: ShoppingCart,
      value: totalOrders,
      label: "Total Orders",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      icon: GraduationCap,
      value: totalEnrollments,
      label: "Course Enrollments",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Gateway Education Dashboard
          </h1>
        </div>
        <p className="text-gray-600 ml-11">
          Monitor your educational platform's performance and growth
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div key={index} className="group">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                <div className={`h-2 bg-gradient-to-r ${card.color}`}></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-3 rounded-xl ${card.bgColor} group-hover:scale-110 transition-transform duration-300`}
                    >
                      <IconComponent className={`w-6 h-6 ${card.iconColor}`} />
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-800 group-hover:scale-105 transition-transform duration-300">
                        {card.value.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-600">{card.label}</p>
                  <div className="mt-3 flex items-center text-xs text-emerald-600">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    <span>Active</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Student Growth Analytics</h2>
              <p className="text-blue-100 text-sm">
                Track new student registrations over time
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {userStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userStats}>
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" fontSize={12} tickLine={false} />
                <YAxis allowDecimals={false} stroke="#6B7280" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E5E7EB",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  }}
                  labelStyle={{ color: "#374151", fontWeight: "600" }}
                />
                <ReLine
                  type="monotone"
                  dataKey="users"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{
                    fill: "#3B82F6",
                    strokeWidth: 3,
                    stroke: "#ffffff",
                    r: 5,
                  }}
                  activeDot={{
                    r: 7,
                    stroke: "#3B82F6",
                    strokeWidth: 3,
                    fill: "#ffffff",
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Loading analytics data...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
