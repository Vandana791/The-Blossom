
import { useState } from "react";
import "./App.css";

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("Please wait...");
    setProfile(null);

    const url = isLogin
      ? "http://localhost:5000/api/login"
      : "http://localhost:5000/api/signup";

    const body = isLogin
      ? { email, password }
      : { name, email, password };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);

        if (isLogin && data.token && data.user) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("name", data.user.name);
          localStorage.setItem("email", data.user.email);
        }

        if (!isLogin) {
          setName("");
          setPassword("");
        }
      } else {
        setMessage(data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Cannot connect to backend. Please try again.");
    }
  }

  async function getProfile() {
    setMessage("Loading profile...");
    setProfile(null);

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please log in first.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/profile",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setProfile(data.user);
        setMessage(data.message);
      } else {
        setMessage(data.message || "Unable to get profile.");

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
        }
      }
    } catch (error) {
      console.error(error);
      setMessage("Cannot connect to backend.");
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("email");

    setProfile(null);
    setMessage("Logged out successfully.");
    setIsLogin(true);
    setName("");
    setEmail("");
    setPassword("");
  }

  function switchForm() {
    setIsLogin(!isLogin);
    setName("");
    setEmail("");
    setPassword("");
    setMessage("");
    setProfile(null);
  }

  return (
    <div className="container">
      <div className="form-box">
        <h1>The Bloosom Art Gallery</h1>

        <h2>{isLogin ? "Login" : "Sign Up"}</h2>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <button type="submit">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p>{message}</p>

        {isLogin && (
          <>
            <button type="button" onClick={getProfile}>
              View Profile
            </button>

            <button type="button" onClick={logout}>
              Logout
            </button>
          </>
        )}

        {profile && (
          <div>
            <h3>My Profile</h3>
            <p>Name: {profile.name}</p>
            <p>Email: {profile.email}</p>
          </div>
        )}

        <p>
          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}

          <button
            type="button"
            className="switch-button"
            onClick={switchForm}
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default App