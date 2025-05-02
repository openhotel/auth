import React, { FormEvent, useCallback, useEffect, useMemo } from "react";
import { useLanguages, useUser } from "shared/hooks";
import {
  ButtonComponent,
  FormComponent,
  SelectorComponent,
} from "@openhotel/components";

//@ts-ignore
import styles from "./languages.module.scss";
import { cn } from "shared/utils";

export const LanguagesComponent: React.FC = () => {
  const { user, update } = useUser();

  const { fetchLanguages, languages } = useLanguages();

  useEffect(() => {
    fetchLanguages();
  }, [fetchLanguages]);

  const languageOptions = useMemo(
    () =>
      languages
        .filter((language) => !user.languages.includes(language))
        .map((language) => ({ key: language.code, value: language.name })),
    [languages, user],
  );

  const onSubmit = useCallback(
    async ({ language }) => {
      update({ languages: [...user.languages, language] });
    },
    [update, user],
  );

  const onDelete = useCallback(
    (language: string) => () => {
      update({
        languages: user.languages.filter(($language) => language !== $language),
      });
    },
    [update, user],
  );

  return (
    <div className={styles.content}>
      <label>Languages:</label>
      <div className={styles.list}>
        {user.languages.map((languageCode, index) => (
          <div key={languageCode} className={cn(styles.item, styles.nonForm)}>
            <label>
              {languages.find((lang) => lang.code === languageCode).name}
            </label>
            {user.languages.length > 1 ? (
              <ButtonComponent color="grey" onClick={onDelete(languageCode)}>
                Remove
              </ButtonComponent>
            ) : null}
          </div>
        ))}
        {languageOptions.length ? (
          <FormComponent onSubmit={onSubmit}>
            <div className={styles.item}>
              <SelectorComponent
                name="language"
                placeholder="language"
                options={languageOptions}
                clearable={false}
              />
              <ButtonComponent>Add</ButtonComponent>
            </div>
          </FormComponent>
        ) : null}
      </div>
    </div>
  );
};
