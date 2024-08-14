import React, { useState, useEffect } from "react";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState("");
  const [codeRequested, setCodeRequested] = useState(false);
  const [qrImage, setQrImage] = useState(null);
  const [twoFAReady, setTwoFAReady] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    password: "",
    code: "",
  });

  const checkSession = async () => {
    try {
      const response = await fetch("http://localhost:3000/check", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("response data: ", data);

      const { success, id } = data;

      setLoggedIn(success);
      if (success) {
        setUserId(id);
      } else {
        setUserId("");
      }
    } catch (error) {
      console.error("Error during session check:", error);
      setLoggedIn(false);
      setUserId("");
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/logout", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        await checkSession();
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      console.log("response", response);

      if (!response.ok) throw new Error("Login request failed");
      const { success, error, codeRequested } = await response.json();

      if (codeRequested) {
        setCodeRequested(true);
      } else if (success) {
        e.target.reset();
        setFormData({ id: "", password: "", code: "" });
        await checkSession();
      } else {
        alert(error);
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login. Please try again.");
    }
  };

  const handleEnable2FA = async () => {
    const response = await fetch("http://localhost:3000/qrImage", {
      method: "GET",
      credentials: "include",
    });

    console.log("response: ", response);

    const { image, success } = await response.json();
    if (success) {
      setQrImage(image);
      setTwoFAReady(true);
    } else {
      alert("Unable to fetch the QR image");
    }
  };

  const handle2FAUpdate = async (e) => {
    e.preventDefault();
    const code = e.target.code.value;
    console.log("code: ", code);
    const response = await fetch("http://localhost:3000/set2FA", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });
    const { success } = await response.json();
    if (success) {
      alert("SUCCESS: 2FA enabled/updated");
    } else {
      alert("ERROR: Unable to update/enable 2FA");
    }
    e.target.reset();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div
      className={`w-screen h-screen flex flex-col items-center justify-center bg-lightblue`}
    >
      {!loggedIn ? (
        <div
          id="loginPage"
          className="w-full h-full flex flex-col items-center justify-center"
        >
          <form
            className="flex flex-col gap-3 w-72"
            id="loginForm"
            onSubmit={handleLogin}
          >
            <h1 className="text-center">Login</h1>
            <input
              className="form-control"
              name="id"
              type="text"
              placeholder="ID"
              value={formData.id}
              onChange={handleInputChange}
            />
            <input
              className="form-control"
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
            />
            {codeRequested && (
              <div className="code">
                <input
                  type="text"
                  className="form-control"
                  name="code"
                  placeholder="2 FA Code"
                  value={formData.code}
                  onChange={handleInputChange}
                />
                <p className="text-center mb-0 text-muted">
                  Please type in the 2 FA Code
                </p>
              </div>
            )}
            <button className="btn btn-primary" type="submit">
              LOGIN
            </button>
          </form>
        </div>
      ) : (
        <div
          id="homePage"
          className="w-full h-full flex flex-col items-center justify-center"
        >
          <div>
            <h4 className="text-center">
              Welcome, <span id="userId">{userId}</span>
            </h4>
          </div>
          <button
            id="logoutButton"
            className="btn btn-danger"
            onClick={handleLogout}
          >
            LOGOUT
          </button>
          <div className="border-b border-dark pt-4 mb-4"></div>
          <div id="2FABox" className="flex flex-col items-center gap-3">
            <button
              id="enable2FAButton"
              className="btn btn-success"
              onClick={handleEnable2FA}
            >
              UPDATE/ENABLE 2FA
            </button>
            {twoFAReady && (
              <div
                id="twoFAFormHolder"
                className="flex flex-col items-center gap-3"
              >
                <img
                  id="qrImage"
                  src={qrImage}
                  height="150"
                  width="150"
                  alt="QR Code"
                />
                <form
                  id="twoFAUpdateForm"
                  className="flex flex-col gap-2"
                  onSubmit={handle2FAUpdate}
                >
                  <input
                    type="text"
                    name="code"
                    placeholder="2 FA Code"
                    className="form-control"
                  />
                  <button className="btn btn-primary" type="submit">
                    SET
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
