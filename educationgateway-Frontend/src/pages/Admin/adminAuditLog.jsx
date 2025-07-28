import { useEffect, useState } from "react";
import { FaShieldAlt } from "react-icons/fa";
import axios from "../../api/axiosInstance"; // ✅ your axios setup

const AdminAuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem("authToken"); // ✅ Get token from localStorage

      const response = await axios.get("/admin/audit-logs", {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Attach token to header
        },
      });

      setLogs(response.data.logs || []);
    } catch (error) {
      console.error("❌ Error fetching audit logs:", error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  fetchLogs();
}, []);


  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FaShieldAlt className="text-purple-600" />
        Audit Log Activity
      </h2>

      {loading ? (
        <p>Loading audit logs...</p>
      ) : logs.length === 0 ? (
        <p>No audit logs found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-xs leading-normal">
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Event</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {logs.map((log, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">
                    {log.timestamp ? new Date(log.timestamp).toLocaleString() : "Invalid Date"}
                  </td>
                  <td className="py-2 px-4">{log.email || "N/A"}</td>
                  <td className="py-2 px-4">{log.event || log.message || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminAuditLog;
