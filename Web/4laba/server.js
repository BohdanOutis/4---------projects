const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const LOG_FILE_PATH = process.env.LOG_FILE_PATH || './logs';
const LOG_FILE_NAME = process.env.LOG_FILE_NAME || 'server_logs';
const LOG_FILE_FORMAT = process.env.LOG_FILE_FORMAT || 'txt';

if (!fs.existsSync(LOG_FILE_PATH)) {
    fs.mkdirSync(LOG_FILE_PATH, { recursive: true });
}

// Перевірка доступності директорії
fs.access(LOG_FILE_PATH, fs.constants.W_OK, (err) => {
    if (err) {
        console.error(`Неможливо записати у директорію ${LOG_FILE_PATH}`);
        process.exit(1);  // якщо директорія недоступна
    } else {
        console.log(`Директорія ${LOG_FILE_PATH} доступна для запису`);
    }
});

const logFilePath = path.join(LOG_FILE_PATH, `${LOG_FILE_NAME}.${LOG_FILE_FORMAT}`);

function writeToLogFile(data) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${data}\n`;
    
    fs.appendFile(logFilePath, logEntry, (err) => {
        if (err) {
            console.error(`Помилка запису до файлу логів: ${err}`);
        }
    });
} 

const server = http.createServer((req, res) => {
    const connectionInfo = `Connection from ${req.connection.remoteAddress} at ${new Date().toISOString()}`;
    writeToLogFile(connectionInfo);

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello, World!\n');
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
