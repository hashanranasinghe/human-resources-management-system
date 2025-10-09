// src/email/email.controller.ts
import { Controller, Post, Body, Get } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get('test')
  async testConnection() {
    const isConnected = await this.emailService.testConnection();
    return {
      message: isConnected
        ? 'Email service is connected'
        : 'Failed to connect to email service',
      status: isConnected ? 'success' : 'error',
    };
  }

  @Post('send-password-reset')
  async sendPasswordReset(@Body() body: { email: string; token: string }) {
    await this.emailService.sendPasswordResetEmail(body.email, body.token);
    return { message: 'Password reset email sent successfully' };
  }

  @Post('send-leave-confirmation')
  async sendLeaveConfirmation(
    @Body()
    body: {
      email: string;
      employeeName: string;
      leaveType: string;
      startDate: string;
      endDate: string;
      status: 'approved' | 'rejected';
      reason?: string;
    },
  ) {
    await this.emailService.sendLeaveConfirmationEmail(body.email, body);
    return { message: 'Leave confirmation email sent successfully' };
  }

  @Post('send-welcome')
  async sendWelcomeEmail(
    @Body()
    body: {
      email: string;
      employeeName: string;
      position: string;
      loginUrl: string;
    },
  ) {
    await this.emailService.sendWelcomeEmail(body.email, body);
    return { message: 'Welcome email sent successfully' };
  }
}
