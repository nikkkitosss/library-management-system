import app from "./app";
import { loadAll } from "./storage/persistence";

const PORT = process.env.PORT || 3000;

loadAll();

app.listen(PORT, () => {
  console.log(
    `\nLibrary Management System running on http://localhost:${PORT}`,
  );
  console.log(`Health check: http://localhost:${PORT}/health\n`);
});
