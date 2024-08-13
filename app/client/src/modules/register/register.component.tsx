import React, { FormEvent, useCallback, useState } from "react";
import { CaptchaComponent } from "shared/components";
import { useApi } from "shared/hooks";
import styles from "./register.module.scss";

export const RegisterComponent: React.FC = () => {
  const [submittedAt, setSubmittedAt] = useState<number>();
  const [captchaId, setCaptchaId] = useState<string>();

  const { login } = useApi();

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const data = new FormData(event.target as unknown as HTMLFormElement);
      const email = data.get("email") as string;
      const password = data.get("password") as string;

      login(email, password, captchaId)
        .then(({ sessionId, token }) => {
          console.log(sessionId, token);
        })
        .catch(() => {
          setSubmittedAt(performance.now());
        });
    },
    [captchaId],
  );

  return (
    <div>
      <form className={styles.form} onSubmit={onSubmit}>
        <input name="email" placeholder="email" />
        <input name="password" placeholder="password" type="password" />
        <CaptchaComponent submittedAt={submittedAt} onResolve={setCaptchaId} />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};
