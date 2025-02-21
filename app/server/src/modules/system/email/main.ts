import { System } from "../main.ts";
import nodemailer from "nodemailer";
import { changePasswordTemplate, verifyTemplate } from "./templates/main.ts";
import { getHiddenMail } from "shared/utils/mail.utils.ts";

export enum MailTypes {
  VERIFY,
  CHANGE_PASSWORD,
}

export type MailTemplate = (data: any) => {
  subject: string;
  text: string;
  html: string;
};

const mailTemplates: Record<MailTypes, MailTemplate> = {
  [MailTypes.VERIFY]: verifyTemplate,
  [MailTypes.CHANGE_PASSWORD]: changePasswordTemplate,
};

export const email = () => {
  let transporter;
  const $loadTransporter = (currentResolve?: () => void) =>
    new Promise<void>((resolve, reject) => {
      const {
        email: { enabled, hostname, port, username, password },
      } = System.getConfig();

      if (!enabled) return resolve();

      transporter = nodemailer.createTransport({
        host: hostname,
        port,
        secure: true, // use TLS
        auth: {
          user: username,
          pass: password,
        },
        tls: {
          // do not fail on invalid certs
          rejectUnauthorized: false,
        },
      });
      const targetResolve = currentResolve ?? resolve;
      transporter.verify((error, success) => {
        console.error(error);
        if (error) {
          console.error("Error loading email transporter!");
          $loadTransporter(targetResolve);
          return;
        }
        console.error("Email transporter loaded!");
        targetResolve();
      });
    });

  const load = async () => {
    await $loadTransporter();
  };

  const send = async (mailType: MailTypes, to: string, data: any) => {
    return new Promise<void>((resolve) => {
      const $send = async () => {
        const hiddenEmail = getHiddenMail(to);
        try {
          const {
            email: { enabled, username },
          } = System.getConfig();

          if (!enabled) return resolve();

          const template = mailTemplates[mailType];
          if (!template) {
            console.error(
              `Email error to ${hiddenEmail}, template ${mailType} not found`,
            );
            return resolve();
          }

          const mail = template(data);

          await new Promise<void>((resolveMail, rejectMail) => {
            transporter.sendMail(
              {
                from: username,
                to,
                subject: mail.subject,
                text: mail.text,
                html: mail.html,
              },
              (error: any, info: any) => {
                error ? rejectMail(error) : resolveMail();
              },
            );
          });

          console.log(`Email sent to ${hiddenEmail}!`);
          resolve();
        } catch (e) {
          console.error(`Email error to ${hiddenEmail}!`);
          setTimeout($send, 5_000);
        }
      };
      $send();
    });
  };

  return {
    load,
    send,
  };
};
