require("dotenv").config();
const express = require("express");
const session = require("express-session");
const redis = require("redis");
const RedisStore = require("connect-redis").default;
const cors = require("cors");
const databaseConnection = require("./config/db");

const app = express();
const port = process.env.PORT || 5000;

app.set("view engine", "ejs");

const redisClient = redis.createClient({
  port: 6379,
  host: "localhost",
});
redisClient.connect().catch(console.error);
const redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
});
app.use(
  session({
    store: redisStore,
    resave: false, // required: force lightweight session keep alive (touch)
    saveUninitialized: false, // recommended: only save session when data exists
    secret: "keyboard cat",
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 30,
    },
  })
);

//Standard Middleware
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  next();
});

//API Routes
const authRouter = require("./routes/authRoute");

//API Routes path
app.use("/auth", authRouter);

databaseConnection(() => {
  app.listen(port, () => {
    console.log(`server is running @ http://localhost:${port}`);
  });
});
