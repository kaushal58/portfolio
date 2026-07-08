import { Router } from "express";
import ContactMessage from "../models/ContactMessage.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const contact = await ContactMessage.create({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });

    res.status(201).json({
      message: "Message sent successfully!",
      id: contact._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to send message", error: error.message });
  }
});

router.get("/", async (_req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 }).lean();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch messages", error: error.message });
  }
});

export default router;
