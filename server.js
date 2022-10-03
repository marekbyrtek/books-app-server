const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Connected to port ${PORT}`));