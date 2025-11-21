const connectDB = require('../config/db');

const getMyVisits = async (req, res) => {
    const db = await connectDB();
    const doctorId = req.params.id;
    const visits = await db.all(
        `SELECT visits.*, users.name as patient_name 
         FROM visits JOIN users ON visits.patient_id = users.id 
         WHERE doctor_id = ?`, [doctorId]
    );
    res.json(visits);
};

const startVisit = async (req, res) => {
    const db = await connectDB();
    const { visitId } = req.params;
    const { doctorId } = req.body;

    const activeVisit = await db.get("SELECT * FROM visits WHERE doctor_id = ? AND status = 'in_progress'", [doctorId]);

    if (activeVisit) {
        return res.status(400).json({ message: "You already have a patient in progress!" });
    }

    await db.run("UPDATE visits SET status = 'in_progress' WHERE id = ?", [visitId]);
    res.json({ message: "Visit started" });
};

const completeVisit = async (req, res) => {
    const db = await connectDB();
    const { visitId, treatments, totalAmount, notes } = req.body;

    try {
        await db.run("UPDATE visits SET status = 'completed', total_amount = ?, medical_notes = ? WHERE id = ?",
            [totalAmount, notes, visitId]);

        for (let item of treatments) {
            await db.run("INSERT INTO treatments (visit_id, name, price) VALUES (?, ?, ?)",
                [visitId, item.name, item.price]);
        }
        res.json({ message: "Visit completed" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getDoctorDashboard = async (req, res) => {
    const db = await connectDB();
    const doctorId = req.params.id;

    try {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

        // Today's revenue
        const todayRevenue = await db.get(
            `SELECT SUM(total_amount) as revenue, COUNT(*) as count
             FROM visits 
             WHERE doctor_id = ? AND status = 'completed' AND date >= ?`,
            [doctorId, today]
        );

        // This week's revenue
        const weekRevenue = await db.get(
            `SELECT SUM(total_amount) as revenue, COUNT(*) as count
             FROM visits 
             WHERE doctor_id = ? AND status = 'completed' AND date >= ?`,
            [doctorId, weekAgo]
        );

        // This month's revenue
        const monthRevenue = await db.get(
            `SELECT SUM(total_amount) as revenue, COUNT(*) as count
             FROM visits 
             WHERE doctor_id = ? AND status = 'completed' AND date >= ?`,
            [doctorId, monthAgo]
        );

        // Total patients (unique)
        const totalPatients = await db.get(
            `SELECT COUNT(DISTINCT patient_id) as count
             FROM visits 
             WHERE doctor_id = ?`,
            [doctorId]
        );

        // Today's appointments
        const todayAppointments = await db.all(
            `SELECT visits.*, users.name as patient_name 
             FROM visits 
             JOIN users ON visits.patient_id = users.id 
             WHERE doctor_id = ? AND date >= ? AND date < datetime(?, '+1 day')
             ORDER BY date ASC`,
            [doctorId, today, today]
        );

        // Recent completed visits
        const recentVisits = await db.all(
            `SELECT visits.*, users.name as patient_name 
             FROM visits 
             JOIN users ON visits.patient_id = users.id 
             WHERE doctor_id = ? AND status = 'completed'
             ORDER BY date DESC 
             LIMIT 5`,
            [doctorId]
        );

        res.json({
            revenue: {
                today: todayRevenue?.revenue || 0,
                todayCount: todayRevenue?.count || 0,
                week: weekRevenue?.revenue || 0,
                weekCount: weekRevenue?.count || 0,
                month: monthRevenue?.revenue || 0,
                monthCount: monthRevenue?.count || 0
            },
            patients: {
                total: totalPatients?.count || 0
            },
            todayAppointments,
            recentVisits
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getMyVisits, startVisit, completeVisit, getDoctorDashboard };