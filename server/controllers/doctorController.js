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

module.exports = { getMyVisits, startVisit, completeVisit };