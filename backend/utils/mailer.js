import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (to, otp) => {
  console.log("otp: ", otp);
  console.log("to: ", to);
  const mailOptions = {
    from: `"Testing" <jensen11@ethereal.email>`,
    to,
    subject: "Confirm your Email Address",
    html: `<h1>Please confirm your OTP</h1>
      <p>Here is your OTP code: ${otp}</p>`,
  };
  console.log("mailOptions: ", mailOptions);

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export default sendEmail;
