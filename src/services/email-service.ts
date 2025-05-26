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
}

export const emailService = EmailService.getInstance();
