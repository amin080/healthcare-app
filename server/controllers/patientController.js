const connectDB = require('../config/db');

const getDoctors = async (req, res) => {
    const db = await connectDB();
    const doctors = await db.all("SELECT * FROM users WHERE role = 'doctor'");
    res.json(doctors);
};

const bookVisit = async (req, res) => {
    const db = await connectDB();
    const { patientId, doctorId, date } = req.body;

    const exactMatch = await db.get(
        "SELECT * FROM visits WHERE doctor_id = ? AND date = ?",
        [doctorId, date]
    );

    if (exactMatch) {
        return res.status(400).json({ message: "This time slot is already fully booked!" });
    }

    await db.run(
        'INSERT INTO visits (patient_id, doctor_id, date, status, total_amount) VALUES (?, ?, ?, "booked", 0)',
        [patientId, doctorId, date]
    );
    res.json({ message: "Visit booked successfully" });
};

const getPatientDashboard = async (req, res) => {
    const db = await connectDB();
    const patientId = req.params.id;

    try {
        // Get upcoming visits (booked or in_progress)
        const upcomingVisits = await db.all(
            `SELECT visits.*, users.name as doctor_name 
             FROM visits 
             JOIN users ON visits.doctor_id = users.id 
             WHERE visits.patient_id = ? AND visits.status IN ('booked', 'in_progress')
             ORDER BY visits.date ASC`,
            [patientId]
        );

        // Get past visits (completed)
        const pastVisits = await db.all(
            `SELECT visits.*, users.name as doctor_name 
             FROM visits 
             JOIN users ON visits.doctor_id = users.id 
             WHERE visits.patient_id = ? AND visits.status = 'completed'
             ORDER BY visits.date DESC
             LIMIT 10`,
            [patientId]
        );

        // Calculate total spent
        const totalSpentResult = await db.get(
            `SELECT SUM(total_amount) as total_spent 
             FROM visits 
             WHERE patient_id = ? AND status = 'completed'`,
            [patientId]
        );
        const totalSpent = totalSpentResult?.total_spent || 0;

        // Get favorite doctors (most visited)
        const favoriteDoctors = await db.all(
            `SELECT users.name as doctor_name, COUNT(*) as visit_count, users.id
             FROM visits 
             JOIN users ON visits.doctor_id = users.id 
             WHERE visits.patient_id = ? AND visits.status = 'completed'
             GROUP BY visits.doctor_id 
             ORDER BY visit_count DESC 
             LIMIT 3`,
            [patientId]
        );

        res.json({
            upcomingVisits,
            pastVisits,
            totalSpent,
            favoriteDoctors,
            stats: {
                upcomingCount: upcomingVisits.length,
                completedCount: pastVisits.length
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getDoctors, bookVisit, getPatientDashboard };