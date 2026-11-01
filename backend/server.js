
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

// JWT secret for this local project
const JWT_SECRET =
    process.env.JWT_SECRET || "blossom_local_secret_change_before_deployment";

app.use(cors());
app.use(express.json());

// User data file
const dataFolder = path.join(__dirname, "data");
const usersFile = path.join(dataFolder, "users.json");

// Create data folder and file if they do not exist
if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder, { recursive: true });
}

if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, JSON.stringify([]));
}

// Read users
function readUsers() {
    return JSON.parse(fs.readFileSync(usersFile, "utf8"));
}

// Save users
function saveUsers(users) {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// Test route
app.get("/", (req, res) => {
    res.send("The Bloosom Art Gallery Backend is Running!");
});

// SIGNUP API
app.post("/api/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please fill all the fields."
            });
        }

        const users = readUsers();
        const cleanEmail = email.trim().toLowerCase();

        const existingUser = users.find(
            user => user.email.toLowerCase() === cleanEmail
        );

        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            id: Date.now().toString(),
            name: name.trim(),
            email: cleanEmail,
            password: hashedPassword
        };

        users.push(newUser);
        saveUsers(users);

        return res.status(201).json({
            message: "Signup Successful!"
        });

    } catch (error) {
        console.error("Signup error:", error);

        return res.status(500).json({
            message: "Something went wrong during signup."
        });
    }
});

// LOGIN API
app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please enter email and password."
            });
        }

        const users = readUsers();

        const user = users.find(
            user => user.email === email.trim().toLowerCase()
        );

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            JWT_SECRET,
            { expiresIn: "2h" }
        );

        return res.json({
            message: "Login Successful!",
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Something went wrong during login."
        });
    }
});

// Authentication middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Please log in to access your profile."
        });
    }

    jwt.verify(token, JWT_SECRET, (error, user) => {
        if (error) {
            return res.status(403).json({
                message: "Invalid or expired token. Please log in again."
            });
        }

        req.user = user;
        next();
    });
}

// PROFILE API
app.get("/api/profile", authenticateToken, (req, res) => {
    try {
        const users = readUsers();

        const user = users.find(
            user => user.id === req.user.id
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        return res.json({
            message: "Profile fetched successfully!",
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Profile error:", error);

        return res.status(500).json({
            message: "Could not fetch profile."
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
