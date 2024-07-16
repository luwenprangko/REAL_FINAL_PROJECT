const os = require('os');

const networkInterfaces = os.networkInterfaces();

// Find the first non-zero MAC address
let macAddress = null;
for (const interfaceName in networkInterfaces) {
  networkInterfaces[interfaceName].forEach(details => {
    if (details.mac && details.mac !== '00:00:00:00:00:00') {
      macAddress = details.mac;
      return; // Break out of the inner loop once a non-zero MAC address is found
    }
  });
  if (macAddress) {
    break; // Break out of the outer loop if a non-zero MAC address is found
  }
}

// Check if the found MAC address matches the desired value
if (macAddress === '4c:d5:77:64:19:2d') {
  console.log('01');
} if (macAddress === '4c:d5:77:64:19:2d') {
    console.log('01');
}
