import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { NODE_ENV, PORT } from "./configs/envConfigs";
import { swaggerOptions } from "./configs/swaggerConfig";
import { connectToDB } from "./configs/dbConfig";
import passport from "passport";
import session from "express-session";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { configurePassport } from "./configs/passportConfig";
import authRoutes from "./routes/authRoutes";
import bankerRoutes from "./routes/bankerRoutes";
import cookieParser from 'cookie-parser';
const port = PORT || 3000;

const app = express();

const corsOptions: cors.CorsOptions = {
  optionsSuccessStatus: 200,
  origin: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  exposedHeaders: ["accesstoken", "X-accesstoken"],
};
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
configurePassport();
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @openapi
 * /:
 *   get:
 *     summary: Welcome endpoint
 *     description: Returns a welcome message for the ALoanMatic backend.
 *     tags:
 *       - Base
 *     responses:
 *       200:
 *         description: Welcome message
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Welcome to ALoanMatic Backend
 */
app.get("/", (req, res) => {
  res.send("Welcome to ALoanMatic Backend");
});
app.use("/auth", authRoutes);
app.use("/", bankerRoutes);

const startServer = async () => {
  try {
    await connectToDB(); // Ensure DB is connected before server starts
    //  connectNodeCache();
    app.listen(port, () => {
      console.log(
        `🚀 ALoanMatic server started >> Environment = ${NODE_ENV} >> URL = http://localhost:${port}`
      );
      console.log(
        `📘 Swagger docs available at: http://localhost:${port}/api-docs`
      );
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
  }
};

startServer();
function connectNodeCache() {
  throw new Error("Function not implemented.");
}

