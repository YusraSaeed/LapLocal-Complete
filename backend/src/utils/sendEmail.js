// import nodemailer from "nodemailer";

// export const sendEmail = async ({ to, subject, text }) => {
//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,          // e.g. smtp.gmail.com
//     port: process.env.EMAIL_PORT,          // usually 465 or 587
//     secure: process.env.EMAIL_SECURE === "true", // true for 465, false for 587
//     auth: {
//       user: process.env.EMAIL_USER,       // your email
//       pass: process.env.EMAIL_PASS        // app password
//     }
//   });

//   const info = await transporter.sendMail({
//     from: `"LapLocal Support" <${process.env.EMAIL_USER}>`,
//     to,
//     subject,
//     text,
//   });

//   console.log(`📧 Email sent: ${info.messageId}`);
// };

// // the email went into spam folder what to do so that it goes to inbox
import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === "true", // true for 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"LapLocal Support" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`📧 Email sent: ${info.messageId}`);
};
