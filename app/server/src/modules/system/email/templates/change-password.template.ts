import { MailTemplate } from "../main.ts";
import { getBaseTemplate } from "./main.ts";

export const changePasswordTemplate: MailTemplate = (data) => ({
  subject: "[OpenHotel] - 🔒Reset your password",
  text: `
    You requested to reset your password:\n\n${data.verifyUrl}
    
    If you did not request this change, you can ignore this email.
    The OpenHotel Team
  `,
  html: getBaseTemplate({
    title: "Reset your password",
    body: `
      <p>We received a request to reset your password for OpenHotel.</p>
      <p>Click the button below to set a new password:</p>

      <p style="text-align: center; margin: 40px 0;">
        <a href="${data.verifyUrl}" class="button">RESET PASSWORD</a>
      </p>

      <p>If the button does not work, copy and paste the following URL into your browser:</p>
      <p><a href="${data.verifyUrl}">${data.verifyUrl}</a></p>

      <p><em>This link will expire in 1 hour.</em></p>
    `,
  }),
});
