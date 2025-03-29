// scripts/dev.js
const { exec } = require("child_process");
const ip = require("ip");

const localIP = ip.address();
const port = 3000;

console.log(
  `Starting Next.js on http://${localIP}:${port} and http://localhost:${port}`,
);

exec(`npx next dev -H 0.0.0.0 -p ${port}`, (err, stdout, stderr) => {
  if (err) {
    console.error("Error starting Next.js:", err);
    return;
  }
  console.log(stdout);
  console.error(stderr);
});
