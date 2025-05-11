import { useState } from "react";
import { Button } from "../ui/button";

const LanguageToggle = () => {
  const [language, setLanguage] = useState("EN");
  const toggleLanguage = () => {
    setLanguage(language === "EN" ? "TR" : "EN");
  };
  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-slate-500 h-8 w-8 flex items-center justify-center dark:text-white"
      onClick={toggleLanguage}
    >
      <span className="font-medium text-xs">{language}</span>
      <span className="sr-only">Toggle language</span>
    </Button>
  );
};

export default LanguageToggle;
