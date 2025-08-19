import { createTransport } from "nodemailer";

const sender = async (email, subject, text) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // required for port 465
    auth: {
      user: process.env.GMAIL,
      pass: process.env.PASSWORD,
    },
  });

  await transport.sendMail({
    from: process.env.GMAIL, // ✅ FIXED: Was GAMIL
    to: email,
    subject,
    text,
  });
};

export default sender;
