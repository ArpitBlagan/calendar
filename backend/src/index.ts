import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import mongoose from "mongoose";
import { google } from "googleapis";
import { History } from "./schema/user";
dotenv.config();
import cookieParser from "cookie-parser";
import { userInfoModel } from "./schema/user";
const app = express();
app.use(express.json());
mongoose.connect(process.env.URL as string).then((con) => {
  console.log("connnected");
});
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "*",
      "http://localhost:5173",
      "https://calendar-ten-psi.vercel.app",
      "https://calendar-git-master-arpitblagans-projects.vercel.app/",
    ],
    credentials: true,
  })
);
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "https://calendar-9ofe.onrender.com/auth/google/callback"
);
const calendar = google.calendar({ version: "v3", auth: process.env.API_KEY });
// generate a url that asks permissions for Blogger and Google Calendar scopes
const scopes = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
];

app.get("/auth/google", (req, res) => {
  if (oauth2Client.credentials.access_token) {
    res.json({ message: "already logged In" });
  }
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });
  res.redirect(url);
});
app.get("/auth/google/callback", async (req, res) => {
  const code = req.query.code;
  //@ts-ignore
  const { tokens } = await oauth2Client.getToken(code as any);
  if (tokens.access_token && tokens.refresh_token) {
    try {
      const ff = await userInfoModel.create({
        access_token: tokens.access_token,
        refersh_token: tokens.refresh_token,
      });
      console.log("created successfully");
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ message: "something went wrong while saving the tokens" });
    }
  }

  oauth2Client.setCredentials(tokens);
  res.cookie("token", tokens.access_token, {
    sameSite: "none",
    httpOnly: true,
    secure: true,
  });
  //req.session.tokens = tokens;
  res.redirect("https://calendar-ten-psi.vercel.app");
});
app.get("/events", async (req: any, res: Response) => {
  const token = req.cookies.token;
  const user = await userInfoModel.findOne({ access_token: token });
  if (!user) {
    res.status(401).json({ message: "unauthorized" });
  }
  oauth2Client.setCredentials({ refresh_token: user?.refersh_token });
  // Refresh the access token.
  const { credentials } = await oauth2Client.refreshAccessToken();
  oauth2Client.setCredentials(credentials);
  try {
    const response = await calendar.events.list({
      auth: oauth2Client,
      calendarId: "primary",
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = response.data.items;
    res.json(events);
  } catch (error) {
    console.error("Error retrieving events:", error);
    res.status(500).send("Error retrieving events");
  }
});
app.delete("/events/:eventId", async (req, res) => {
  const token = req.cookies.token;
  const user = await userInfoModel.findOne({ access_token: token });
  if (!user) {
    res.status(401).json({ message: "unauthorized" });
  }
  oauth2Client.setCredentials({ refresh_token: user?.refersh_token });
  // Refresh the access token.
  const { credentials } = await oauth2Client.refreshAccessToken();
  oauth2Client.setCredentials(credentials);
  const id: any = req.params.eventId;
  const eventId = id.substr(1);
  console.log(eventId);
  try {
    await calendar.events.delete({
      auth: oauth2Client,
      calendarId: "primary",
      eventId: eventId,
    });
    await History.create({
      event: "deletion",
      event_id: id,
    });
    res.send(`Event with ID ${eventId} deleted.`);
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).send("Error deleting event: " + error);
  }
});
app.post("/event", async (req, res) => {
  const token = req.cookies.token;
  const user = await userInfoModel.findOne({ access_token: token });
  if (!user) {
    res.status(401).json({ message: "unauthorized" });
  }
  oauth2Client.setCredentials({ refresh_token: user?.refersh_token });
  // Refresh the access token.
  const { credentials } = await oauth2Client.refreshAccessToken();
  oauth2Client.setCredentials(credentials);
  const { summary, description, attendees, dateTime, endTime } = req.body;
  console.log(dateTime);
  console.log(endTime);
  const event = {
    summary: summary,
    location: "800 Howard St., San Francisco, CA 94103",
    description: description,
    start: {
      dateTime: dateTime,
      timeZone: "Asia/Kolkata",
    },
    end: {
      dateTime: endTime,
      timeZone: "Asia/Kolkata",
    },
    attendees: attendees,
  };
  try {
    const d = await calendar.events.insert({
      auth: oauth2Client,
      calendarId: "primary",
      requestBody: event,
    });
    await History.create({
      event: "Event Insertion",
      event_id: d.data.id,
    });
    console.log(d);
    res.status(202).json({ message: "event created successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "something went wrong" });
  }
});
app.get("/user/info", async (req, res) => {
  console.log("request coming");
  const token = req.cookies.token;
  const user = await userInfoModel.findOne({ access_token: token });
  if (user) {
    oauth2Client.setCredentials({ refresh_token: user.refersh_token });
    // Refresh the access token.
    const { credentials } = await oauth2Client.refreshAccessToken();
    oauth2Client.setCredentials(credentials);
    console.log("getting req to get user info");
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });

    oauth2.userinfo.get((err, response) => {
      if (err) {
        console.log("Error");
        return res.status(500).send("The API returned an error: " + err);
      }
      const user = response?.data;
      return res.json({
        name: user?.name,
        email: user?.email,
        photo: user?.picture,
      });
    });
  } else {
    if (!user) {
      res.status(401).json({ message: "unauthorized" });
    }
  }
});
app.get("/history", async (req, res) => {
  try {
    const data = await History.find();
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "something went wrong" });
  }
});
app.delete("/history/:id", async (req, res) => {
  const id: any = req.params.id;
  const ff = id.substr(1);
  try {
    const dd = await History.findByIdAndDelete({ _id: ff });
    console.log(dd);
    res.status(202).json({ message: "deleted successfully" });
  } catch (err) {
    console.log(err);
  }
});
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
