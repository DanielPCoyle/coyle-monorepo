const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, '../applications/chat-sockets/production.package.json');

// Read the production.package.json file
fs.readFile(packageJsonPath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }

    try {
        // Parse the JSON data
        const packageJson = JSON.parse(data);

        // Update the dependency
        if (packageJson.dependencies && packageJson.dependencies['@coyle/chat-db']) {
            packageJson.dependencies['@coyle/chat-db'] = 'file:coyle-chat-db-v1.0.0.tgz';
        }

        // Write the updated JSON back to the file
        fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8', (writeErr) => {
            if (writeErr) {
                console.error('Error writing the file:', writeErr);
            } else {
                console.log('production.package.json updated successfully.');
            }
        });
    } catch (parseErr) {
        console.error('Error parsing JSON:', parseErr);
    }
});