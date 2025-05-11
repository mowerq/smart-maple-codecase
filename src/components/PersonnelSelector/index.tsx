import { Check, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import type { staffDTOWithColor } from "@/models/user";
import { useTranslation } from "react-i18next";

interface PersonnelSelectorProps {
  members: staffDTOWithColor[];
  selectedId: string;
  onStaffChange: (id: string) => void;
}

const PersonnelSelector = ({
  members,
  selectedId,
  onStaffChange,
}: PersonnelSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation();

  // Filter members based on search query
  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="py-2 text-sm font-medium text-slate-700 dark:text-slate-300">
        {t("personnel.personnelList")}
      </div>

      {/* Search integrated directly with the personnel list */}
      <div className="relative mb-3">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
        <Input
          placeholder={t("personnel.searchPersonnel")}
          className="pl-9 h-9 text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <ScrollArea className="h-[calc(100vh-450px)] pr-3">
        <div className="space-y-1">
          {filteredMembers.map((member) => {
            const isSelected = selectedId.includes(member.id);

            return (
              <div
                key={member.id}
                className={cn(
                  "flex items-center gap-3 p-2.5 rounded-md cursor-pointer transition-all",
                  isSelected
                    ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 pl-2 shadow-sm"
                    : "hover:bg-slate-50 dark:hover:bg-slate-900/50 border-l-4 border-transparent"
                )}
                style={{
                  borderLeftColor: isSelected ? member.color : "transparent",
                }}
                onClick={() => onStaffChange(member.id)}
              >
                <Avatar
                  className={cn(
                    "h-8 w-8 transition-all",
                    isSelected ? "ring-2 ring-offset-2" : ""
                  )}
                  style={{
                    borderColor: member.color,
                    borderWidth: "1px",
                    ...(isSelected && { ["--tw-ring-color"]: member.color }),
                  }}
                >
                  <AvatarImage src={"/placeholder.svg"} alt={member.name} />
                  <AvatarFallback
                    className="text-xs"
                    style={{
                      backgroundColor: `${member.color}20`,
                      color: member.color,
                    }}
                  >
                    {member.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span
                  className={cn(
                    "text-sm font-medium truncate",
                    isSelected
                      ? "text-blue-900 dark:text-blue-400"
                      : "text-slate-700 dark:text-slate-300"
                  )}
                >
                  {member.name}
                </span>
                {isSelected && (
                  <Check className="ml-auto h-4 w-4 text-blue-600 dark:text-blue-400" />
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default PersonnelSelector;
