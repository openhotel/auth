import React, { FormEvent, useCallback, useState } from "react";
import {
  CaptchaComponent,
  LinkComponent,
  RedirectComponent,
} from "shared/components";
import { useAccount } from "shared/hooks";
import styles from "./register.module.scss";
import login_styles from "../login/login.module.scss";
import { useNavigate } from "react-router-dom";
import { ButtonComponent, InputComponent } from "@oh/components";

export const RegisterComponent: React.FC = () => {
  const [submittedAt, setSubmittedAt] = useState<number>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [captchaId, setCaptchaId] = useState<string>();

  const { register, isLogged } = useAccount();
  let navigate = useNavigate();

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const data = new FormData(event.target as unknown as HTMLFormElement);
      const email = data.get("email") as string;
      const username = data.get("username") as string;
      const password = data.get("password") as string;
      const rePassword = data.get("rePassword") as string;

      register({ email, username, password, rePassword, captchaId })
        .then(() => {
          navigate("/login");
        })
        .catch(({ status, message }) => {
          setSubmittedAt(performance.now());
          setErrorMessage(message);
          if (status === 500)
            setErrorMessage("Internal server error: " + message);
        });
    },
    [captchaId, navigate],
  );

  if (isLogged) return <RedirectComponent to="/" />;

  return (
    <div className={login_styles.wrapper}>
      <form className={login_styles.form} onSubmit={onSubmit}>
        <h1 className={login_styles.title}>Register</h1>
        <InputComponent name="email" placeholder="Email" />
        <InputComponent name="username" placeholder="Username" />
        <InputComponent
          name="password"
          placeholder="Password"
          type="password"
        />
        <InputComponent
          name="rePassword"
          placeholder="Repeat password"
          type="password"
        />
        <CaptchaComponent submittedAt={submittedAt} onResolve={setCaptchaId} />
        <ButtonComponent fullWidth>Register</ButtonComponent>
        {errorMessage ? (
          <label className={login_styles.error}>{errorMessage}</label>
        ) : null}
      </form>
      <LinkComponent className={login_styles.link} to="/login">
        Already registered? Login here.
      </LinkComponent>
    </div>
  );
};
