export interface EmailTemplate {
  subject: string;
  html: (data: any) => string;
}
