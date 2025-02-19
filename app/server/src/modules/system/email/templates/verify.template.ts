import { MailTemplate } from "../main.ts";

export const verifyTemplate: MailTemplate = (data) => ({
  subject: "🔒 Verify your account - OpenHotel",
  text: `
    Please verify your account:\n\n${data.verifyUrl}
    
    If you did not request this email, you can ignore it.
    The OpenHotel Team
  `,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8"> 
      <style>
        .container { max-width: 600px; margin: 20px auto; padding: 20px; font-family: Arial, sans-serif; }
        .header { color: #2F3133; font-size: 24px; border-bottom: 1px solid #EDEFF2; padding-bottom: 10px; text-align: center; }
        .content { margin: 20px 0; color: #444; line-height: 1.6; }
        .button { 
          display: inline-block; 
          background-color: #007BFF; 
          color: white !important; 
          padding: 12px 25px; 
          border-radius: 5px; 
          text-decoration: none;
          font-weight: bold;
        }
        .footer { 
          margin-top: 20px; 
          padding-top: 20px; 
          border-top: 1px solid #EDEFF2; 
          color: #9BA6B2; 
          font-size: 12px;
        }
        .social-icons {
          margin-bottom: 10px;
        }
        .social-icons a {
          margin: 0 5px;
          display: inline-block;
        }
        .social-icons img {
          width: 24px;
          height: 24px;
          aspect-ratio: auto;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <a href="https://openhotel.club"><img src="https://avatars.githubusercontent.com/u/173081147?s=400&v=4" alt="OpenHotel Logo" width="150"></a>
          <h1>Verify your account</h1>
        </div>
        
        <div class="content">
          <p>Thank you for signing up for OpenHotel!</p>
          <p>To complete your registration, please click the button below to verify your email address:</p>
          
          <p style="text-align: center; margin: 40px 0;">
            <a href="${data.verifyUrl}" class="button">VERIFY ACCOUNT</a>
          </p>
          
          <p>If the button does not work, copy and paste the following URL into your browser:</p>
          <p><a href="${data.verifyUrl}">${data.verifyUrl}</a></p>
          
          <p><em>This link will expire in 24 hours.</em></p>
        </div>
        
        <div class="footer">
          <p>If you did not request this verification, you can ignore this message.</p>
          <div class="social-icons">
            <a href="https://bsky.app/profile/openhotel.club" target="_blank">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Bluesky_logo.svg/1200px-Bluesky_logo.svg.png" alt="Bluesky">
            </a>
            <a href="https://discord.gg/qBZfPdNWUj" target="_blank">
              <img src="https://cdn.ffprod.website-files.com/6257adef93867e50d84d30e2/636e0a6ac3c481f273141736_icon_clyde_black_RGB.png" alt="Discord">
            </a>
            <a href="https://github.com/openhotel" target="_blank">
              <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" alt="GitHub">
            </a>
          </div>
          <p>© ${new Date().getFullYear()} OpenHotel. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `,
});
