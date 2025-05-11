import { Dialog, DialogContent } from "../ui/dialog";
import { ArrowRight, CalendarIcon, Clock } from "lucide-react";
import { formatDate } from "@fullcalendar/core/index.js";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

interface EventPopupProps {
  currentEvent: {
    id: string;
    title: string;
    eventDate: string;
    startTime: string;
    endTime: string;
    durationHourly: number;
    staffName: string;
    staffColor: string;
  };
}

const EventPopup = ({ currentEvent }: EventPopupProps) => {
  return (
    <Dialog open={!!currentEvent} onOpenChange={(open) => !open}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden">
        {currentEvent && (
          <div className="flex flex-col">
            {/* Header with event color */}
            <div
              className="relative p-8 text-white overflow-hidden"
              style={{ backgroundColor: currentEvent.staffColor }}
            >
              {/* Background pattern for visual interest */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white"></div>
                <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-white"></div>
              </div>

              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-3">
                  {currentEvent.title}
                </h2>
                <div className="flex items-center gap-2 text-white/90">
                  <CalendarIcon className="h-4 w-4" />
                  <span className="font-medium">
                    {formatDate(currentEvent.startTime)}
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Personnel Info */}
              <Card className="overflow-hidden border-0 shadow-sm">
                <CardContent className="p-0">
                  <div className="flex items-center p-4 bg-slate-50 dark:bg-slate-800">
                    <Avatar
                      className="h-14 w-14 mr-4 border-2"
                      style={{ borderColor: currentEvent.staffColor }}
                    >
                      <AvatarImage
                        src={"/placeholder.svg"}
                        alt={currentEvent.staffName}
                      />
                      <AvatarFallback
                        style={{
                          backgroundColor: `${currentEvent.staffColor}20`,
                          color: currentEvent.staffColor,
                        }}
                      >
                        {currentEvent.staffName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                        {currentEvent.staffName}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {"Personnel"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Event Details */}
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <div className="bg-slate-200 dark:bg-slate-700 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {"Event Hours"}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-base font-medium">
                        {formatDate(currentEvent.startTime)}
                      </p>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                      <p className="text-base font-medium">
                        {formatDate(currentEvent.endTime)}
                      </p>
                      <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">
                        ({`(${currentEvent.durationHourly} hours)`})
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => {}}>
                  {"close"}
                </Button>
                <Button
                  style={{ backgroundColor: currentEvent.staffColor }}
                  className="hover:opacity-90"
                >
                  {"edit"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EventPopup;
