import { System } from "../main.ts";
import nodemailer from "nodemailer";
import { verifyTemplate } from "./templates/verify.template.ts";

enum MailTypes {
  VERIFY,
}

export type MailTemplate = (data: any) => {
  subject: string;
  text: string;
  html: string;
};

const mailTemplates: Record<MailTypes, MailTemplate> = {
  [MailTypes.VERIFY]: verifyTemplate,
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

    const template = mailTemplates[MailTypes.VERIFY]({
      verifyUrl: "https://openhotel.club/blablabla",
    });
    System.email.send(
      "alberto.quil3s@gmail.com",
      template.subject,
      template.text,
      template.html,
    );
  };

  // TODO: se podria hacer con __()...

  const send2 = async (
    mailType: MailTypes,
    to: string,
    data: any,
    lang: any, // Idioma por defecto
  ) => {
    return new Promise<void>((resolve) => {
      const $send = async () => {
        const hiddenEmail = `${to.substring(0, 3)}***${to.substring(to.length - 3)}`;
        try {
          const {
            email: { enabled, username },
          } = System.getConfig();

          if (!enabled) return resolve();

          const template = mailTemplates[mailType];
          if (!template) {
            console.error(`No se encontró template para el tipo ${mailType}`);
            return resolve();
          }

          const subject = template.subject(data);
          const text = template.text(data);
          const html = template.html(data);

          await new Promise<void>((resolveMail, rejectMail) => {
            transporter.sendMail(
              {
                from: username,
                to,
                subject,
                text,
                html,
              },
              (error: any, info: any) => {
                error ? rejectMail(error) : resolveMail();
              },
            );
          });

          console.log(`Email enviado a ${hiddenEmail}!`);
          resolve();
        } catch (e) {
          console.error(`Error enviando email a ${hiddenEmail}:`, e);
          setTimeout($send, 5_000);
        }
      };
      $send();
    });
  };

  const send = async (
    to: string,
    subject: string,
    content: string,
    html: string,
  ) =>
    new Promise<void>((resolve) => {
      const $send = async () => {
        const hiddenEmail = `${to.substring(0, 3)}***${to.substring(to.length - 3, to.length)}`;
        try {
          const {
            email: { enabled, username },
          } = System.getConfig();
          if (!enabled) return resolve();

          await new Promise<void>((resolve, reject) => {
            transporter.sendMail(
              {
                from: username,
                to,
                subject: subject,
                text: content,
                html,
              },
              (error, info) => {
                error ? reject() : resolve();
              },
            );
          });
          resolve();
          console.log(`Email sent to ${hiddenEmail}!`);
        } catch (e) {
          console.error(`Email error to ${hiddenEmail}!`);
          setTimeout($send, 5_000);
        }
      };
      $send();
    });

  return {
    load,
    send,
  };
};
