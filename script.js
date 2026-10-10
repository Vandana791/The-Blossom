// SIGNUP

function signup() {

    let name = document.getElementById("signupName").value;
    let email = document.getElementById("signupEmail").value;
    let password = document.getElementById("signupPassword").value;

    if (name === "" || email === "" || password === "") {

        document.getElementById("signupMessage").innerHTML =
            "Please fill all the fields.";

        return;
    }

    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);

    document.getElementById("signupMessage").innerHTML =
        "Signup Successful!";
}


// USER LOGIN

function login() {

    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;

    let savedEmail = localStorage.getItem("email");
    let savedPassword = localStorage.getItem("password");

    if (email === savedEmail && password === savedPassword) {

        document.getElementById("loginMessage").innerHTML =
            "Login Successful!";

    } else {

        document.getElementById("loginMessage").innerHTML =
            "Invalid email or password.";

    }
}


// ADMIN LOGIN

function adminLogin() {

    let email = document.getElementById("adminEmail").value;
    let password = document.getElementById("adminPassword").value;

    if (email === "admin@bloosom.com" && password === "admin123") {

        document.getElementById("adminMessage").innerHTML =
            "Admin Login Successful!";

    } else {

        document.getElementById("adminMessage").innerHTML =
            "Invalid Admin Login.";

    }
}