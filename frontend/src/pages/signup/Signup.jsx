import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
    password: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formHasErrors = Object.values(errors).some((error) => error !== "");
    if (formHasErrors) {
      return;
    }
    console.log("user registration data", formData);
  };

  const handleChangeData = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "name") {
      if (value.trim() === "") {
        setErrors({ ...errors, [name]: "Name is required" });
      } else if (value.trim().length < 3) {
        setErrors({ ...errors, [name]: "Should have at least 3 characters" });
      } else {
        setErrors({ ...errors, [name]: "" });
      }
    } else if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value.trim() === "") {
        setErrors({ ...errors, [name]: "Email is required" });
      } else if (!emailRegex.test(value)) {
        setErrors({ ...errors, [name]: "Enter a valid email address" });
      } else {
        setErrors({ ...errors, [name]: "" });
      }
    } else if (name === "password") {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
      if (value.trim() === "") {
        setErrors({ ...errors, [name]: "Password is required" });
      } else if (!passwordRegex.test(value)) {
        setErrors({
          ...errors,
          [name]:
            "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
        });
      } else {
        setErrors({ ...errors, [name]: "" });
      }
    } else if (name === "phone") {
      const phoneRegex = /^[0-9]*$/;
      if (value.trim() === "") {
        setErrors({ ...errors, [name]: "Phone number is required" });
      } else if (!phoneRegex.test(value)) {
        setErrors({ ...errors, [name]: "Please enter a valid phone number" });
      } else if (value.trim().length < 10 || value.trim().length > 10) {
        setErrors({
          ...errors,
          [name]: "Phone number must be exactly 10 digits",
        });
      } else {
        setErrors({ ...errors, [name]: "" });
      }
    }
  };

  const handlePhoneChange = (value) => {
    setTouched({ ...touched, phone: true });
    setFormData((prev) => ({ ...prev, phone: value }));

    const phoneRegex = /^[0-9]*$/;
    if (value.trim() === "") {
      setErrors({ ...errors, phone: "Phone number is required" });
    } else if (!phoneRegex.test(value)) {
      setErrors({ ...errors, phone: "Please enter a valid phone number" });
    } else if (value.trim().length !== 12) {
      setErrors({ ...errors, phone: "Phone number must be exactly 10 digits" });
    } else {
      setErrors({ ...errors, phone: "" });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    handleChangeData(e);
  };

  const handleGoogleAuth = () => {
    window.location.href = "http://localhost:8080/auth/google";
  };

  const handleFacebookAuth = () => {
    window.location.href = "http://localhost:8080/auth/facebook";
  };

  return (
    <div className="container-fluid px-1 py-5 mx-auto">
      <div className="row d-flex justify-content-center">
        <div className="col-xl-7 col-lg-8 col-md-9 col-11 text-center">
          <h3>Sign Up</h3>
          <div className="card">
            <form className="form-card" onSubmit={handleSubmit}>
              <div className="row justify-content-between text-left">
                <div className="form-group col-sm-6 flex-column d-flex">
                  <label className="form-control-label px-3">
                    First name<span className="text-danger"> *</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    placeholder="Enter your first name"
                    onChange={handleChangeData}
                    onBlur={handleBlur}
                    required
                  />
                  {touched.name && errors.name && (
                    <span className="text-danger">{errors.name}</span>
                  )}
                </div>
              </div>
              <div className="row justify-content-between text-left">
                <div className="form-group col-sm-6 flex-column d-flex">
                  <label className="form-control-label px-3">
                    Email<span className="text-danger"> *</span>
                  </label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChangeData}
                    onBlur={handleBlur}
                    required
                  />
                  {touched.email && errors.email && (
                    <span className="text-danger">{errors.email}</span>
                  )}
                </div>
                <div className="form-group col-sm-6 flex-column d-flex">
                  <label className="form-control-label px-3">
                    Phone number<span className="text-danger"> *</span>
                  </label>
                  <PhoneInput
                    country={"in"}
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    localization={"in"}
                  />
                  {touched.phone && errors.phone && (
                    <span className="text-danger">{errors.phone}</span>
                  )}
                </div>
              </div>
              <div className="row justify-content-between text-left">
                <div className="form-group col-sm-6 flex-column d-flex">
                  <label className="form-control-label px-3">
                    Password<span className="text-danger"> *</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChangeData}
                    onBlur={handleBlur}
                    required
                  />
                  {touched.password && errors.password && (
                    <span className="text-danger">{errors.password}</span>
                  )}
                </div>
              </div>
              <div className="row justify-content-end">
                <div className="form-group col-sm-6">
                  <button type="submit" className="btn-block bg-primary">
                    Signup
                  </button>
                  {/* <button
                    type="button"
                    className="btn btn-warning text-dark"
                    onClick={handleGoogleAuth}
                  >
                    Signup with Google
                  </button> */}
                  {/* <button onClick={handleGoogleAuthLogout}>
                    Logout with google
                  </button> */}
                  {/* <button
                    type="button"
                    onClick={handleFacebookAuth}
                    className="btn-block btn btn-primary"
                  >
                    Signup with Facebook
                  </button> */}
                </div>

                <div className="col-12 col-lg-5 d-flex align-items-center">
                  <div className="d-flex gap-3 flex-column w-100 ">
                    <button
                      onClick={handleGoogleAuth}
                      className="btn btn-lg btn-danger"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-google"
                        viewBox="0 0 16 16"
                      >
                        <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
                      </svg>
                      <span className="ms-2 fs-6">Sign in with Google</span>
                    </button>
                    <button
                      onClick={handleFacebookAuth}
                      className="btn btn-lg btn-primary"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-facebook"
                        viewBox="0 0 16 16"
                      >
                        <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                      </svg>
                      <span className="ms-2 fs-6">Sign in with Facebook</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
