import nodemailer from "nodemailer";

export const sendWelcomeEmail = async (
  name: string,
  email: string,
  password: string,
) => {
  // Create a transporter object using the default SMTP transport
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NEXT_PUBLIC_EMAIL, // Replace with your Gmail address
        pass: process.env.NEXT_PUBLIC_EMAIL_APP_PASSWORD, // Replace with your Gmail password or app-specific password
      },
    });

    // Set up email data
    const mailOptions = {
      from: '"PhilaPrints" <info@info@philadelphiascreenprinting.com>', // Replace with your email
      to: email,
      subject: "Welcome to PhilaPrints " + name + "!",
      text: "Thank you for joining PhilaPrints. We are excited to have you!",
      html:
        "<b>Thank you for joining PhilaPrints. We are excited to have you!</b> <br/> <p>Your temporary password is: " +
        password +
        "</p><br/>" +
        "<p> Please login to your account and change your password as soon as possible.</p>" +
        `<p> <a href="${process.env.NEXT_PUBLIC_API_BASE_URL}/chat">Login to your account</a> </p>`,
    };

    // Send mail with defined transport object
    const info = await transporter.sendMail(mailOptions);

  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};
