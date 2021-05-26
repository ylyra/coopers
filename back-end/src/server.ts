import "dotenv/config";

import express from "express";
import cors from "cors";

import "./database";

import { routes } from "./routes";

const app = express();
const port = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());

app.use(routes);

app.listen(port);