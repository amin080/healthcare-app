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

module.exports = { getDoctors, bookVisit };