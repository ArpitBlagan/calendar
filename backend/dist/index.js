"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_session_1 = __importDefault(require("express-session"));
const mongoose_1 = __importDefault(require("mongoose"));
const googleapis_1 = require("googleapis");
dotenv_1.default.config();
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const user_1 = require("./schema/user");
const app = (0, express_1.default)();
app.use(express_1.default.json());
mongoose_1.default
    .connect("mongodb+srv://Arpit:Ab123@cluster0.j4fl22k.mongodb.net/assignment")
    .then((con) => {
    console.log("connnected");
});
app.use((0, express_session_1.default)({
    secret: "your_secret",
    resave: false,
    saveUninitialized: true,
}));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173"],
    credentials: true,
}));
const oauth2Client = new googleapis_1.google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, "http://localhost:8000/auth/google/callback");
const calendar = googleapis_1.google.calendar({ version: "v3", auth: process.env.API_KEY });
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
app.get("/auth/google/callback", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const code = req.query.code;
    //@ts-ignore
    const { tokens } = yield oauth2Client.getToken(code);
    if (tokens.access_token && tokens.refresh_token) {
        try {
            const ff = yield user_1.userInfoModel.create({
                access_token: tokens.access_token,
                refersh_token: tokens.refresh_token,
            });
            console.log("created successfully");
        }
        catch (err) {
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
    res.redirect("http://localhost:5173");
}));
app.get("/events", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.token;
    const user = yield user_1.userInfoModel.findOne({ access_token: token });
    if (!user) {
        res.redirect("http://localhost:5173/login");
    }
    oauth2Client.setCredentials({ refresh_token: user === null || user === void 0 ? void 0 : user.refersh_token });
    // Refresh the access token.
    const { credentials } = yield oauth2Client.refreshAccessToken();
    oauth2Client.setCredentials(credentials);
    try {
        const response = yield calendar.events.list({
            auth: oauth2Client,
            calendarId: "primary",
            singleEvents: true,
            orderBy: "startTime",
        });
        const events = response.data.items;
        res.json(events);
    }
    catch (error) {
        console.error("Error retrieving events:", error);
        res.status(500).send("Error retrieving events");
    }
}));
app.delete("/events/:eventId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.token;
    const user = yield user_1.userInfoModel.findOne({ access_token: token });
    if (!user) {
        res.redirect("http://localhost:5173/login");
    }
    oauth2Client.setCredentials({ refresh_token: user === null || user === void 0 ? void 0 : user.refersh_token });
    // Refresh the access token.
    const { credentials } = yield oauth2Client.refreshAccessToken();
    oauth2Client.setCredentials(credentials);
    const id = req.params.eventId;
    const eventId = id.substr(1);
    console.log(eventId);
    try {
        yield calendar.events.delete({
            auth: oauth2Client,
            calendarId: "primary",
            eventId: eventId,
        });
        res.send(`Event with ID ${eventId} deleted.`);
    }
    catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).send("Error deleting event: " + error);
    }
}));
app.post("/event", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.token;
    const user = yield user_1.userInfoModel.findOne({ access_token: token });
    if (!user) {
        res.redirect("http://localhost:5173/login");
    }
    oauth2Client.setCredentials({ refresh_token: user === null || user === void 0 ? void 0 : user.refersh_token });
    // Refresh the access token.
    const { credentials } = yield oauth2Client.refreshAccessToken();
    oauth2Client.setCredentials(credentials);
    const { summary, description, attendees, dateTime, endTime } = req.body;
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
        const d = yield calendar.events.insert({
            auth: oauth2Client,
            calendarId: "primary",
            requestBody: event,
        });
        console.log(d);
        res.status(202).json({ message: "event created successfully" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "something went wrong" });
    }
}));
app.get("/user/info", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("request coming");
    const token = req.cookies.token;
    const user = yield user_1.userInfoModel.findOne({ access_token: token });
    if (user) {
        oauth2Client.setCredentials({ refresh_token: user.refersh_token });
        // Refresh the access token.
        const { credentials } = yield oauth2Client.refreshAccessToken();
        oauth2Client.setCredentials(credentials);
        console.log("getting req to get user info");
        const oauth2 = googleapis_1.google.oauth2({
            auth: oauth2Client,
            version: "v2",
        });
        oauth2.userinfo.get((err, response) => {
            if (err) {
                console.log("Error");
                return res.status(500).send("The API returned an error: " + err);
            }
            const user = response === null || response === void 0 ? void 0 : response.data;
            return res.json({
                name: user === null || user === void 0 ? void 0 : user.name,
                email: user === null || user === void 0 ? void 0 : user.email,
                photo: user === null || user === void 0 ? void 0 : user.picture,
            });
        });
    }
    else {
        res.redirect("http://localhost:5173/login");
    }
}));
app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
});
