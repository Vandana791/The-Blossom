
// SIGNUP
async function signup() {
    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;
    const message = document.getElementById("signupMessage");

    if (name === "" || email === "" || password === "") {
        message.innerHTML = "Please fill all the fields.";
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();
        message.innerHTML = data.message;

    } catch (error) {
        message.innerHTML = "Cannot connect to server. Please try again.";
        console.error("Signup error:", error);
    }
}


// USER LOGIN
async function login() {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const message = document.getElementById("loginMessage");

    if (email === "" || password === "") {
        message.innerHTML = "Please enter email and password.";
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            message.innerHTML = data.message;

            localStorage.setItem("name", data.user.name);
            localStorage.setItem("email", data.user.email);
        } else {
            message.innerHTML = data.message;
        }

    } catch (error) {
        message.innerHTML = "Cannot connect to server. Please try again.";
        console.error("Login error:", error);
    }
}


// ADMIN LOGIN
function adminLogin() {
    const email = document.getElementById("adminEmail").value;
    const password = document.getElementById("adminPassword").value;
    const message = document.getElementById("adminMessage");

    if (email === "admin@bloosom.com" && password === "admin123") {
        message.innerHTML = "Admin Login Successful!";
    } else {
        message.innerHTML = "Invalid Admin Login.";
    }
}