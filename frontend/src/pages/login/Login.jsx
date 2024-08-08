import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { FacebookButton, GoogleButton } from "../authButtons/AuthButtons";
import InputField from "../inputField/InputField";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [touched, setTouched] = useState({
    email: false,
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

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value.trim() === "") return "Email is required";
        if (!emailRegex.test(value)) return "Enter a valid email address";
        break;
      case "password":
        const passwordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (value.trim() === "") return "Password is required";
        if (!passwordRegex.test(value))
          return "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character";
        break;

      default:
        break;
    }
    return "";
  };

  const handleChangeData = (name, value) => {
    setTouched({ ...touched, [name]: true });
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    handleChangeData(name, value);
  };

  return (
    <div className="container-fluid px-1 py-5 mx-auto">
      <div className="row d-flex justify-content-center">
        <div className="col-xl-7 col-lg-8 col-md-9 col-11 text-center">
          <h3>Login</h3>
          <div className="card">
            <form className="form-card" onSubmit={handleSubmit}>
              <div className="row justify-content-between text-left">
                <InputField
                  lable={"Email"}
                  type={"text"}
                  id={"email"}
                  name={"email"}
                  value={formData.email}
                  onChange={(e) =>
                    handleChangeData(e.target.name, e.target.value)
                  }
                  onBlur={handleBlur}
                  touched={touched.email}
                  errors={errors.email}
                />
              </div>

              <InputField
                lable={"Password"}
                type={"password"}
                id={"password"}
                name={"password"}
                value={formData.password}
                onChange={(e) =>
                  handleChangeData(e.target.name, e.target.value)
                }
                onBlur={handleBlur}
                touched={touched.password}
                errors={errors.password}
              />

              <div className="row justify-content-end">
                <div className="form-group col-sm-6">
                  <button type="submit" className="btn-block bg-primary">
                    Login
                  </button>
                </div>

                <div className="col-12 col-lg-5 d-flex align-items-center">
                  <div className="d-flex gap-3 flex-column w-100 ">
                    <GoogleButton />
                    <FacebookButton />
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

export default Login;
