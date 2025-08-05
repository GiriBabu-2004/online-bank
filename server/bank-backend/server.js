require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const app = express();
connectDB();

app.use(cors({ origin: "*" }));

app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/register", require("./routes/register"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/user", require("./routes/user"));
app.use("/api/support", require("./routes/support"));

app.get("/test", (req, res) => {
  res.send("Welcome to the SKG Bank API");
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
