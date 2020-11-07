const express = require('express');
const app = express();
const port = 8080;

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(port, (error) => {
    if (error)
    {
        return console.log("Something went wrong!", error);
    }
    console.log("Server is listening on ", port);
});