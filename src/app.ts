import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { userRoutes } from "./modules/user/user.routes";
import { authRoutes } from "./modules/auth/auth.route";
import { propertyRoutes } from "./modules/property/property.routes";
import { categoryRoutes } from "./modules/category/category.route";
import { requestRoutes } from "./modules/requests/request.route";

const app: Application = express();

app.use(cors({ origin: config.app_url, credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", async (req: Request, res: Response) => {
  res.send("Hello, RestNest!");
});

app.use("/api/auth", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", propertyRoutes);
app.use("/api", categoryRoutes);
app.use("/api/landlord", propertyRoutes);
app.use("/api", requestRoutes);

export default app;
