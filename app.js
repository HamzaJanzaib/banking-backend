
const express = require("express");
const helmet = require("helmet");
const cors = require('cors');
const { errorMiddleware } = require("./middlewares/error.js");
const morgan = require("morgan");
const { connectDB } = require("./lib/db.js");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const Routes = require("./routes/index.js");

dotenv.config({ path: './.env', });

const envMode = process.env.NODE_ENV?.trim() || 'DEVELOPMENT';
const port = process.env.PORT || 3000;

connectDB();



const app = express();

app.use(
  helmet({
    contentSecurityPolicy: envMode !== "DEVELOPMENT",
    crossOriginEmbedderPolicy: envMode !== "DEVELOPMENT",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*', credentials: true }));
app.use(cookieParser());
app.use(morgan('dev'));


app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// your routes here
app.use('/api', Routes);


app.get("/*splat", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Page not found",
  });
});

app.use(errorMiddleware);

app.listen(port, () => console.log('Server is working on Port:' + port + ' in ' + envMode + ' Mode.'));

module.exports = { app, envMode };
