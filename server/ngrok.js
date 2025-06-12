import ngrok from 'ngrok';
import fs from 'fs';
import 'dotenv/config';

const port = process.env.PORT || 8000;

(async function () {
  const url = await ngrok.connect({
    addr: port,
    authtoken: process.env.NGROK_AUTHTOKEN,
  });

  console.log(`🌐 NGROK Public URL: ${url}`);

  // Optionally write it to a file for frontend or later use
  fs.writeFileSync('./ngrok-url.txt', url);
})();
