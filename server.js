const http = require('http');
const filesys = require('fs');
const express = require('express');
const port = 4200;
const app = express();
const path = require('path');

app.use("/css", express.static('./css/'));
app.use("/js", express.static('./js/'));

const requestHandler = function (req, res)
{
    console.log(req.url);

    var filename = "";

    if(req.url.length > 1)
    {
        file = "./" + req.url; // any other request, build the file path
    }
    else
    {
        filename = "./index.html";
    }

    filesys.readFile(filename, (error, file) => {
        if (error)
        {
            if (error.code === 'ENOENT') // Error No Entry
            {
                //404 error
                res.writeHead(404);
                res.end(error.message);
            }
            console.log("Error handling: ", filename);
            res.writeHead(500, error.message);
            return; // end the read file with an error
        }
        res.end(file); // if no errors send back the file
    })
}

const server = http.createServer(requestHandler);

server.listen(port, (error) => {
    if (error)
    {
        return console.log("Something went wrong!", error);
    }
    console.log("Server is listening on ", port);
})