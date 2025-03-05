// index.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/database'); 
const employeeRoutes = require('./routes/employeeRoutes');
const companyRoutes = require('./routes/companyRoutes');
const passageRoutes = require('./routes/passageRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Rotas
app.use('/api/employees', employeeRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/calculations', passageRoutes);

// Iniciando o servidor
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
