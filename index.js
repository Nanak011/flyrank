const express = require('express');
const app = express();
const port = 3000;

//   Stage 0 print hello world
// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

// Stage 1: root endpoint returns JSON with name, version, and endpoints
app.get('/', (req, res) => {
    res.json({
        name: "Task API",
        version: "1.0",
        endpoints:["/tasks"]
    });
}); 

// Stage 1: health check endpoint returns JSON with status and timestamp
app.get('/health', (req, res) => {
    res.json({
        status: "OK",
        timestamp: new Date().toISOString()
    });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});