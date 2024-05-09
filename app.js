const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')

const app = express();
app.use(cors())

const PORT = 3030 || process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const AuthRoute = require('./Routes/AuthRoute');
app.use('/api/auth', AuthRoute);


app.listen(PORT, () => {
    // menjalankan PORT
    console.log(`Server is running on port ${PORT}`);
});

