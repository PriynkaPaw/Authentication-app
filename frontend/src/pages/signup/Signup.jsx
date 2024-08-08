import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { FacebookButton, GoogleButton } from "../authButtons/AuthButtons";
import InputField from "../inputField/InputField";

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

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (value.trim() === "") return "Name is required";
        if (value.trim().length < 3) return "Should have at least 3 characters";
        break;
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
      case "phone":
        const phoneRegex = /^[0-9]{10}$/;
        if (value.trim() === "") return "Phone number is required";
        if (!phoneRegex.test(value))
          return "Please enter a valid 10-digit phone number";
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

  const handlePhoneChange = (value) => {
    handleChangeData("phone", value);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    handleChangeData(name, value);
  };

  return (
    <div className="container-fluid px-1 py-5 mx-auto">
      <div className="row d-flex justify-content-center">
        <div className="col-xl-7 col-lg-8 col-md-9 col-11 text-center">
          <h3>Sign Up</h3>
          <div className="card">
            <form className="form-card" onSubmit={handleSubmit}>
              <InputField
                lable={"Name"}
                type={"text"}
                id={"name"}
                name={"name"}
                value={formData.name}
                onChange={(e) =>
                  handleChangeData(e.target.name, e.target.value)
                }
                onBlur={handleBlur}
                touched={touched.name}
                errors={errors.name}
              />

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
                    Signup
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

export default Signup;
