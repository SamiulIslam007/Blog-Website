import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  trustedOrigins: [process.env.FRONTEND_URL!],

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

        const info = await transporter.sendMail({
          from: '"Prisma Blog App" <prismablog@ph.email>',
          to: user.email,
          subject: "Verify your email address - Prisma Blog App",
          text: `Verify your email by clicking here: ${verifyUrl}`, // Plain-text version of the message
          html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
      <style>
        body { margin: 0; padding: 0; background-color: #f4f4f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden; }
        .header { background-color: #2563eb; padding: 30px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; }
        .content { padding: 40px 30px; color: #334155; line-height: 1.6; }
        .button-container { text-align: center; margin: 30px 0; }
        .button { background-color: #2563eb; color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2); transition: background-color 0.3s; }
        .button:hover { background-color: #1d4ed8; }
        .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
        .link-text { color: #2563eb; word-break: break-all; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Prisma Blog App</h1>
        </div>

        <div class="content">
          <h2 style="margin-top: 0; color: #1e293b;">Hello, ${
            user.name || "User"
          }! 👋</h2>
          <p>Thanks for joining <strong>Prisma Blog App</strong>. To complete your registration and start sharing your thoughts, please verify your email address.</p>
          
          <div class="button-container">
            <a href="${verifyUrl}" class="button">Verify Email Now</a>
          </div>

          <p>If the button above doesn't work, simply copy and paste the following link into your browser:</p>
          <p><a href="${verifyUrl}" class="link-text">${verifyUrl}</a></p>
          
          <p>This link will expire in <b>1 hour</b>.</p>
          <p>Best regards,<br>The Prisma Blog Team</p>
        </div>

        <div class="footer">
          <p>You received this email because you signed up for Prisma Blog App.</p>
          <p>&copy; ${new Date().getFullYear()} Prisma Blog App. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `,
        });

        console.log("Message sent:", info.messageId);
      } catch (error) {
        console.error("Error sending verification email:", error);
        throw error;
      }
    },
  },
});
