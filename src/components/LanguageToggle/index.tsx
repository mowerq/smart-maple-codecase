import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { updateLanguage } from "@/store/auth/actions";

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const dispatch = useDispatch();

  const currentLang = i18n.language === "tr" ? "TR" : "EN";

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "tr" : "en";
    i18n.changeLanguage(newLang);
    dispatch(updateLanguage({ language: newLang }) as any);
  };

  useEffect(() => {
    const savedLang = localStorage.getItem("language");
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-slate-500 h-8 w-8 flex items-center justify-center dark:text-white"
      onClick={toggleLanguage}
    >
      <span className="font-medium text-xs">{currentLang}</span>
      <span className="sr-only">Toggle language</span>
    </Button>
  );
};

export default LanguageToggle;
