import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Open CORS & No-Auth Middleware for public access
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  app.use(express.json({ limit: "1mb" }));

  // Initialize Gemini if API key is present
  let ai: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // API to handle RSVP acceptance and send email notification
  app.post("/api/send-rsvp", async (req, res) => {
    try {
      const {
        recipientEmail,
        herName = "Аня",
        date = "Суббота, 15 Августа в 19:00",
        location = "Уютный ресторан на крыше & прогулка",
        dressCode = "Удобная обувь и классное настроение",
        comment = "",
        timestamp = new Date().toLocaleString("ru-RU"),
      } = req.body;

      const defaultEmails = ["kolyaogre@gmail.com", "podaroqus@gmail.com"];
      let targetEmails = [...defaultEmails];
      if (recipientEmail) {
        const parsed = recipientEmail.split(",").map((e: string) => e.trim()).filter(Boolean);
        for (const em of parsed) {
          if (!targetEmails.includes(em)) {
            targetEmails.push(em);
          }
        }
      }

      let emailSent = false;

      // 1. Direct Real Email Delivery via FormSubmit HTTP API to all target emails
      for (const email of targetEmails) {
        try {
          const formSubmitResponse = await fetch(`https://formsubmit.co/ajax/${email}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
            body: JSON.stringify({
              _subject: `🎉 УРА! ${herName} сказала "ДА" на свидание! 💕`,
              _template: "table",
              _captcha: "false",
              "Решение": `${herName} сказала ДА! 🎉`,
              "Дата и время": date,
              "Место": location,
              "Дресс-код": dressCode,
              "Пожелания": comment || "Особых пожеланий нет",
              "Время ответа": timestamp,
            }),
          });

          if (formSubmitResponse.ok) {
            emailSent = true;
            console.log(`Real email dispatched via FormSubmit to ${email}`);
          }
        } catch (err) {
          console.warn(`FormSubmit email relay error for ${email}:`, err);
        }
      }

      // 2. Nodemailer SMTP Delivery if SMTP credentials exist
      if (!emailSent && process.env.SMTP_HOST && process.env.SMTP_USER) {
        try {
          const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || "587"),
            secure: process.env.SMTP_PORT === "465",
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          });

          await transporter.sendMail({
            from: `"Приглашение на свидание" <${process.env.SMTP_USER}>`,
            to: targetEmails.join(", "),
            subject: `🎉 УРА! ${herName} сказала "ДА" на свидание! 💕`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #fff0f3; padding: 24px; border-radius: 16px; border: 3px solid #ff4d6d;">
                <h1 style="color: #590d22; text-align: center;">🎉 УРА! Она сказала ДА! 💕</h1>
                <p style="text-align: center; font-size: 18px; font-weight: bold; color: #ff4d6d;">${herName} приняла приглашение!</p>
                <div style="background: white; padding: 16px; border-radius: 12px; margin-top: 16px;">
                  <p>📅 <strong>Дата:</strong> ${date}</p>
                  <p>📍 <strong>Место:</strong> ${location}</p>
                  <p>👗 <strong>Дресс-код:</strong> ${dressCode}</p>
                  ${comment ? `<p>💬 <strong>Пожелания:</strong> ${comment}</p>` : ""}
                </div>
              </div>
            `,
          });
          emailSent = true;
        } catch (smtpErr) {
          console.warn("SMTP email error:", smtpErr);
        }
      }

      return res.json({
        success: true,
        message: "Уведомление отправлено!",
        emailSent,
        targetEmails,
      });
    } catch (error: any) {
      console.error("Error processing RSVP:", error);
      return res.status(500).json({
        success: false,
        error: error.message || "Ошибка при отправке RSVP",
      });
    }
  });

  // Vite middleware for dev / Static serving for production
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    // Fallback for HTML index in dev mode
    app.get("*", async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(process.cwd(), "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        if (e instanceof Error) {
          vite.ssrFixStacktrace(e);
        }
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
