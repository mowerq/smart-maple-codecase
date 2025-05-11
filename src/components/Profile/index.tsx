import type { UserInstance } from "../../models/user";
import AuthSession from "../../utils/session";
import "../profileCalendar.scss";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";

type ProfileCardProps = {
  profile: UserInstance;
};

interface extendedUser extends UserInstance {
  avatar: string;
}

const ProfileCard = ({ profile }: ProfileCardProps) => {
  const currentUser: extendedUser = {
    ...profile,
    name: profile?.name ?? AuthSession.getName(),
    email: profile?.email ?? AuthSession.getEmail(),
    role: profile?.role ?? AuthSession.getRoles(),
    avatar: "",
  };

  const initials = currentUser.name
    .split(" ")
    .map((n) => n[0])
    .join("");
  return (
    <Card className="mb-6 shadow-sm overflow-hidden p-0">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-6">
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-20 w-20 mb-3 border-2 border-white dark:border-slate-700 shadow-sm">
              <AvatarImage
                src={currentUser.avatar || "/placeholder.svg"}
                alt={currentUser.name}
              />
              <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 text-xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1.5">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                {currentUser.name}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 break-all">
                {currentUser.email}
              </p>
              <Badge className="bg-blue-600 hover:bg-blue-700 px-3 py-0.5">
                {"Admin"}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
