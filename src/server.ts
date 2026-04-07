import "dotenv/config";

import app from "./app";
import CONFIG from "./config";

const PORT = CONFIG.port;

app.listen(PORT, () => {
  console.log(
    `\nLibrary Management System running on http://localhost:${PORT}`,
  );
  console.log(`Health check: http://localhost:${PORT}/health\n`);
});
