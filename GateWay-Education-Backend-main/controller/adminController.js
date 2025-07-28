const fs = require("fs");
const path = require("path");

const getAuditLogFile = async (req, res) => {
    try {
        const logPath = path.join(__dirname, "../logs/audit.log");

        const logData = fs.readFileSync(logPath, "utf-8");

        // Split each line and filter empty lines
        const logs = logData
            .split("\n")
            .filter(line => line.trim() !== "")
            .map(line => {
                const match = line.match(/^(.+?) \[(.+?)\]: (.+)$/);
                if (match) {
                    const [, timestamp, level, message] = match;
                    return { timestamp, level, message };
                }
                return null;
            })
            .filter(log => log !== null);

        res.status(200).json({ success: true, logs });
    } catch (error) {
        console.error("Error reading audit log:", error);
        res.status(500).json({ success: false, message: "Failed to load audit log" });
    }
};

module.exports = { getAuditLogFile };
