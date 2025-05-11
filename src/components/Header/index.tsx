import { useTranslation } from "react-i18next";
import LanguageToggle from "../LanguageToggle";
import ThemeToggle from "../ThemeToggle";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import ProfileCard from "../Profile";
import { useState } from "react";
import type { UserInstance } from "@/models/user";
import PersonnelSelector from "../PersonnelSelector";

interface HeaderProps {
  profile: UserInstance;
  members: any[];
  selectedId: string;
  onStaffChange: (id: string) => void;
}

const Header = ({
  profile,
  members,
  selectedId,
  onStaffChange,
}: HeaderProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { t } = useTranslation();
  console.info(profile, members, selectedId, onStaffChange);
  return (
    <header className="h-14 px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 w-full">
      <div className="flex items-center gap-4">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-slate-500"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">{t("menu")}</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0">
            <div className="flex flex-col h-full">
              <SheetHeader className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
                <SheetTitle className="text-left">
                  {t("eventManagement")}
                </SheetTitle>
              </SheetHeader>

              <div className="flex-1 overflow-auto p-4">
                <ProfileCard profile={profile} />
                <PersonnelSelector
                  members={members}
                  selectedId={selectedId}
                  onStaffChange={onStaffChange}
                />
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between">
                <LanguageToggle />
                <ThemeToggle />
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <h1 className="text-lg font-medium text-slate-800 dark:text-slate-200 block md:hidden">
          {t("header.pageTitleMobile")}
        </h1>
        <h1 className="text-lg font-medium text-slate-800 dark:text-slate-200 hidden md:block">
          {t("header.pageTitleDesktop")}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
