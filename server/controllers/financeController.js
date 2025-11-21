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

const getFinanceDashboard = async (req, res) => {
    const db = await connectDB();

    try {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

        // Revenue by period
        const todayRevenue = await db.get(
            `SELECT SUM(total_amount) as revenue, COUNT(*) as count
             FROM visits 
             WHERE status = 'completed' AND date >= ?`,
            [today]
        );

        const weekRevenue = await db.get(
            `SELECT SUM(total_amount) as revenue, COUNT(*) as count
             FROM visits 
             WHERE status = 'completed' AND date >= ?`,
            [weekAgo]
        );

        const monthRevenue = await db.get(
            `SELECT SUM(total_amount) as revenue, COUNT(*) as count
             FROM visits 
             WHERE status = 'completed' AND date >= ?`,
            [monthAgo]
        );

        const totalRevenue = await db.get(
            `SELECT SUM(total_amount) as revenue, COUNT(*) as count
             FROM visits 
             WHERE status = 'completed'`
        );

        // Visit counts by status
        const visitsByStatus = await db.all(
            `SELECT status, COUNT(*) as count 
             FROM visits 
             GROUP BY status`
        );

        // Top performing doctors
        const topDoctors = await db.all(
            `SELECT users.name as doctor_name, 
                    SUM(visits.total_amount) as total_revenue,
                    COUNT(*) as visit_count
             FROM visits 
             JOIN users ON visits.doctor_id = users.id 
             WHERE visits.status = 'completed'
             GROUP BY visits.doctor_id 
             ORDER BY total_revenue DESC 
             LIMIT 5`
        );

        // Recent transactions (last 10)
        const recentTransactions = await db.all(
            `SELECT v.id, v.date, v.total_amount, v.status, 
                    d.name as doctor_name, p.name as patient_name
             FROM visits v
             JOIN users d ON v.doctor_id = d.id
             JOIN users p ON v.patient_id = p.id
             WHERE v.status = 'completed'
             ORDER BY v.date DESC 
             LIMIT 10`
        );

        // Revenue trend (last 7 days)
        const revenueTrend = await db.all(
            `SELECT DATE(date) as day, SUM(total_amount) as revenue, COUNT(*) as count
             FROM visits 
             WHERE status = 'completed' AND date >= ?
             GROUP BY DATE(date)
             ORDER BY DATE(date) ASC`,
            [weekAgo]
        );

        res.json({
            revenue: {
                today: todayRevenue?.revenue || 0,
                todayCount: todayRevenue?.count || 0,
                week: weekRevenue?.revenue || 0,
                weekCount: weekRevenue?.count || 0,
                month: monthRevenue?.revenue || 0,
                monthCount: monthRevenue?.count || 0,
                total: totalRevenue?.revenue || 0,
                totalCount: totalRevenue?.count || 0,
                average: totalRevenue?.count > 0 ? (totalRevenue.revenue / totalRevenue.count) : 0
            },
            visitsByStatus,
            topDoctors,
            recentTransactions,
            revenueTrend
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { searchVisits, getFinanceDashboard };