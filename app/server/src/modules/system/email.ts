import { System } from "./main.ts";
import nodemailer from "nodemailer";

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
        secure: false, // use TLS
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

    System.email.send(
      "reciever@test.com",
      "verify your account",
      "verifyUrl",
      `<a href="${"verifyUrl"}">${"verifyUrl"}<p/>`,
    );
  };

  enum MailTypes {
    VERIFY,
  }

  enum Language {
    EN = "en",
    ES = "es",
  }

  // TODO: dynamic segun MailTypes
  interface MailTemplateData {
    verifyUrl?: string;
  }

  interface MailTemplate {
    subject: (data: MailTemplateData) => string;
    text: (data: MailTemplateData) => string;
    html: (data: MailTemplateData) => string;
  }

  // TODO: se podria hacer con __()...
  const mailTemplates: Record<MailTypes, Record<Language, MailTemplate>> = {
    [MailTypes.VERIFY]: {
      [Language.ES]: {
        subject: (data) => "Verifica tu cuenta",
        text: (data) =>
          `Por favor, verifica tu cuenta usando el siguiente enlace: ${data.verifyUrl}`,
        html: (data) =>
          `<p>Por favor, verifica tu cuenta haciendo click en el siguiente enlace:</p>
       <a href="${data.verifyUrl}">${data.verifyUrl}</a>`,
      },
      [Language.EN]: {
        subject: (data) => "Verifica tu cuenta",
        text: (data) =>
          `Por favor, verifica tu cuenta usando el siguiente enlace: ${data.verifyUrl}`,
        html: (data) =>
          `<p>Por favor, verifica tu cuenta haciendo click en el siguiente enlace:</p>
       <a href="${data.verifyUrl}">${data.verifyUrl}</a>`,
      },
    },
  };

  const send2 = async (
    mailType: MailTypes,
    to: string,
    data: MailTemplateData,
    lang: Language = Language.EN, // Idioma por defecto
  ) => {
    return new Promise<void>((resolve) => {
      const $send = async () => {
        const hiddenEmail = `${to.substring(0, 3)}***${to.substring(to.length - 3)}`;
        try {
          const {
            email: { enabled, username },
          } = System.getConfig();

          if (!enabled) return resolve();

          const template = mailTemplates[mailType]?.[lang];
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
                from: "test@test.com",
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
