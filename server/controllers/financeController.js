const connectDB = require('../config/db');

const searchVisits = async (req, res) => {
    const db = await connectDB();
    const { doctorName, patientName, visitId } = req.query;

    let sql = `SELECT v.id, v.date, v.total_amount, v.status, d.name as doctor_name, p.name as patient_name
               FROM visits v
               JOIN users d ON v.doctor_id = d.id
               JOIN users p ON v.patient_id = p.id
               WHERE v.status = 'completed'`;

    const params = [];
    if (doctorName) { sql += " AND d.name LIKE ?"; params.push(`%${doctorName}%`); }
    if (patientName) { sql += " AND p.name LIKE ?"; params.push(`%${patientName}%`); }
    if (visitId) { sql += " AND v.id = ?"; params.push(visitId); }

    const results = await db.all(sql, params);
    res.json(results);
};

module.exports = { searchVisits };