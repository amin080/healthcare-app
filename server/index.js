const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const financeRoutes = require('./routes/financeRoutes');



app.use('/api', authRoutes);     
app.use('/api', patientRoutes);   
app.use('/api', doctorRoutes);    
app.use('/api/finance', financeRoutes); 



const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});