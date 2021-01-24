//Server for index.html

const express = require('express');
const app = express();
const path = require('path');
const open = require('open');
const router = express.Router();
const PORT = 8020;
let isOpen = false;

app.use(express.static(path.join(__dirname, '/')));

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.use('/', router);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    open(`http://localhost:${PORT}/`);
});