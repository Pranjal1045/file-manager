const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Directory where files will be managed
const filesDir = path.join(__dirname, 'files');

// Create the files directory if it doesn't exist
if (!fs.existsSync(filesDir)) {
    fs.mkdirSync(filesDir);
}

// Create HTTP server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    res.setHeader('Content-Type', 'text/plain');

    // Create a file
    if (pathname === '/create') {
        const filename = query.filename;
        const content = query.content || '';

        if (!filename) {
            res.end('Filename is required!');
            return;
        }

        const filePath = path.join(filesDir, filename);

        fs.writeFile(filePath, content, (err) => {
            if (err) {
                res.end('Error creating file');
            } else {
                res.end(`File '${filename}' created successfully.`);
            }
        });

    // Read a file
    } else if (pathname === '/read') {
        const filename = query.filename;

        if (!filename) {
            res.end('Filename is required!');
            return;
        }

        const filePath = path.join(filesDir, filename);

        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                res.end('File not found or error reading file');
            } else {
                res.end(`Content of '${filename}':\n\n${data}`);
            }
        });

    // Delete a file
    } else if (pathname === '/delete') {
        const filename = query.filename;

        if (!filename) {
            res.end('Filename is required!');
            return;
        }

        const filePath = path.join(filesDir, filename);

        fs.unlink(filePath, (err) => {
            if (err) {
                res.end('File not found or error deleting file');
            } else {
                res.end(`File '${filename}' deleted successfully.`);
            }
        });

    } else {
        res.end('Invalid route. Use /create, /read, or /delete.');
    }
});

// Start server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
