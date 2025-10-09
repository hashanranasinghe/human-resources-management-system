// src/email/email.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export interface EmailTemplate {
  subject: string;
  html: (data: any) => string;
}

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private defaultFrom: string;

  constructor() {
    this.defaultFrom = process.env.FROM_EMAIL || 'noreply@yourapp.com';

    // Fix: Use createTransport instead of createTransporter
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  /**
   * Send a generic email
   */
  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: options.from || this.defaultFrom,
        to: options.to,
        subject: options.subject,
        html: options.html,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new InternalServerErrorException('Failed to send email');
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    const template = this.getEmailTemplate('password-reset');

    await this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html({ resetUrl }),
    });
  }

  /**
   * Send leave confirmation email
   */
  async sendLeaveConfirmationEmail(
    email: string,
    data: {
      employeeName: string;
      leaveType: string;
      startDate: string;
      endDate: string;
      status: 'approved' | 'rejected';
      reason?: string;
    },
  ): Promise<void> {
    const template = this.getEmailTemplate('leave-confirmation');

    await this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html(data),
    });
  }

  /**
   * Send welcome email to new employees
   */
  async sendWelcomeEmail(
    email: string,
    data: {
      employeeName: string;
      position: string;
      loginUrl: string;
    },
  ): Promise<void> {
    const template = this.getEmailTemplate('welcome');

    await this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html(data),
    });
  }

  /**
   * Get email template by type
   */
  private getEmailTemplate(type: string): EmailTemplate {
    const templates = {
      'password-reset': {
        subject: 'Password Reset Request',
        html: (data: { resetUrl: string }) => `
          <p>You requested a password reset.</p>
          <p>Click this <a href="${data.resetUrl}">link</a> to reset your password.</p>
          <p>This link will expire in 15 minutes.</p>
          <p>If you did not request this, please ignore this email.</p>
        `,
      },
      'leave-confirmation': {
        subject: 'Leave Request Update',
        html: (data: {
          employeeName: string;
          leaveType: string;
          startDate: string;
          endDate: string;
          status: 'approved' | 'rejected';
          reason?: string;
        }) => `
          <p>Dear ${data.employeeName},</p>
          <p>Your leave request has been ${data.status}.</p>
          <p>Leave Type: ${data.leaveType}</p>
          <p>Start Date: ${data.startDate}</p>
          <p>End Date: ${data.endDate}</p>
          ${data.reason ? `<p>Reason: ${data.reason}</p>` : ''}
          <p>Thank you,</p>
          <p>HR Department</p>
        `,
      },
      welcome: {
        subject: 'Welcome to Our Company!',
        html: (data: {
          employeeName: string;
          position: string;
          loginUrl: string;
        }) => `
          <p>Dear ${data.employeeName},</p>
          <p>Welcome to our company! We're excited to have you join our team as a ${data.position}.</p>
          <p>You can access your account at: <a href="${data.loginUrl}">${data.loginUrl}</a></p>
          <p>If you have any questions, please don't hesitate to reach out to the HR department.</p>
          <p>Best regards,</p>
          <p>HR Department</p>
        `,
      },
    };

    return (
      templates[type] || {
        subject: 'Notification',
        html: (data: any) => `<p>${JSON.stringify(data)}</p>`,
      }
    );
  }

  /**
   * Test email configuration
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('Email connection test failed:', error);
      return false;
    }
  }
}
