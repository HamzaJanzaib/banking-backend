
const express = require("express");
const helmet = require("helmet");
const cors = require('cors');
const { errorMiddleware } = require("./middlewares/error.js");
const morgan = require("morgan");
const { connectDB } = require("./lib/db.js");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.routes.js");
const userRoutes = require("./routes/user.routes.js");
const cookieParser = require("cookie-parser");

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
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);


app.get("/*splat", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Page not found",
  });
});

app.use(errorMiddleware);

app.listen(port, () => console.log('Server is working on Port:' + port + ' in ' + envMode + ' Mode.'));

module.exports = { app, envMode };
