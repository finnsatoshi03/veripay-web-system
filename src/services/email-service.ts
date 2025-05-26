import { supabase } from "./supabase";

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export interface WelcomeEmailData {
  firstName: string;
  lastName: string;
  email: string;
  temporaryPassword?: string;
  resetToken?: string;
  companyName?: string;
}

export interface PasswordResetData {
  firstName: string;
  email: string;
  resetToken: string;
  resetUrl: string;
}

export interface AccountApprovalData {
  firstName: string;
  lastName: string;
  email: string;
  status: "approved" | "rejected";
  welcomeUrl?: string;
  rejectionReason?: string;
}

// Email service class for handling all email operations
export class EmailService {
  private static instance: EmailService;

  private constructor() {}

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  // Send welcome email for new employees (HR Portal)
  async sendWelcomeEmail(data: WelcomeEmailData): Promise<void> {
    try {
      const { error } = await supabase.functions.invoke("send-welcome-email", {
        body: {
          to: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          temporaryPassword: data.temporaryPassword,
          resetToken: data.resetToken,
          companyName: data.companyName || "Veripay",
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error sending welcome email:", error);
      throw new Error("Failed to send welcome email");
    }
  }

  // Send password reset email
  async sendPasswordResetEmail(data: PasswordResetData): Promise<void> {
    try {
      const { error } = await supabase.functions.invoke("send-password-reset", {
        body: {
          to: data.email,
          firstName: data.firstName,
          resetToken: data.resetToken,
          resetUrl: data.resetUrl,
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error sending password reset email:", error);
      throw new Error("Failed to send password reset email");
    }
  }

  // Send account approval/rejection notification
  async sendAccountApprovalEmail(data: AccountApprovalData): Promise<void> {
    try {
      const { error } = await supabase.functions.invoke(
        "send-account-approval",
        {
          body: {
            to: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            status: data.status,
            welcomeUrl: data.welcomeUrl,
            rejectionReason: data.rejectionReason,
          },
        },
      );

      if (error) throw error;
    } catch (error) {
      console.error("Error sending account approval email:", error);
      throw new Error("Failed to send account approval email");
    }
  }

  // Send email verification
  async sendEmailVerification(
    email: string,
    verificationToken: string,
  ): Promise<void> {
    try {
      const verificationUrl = `${window.location.origin}/verify-email?token=${verificationToken}`;

      const { error } = await supabase.functions.invoke(
        "send-email-verification",
        {
          body: {
            to: email,
            verificationToken,
            verificationUrl,
          },
        },
      );

      if (error) throw error;
    } catch (error) {
      console.error("Error sending email verification:", error);
      throw new Error("Failed to send email verification");
    }
  }
}

export const emailService = EmailService.getInstance();
