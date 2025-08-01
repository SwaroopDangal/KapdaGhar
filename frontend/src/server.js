export const backend_url =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000"
    : "https://kapdaghar.onrender.com";
