const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());

app.post('/java', async (req, res) => {
    const code = req.body.code;

    // Write Java code to a file
    fs.writeFile('./Javass/Solution.java', code, (err) => {
        if (err) {
            console.error('Error writing Java file:', err);
            res.status(500).send('Error writing Java file');
            return;
        }

        // Build Docker image
        exec('docker build -t code ./Javass', (err, stdout, stderr) => {
            if (err) {
                console.error('Error building Docker image:', err);
                res.status(500).send(stderr);
                return;
            }

            console.log('Docker image built successfully:', stdout);

            // Run Docker container
            exec('docker run code', (err, stdout, stderr) => {
                if (err) {
                    console.error('Error running Docker container:', err);
                    res.status(500).send(stderr);
                    return;
                }

                console.log('Docker container executed successfully:', stdout);
                res.send(stdout); // Send output back to client
            });
        });
    });
});

app.listen(8000, () => {
    console.log("App running on port 8000");
});
