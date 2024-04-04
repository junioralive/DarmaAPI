"use strict";
import express from "express";
import cors from "cors";
import { dramaRoutes } from "./routes/drama";
import { animepaheRoute } from "./routes/animepahe";
import { test } from "./routes/test";
import { anitakuRoute } from "./routes/anitaku";

const app = express();
app.use(cors({}));
app.get("/", async (req, res) => {
  res.json({
    msg: "Welcome to valerianAPI",
  });
});
app.use("/drama", dramaRoutes);
app.use("/anime", animepaheRoute);
app.use("/anitaku", anitakuRoute);
app.use("/test", test);

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`Server running on ${port}, http://localhost:${port}`)
);
