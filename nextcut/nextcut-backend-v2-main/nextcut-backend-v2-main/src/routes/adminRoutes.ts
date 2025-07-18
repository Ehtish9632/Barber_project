import express, { Request, Response } from "express";
import nodemailer from "nodemailer";

const adminRouter = express.Router();

// Load environment variables
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;
const REGISTRATION_LINK = process.env.BARBER_REGISTRATION_LINK || "http://localhost:5173/barber/register/secret-signup-2024";

// POST /admin/send-barber-invite
adminRouter.post("/send-barber-invite", async (req: Request, res: Response) => {
  const { email, shopName } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: `NextCut Admin <${GMAIL_USER}>`,
      to: email,
      subject: "NextCut Barber Registration Link",
      html: `<p>Hello${shopName ? ` <b>${shopName}</b>,` : ","}</p>
        <p>Your barber shop has been approved for registration on NextCut.</p>
        <p>Please use the following link to complete your registration:</p>
        <p><a href="${REGISTRATION_LINK}">${REGISTRATION_LINK}</a></p>
        <p>If you did not request this, please ignore this email.</p>
        <br/><p>Best regards,<br/>NextCut Team</p>`
    };

    // Send email
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Invite sent successfully" });
  } catch (error) {
    console.error("Error sending invite email:", error);
    res.status(500).json({ error: "Failed to send invite email" });
  }
});

export default adminRouter; 