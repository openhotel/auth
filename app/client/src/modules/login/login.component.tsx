import React, { useState } from "react";
import { CaptchaComponent } from "shared/components/captcha";

export const LoginComponent: React.FC = () => {
  const [submittedAt, setSubmittedAt] = useState<number>();
  const [captchaSessionId, setCaptchaSessionId] = useState<string>();

  const onSubmit = (event: SubmitEvent) => {
    event.preventDefault();

    const data = new FormData(event.target as unknown as HTMLFormElement);
    const email = data.get("email") as string;

    console.log(captchaSessionId);
    setSubmittedAt(performance.now());
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input name="email" placeholder="email" />
        <input name="password" placeholder="password" />
        <CaptchaComponent
          submittedAt={submittedAt}
          onResolve={setCaptchaSessionId}
        />
        <button type="submit">test</button>
      </form>
    </div>
  );
};
