const http = require("http");
const fs = require("fs");
const path = require('path');


// server
const hostname = "127.0.0.1";
const port = 8000;

http.createServer(function(req, res) {
    if (req.url == '/') appFilesUpload('index.html', 'text/html', res);
    else appFilesUpload(req.url, getContentType(req.url), res);


    // POST response
    if (req.method === 'POST') {
        let resData = '';
        req.on('data', chunk => {
            resData += chunk.toString();
        });

        if (req.url == '/') {
            req.on('end', () => {
                const resData_parsed = JSON.parse(resData);
                for (let key in resData_parsed) {
                    if (JSON.stringify(resData_parsed[key]) == '{}') {
                        const notesData_file = JSON.parse(fs.readFileSync('./public/data/notesData.json', 'utf-8'));
                        notesData_file[key] = resData_parsed[key];
                        fs.writeFile('./public/data/notesData.json', JSON.stringify(notesData_file), err => {if (err) throw err});
                    }
                    else {
                        fs.writeFile('./public/data/usersData.json', resData, err => {if (err) throw err});
                    }
                }
            });
        }
        else if (req.url == '/html/note.html') {
            req.on('end', () => {
                const resData_parsed = JSON.parse(resData);

                const notesData_file = JSON.parse(fs.readFileSync('./public/data/notesData.json', 'utf-8'));
                for (let key in resData_parsed) {
                    const owner = resData_parsed[key]['owner'];
                    for (let name in notesData_file) {
                        if (notesData_file[name][key] != undefined && owner != name) {
                            notesData_file[name][key] = resData_parsed[key];
                        }
                    }
                    notesData_file[owner][key] = resData_parsed[key];
                }
                

                fs.writeFile('./public/data/notesData.json', JSON.stringify(notesData_file), err => {if (err) throw err});
            });
        }
        else if (req.url == '/html/home.html') {
            req.on('end', () => {
                fs.writeFile('./public/data/notesData.json', resData, err => {if (err) throw err});
            });
        }
    }
}).listen(port, hostname)
console.log(`Server running at http://${hostname}:${port}/`);





function appFilesUpload(url, contentType, res) {
    const file = path.join(__dirname+'/public/', url);
    fs.readFile(file, (err, content) => {
        if (err) {
            res.writeHead(404);
            res.write('file not found');
            res.end();
            console.log(`error 404 ${file}`);
        }
        else {
            res.writeHead(200, {'Content-Type': contentType});
            res.write(content);
            res.end();
        }
    })
}



function getContentType(url) {
    switch (path.extname(url)) {
        case ".html":
            return "text/html";
        case ".css":
            return "text/css";
        case ".js":
            return "text/javascript";
        case ".json":
            return "application/json";
        case ".svg":
            return "image/svg+xml";
        default:
            return "application/octet-stream";
    }
}