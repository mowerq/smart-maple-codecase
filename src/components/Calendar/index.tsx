/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useRef, useState } from "react";

import type { ScheduleInstance } from "../../models/schedule";
import type { staffDTOWithColor, UserInstance } from "../../models/user";

import FullCalendar from "@fullcalendar/react";

import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";

import {
  formatDate,
  type EventDropArg,
  type EventInput,
} from "@fullcalendar/core/index.js";

import "../profileCalendar.scss";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import utc from "dayjs/plugin/utc";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { ArrowRight, CalendarIcon, Clock } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { updateAssignmentDate } from "@/store/schedule/actions";
import { useTranslation } from "react-i18next";

dayjs.extend(utc);
dayjs.extend(isSameOrBefore);

type CalendarContainerProps = {
  schedule: ScheduleInstance;
  auth: UserInstance;
  selectedStaffId: string;
  coloredStaffs: staffDTOWithColor[];
};

const classes = [
  "bg-one",
  "bg-two",
  "bg-three",
  "bg-four",
  "bg-five",
  "bg-six",
  "bg-seven",
  "bg-eight",
  "bg-nine",
  "bg-ten",
  "bg-eleven",
  "bg-twelve",
  "bg-thirteen",
  "bg-fourteen",
  "bg-fifteen",
  "bg-sixteen",
  "bg-seventeen",
  "bg-eighteen",
  "bg-nineteen",
  "bg-twenty",
  "bg-twenty-one",
  "bg-twenty-two",
  "bg-twenty-three",
  "bg-twenty-four",
  "bg-twenty-five",
  "bg-twenty-six",
  "bg-twenty-seven",
  "bg-twenty-eight",
  "bg-twenty-nine",
  "bg-thirty",
  "bg-thirty-one",
  "bg-thirty-two",
  "bg-thirty-three",
  "bg-thirty-four",
  "bg-thirty-five",
  "bg-thirty-six",
  "bg-thirty-seven",
  "bg-thirty-eight",
  "bg-thirty-nine",
  "bg-forty",
];

interface EventPopupData {
  id: string;
  title: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  durationHourly: number;
  staffName: string;
  staffColor: string;
}

const CalendarContainer = ({
  schedule,
  auth,
  selectedStaffId,
  coloredStaffs,
}: CalendarContainerProps) => {
  const calendarRef = useRef<FullCalendar>(null);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [events, setEvents] = useState<EventInput[]>([]);
  const initialDate = dayjs(schedule?.scheduleStartDate).toDate();
  const [selectedEvent, setSelectedEvent] = useState<EventPopupData | null>(
    null
  );
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const getDatesBetween = (startDate: string, endDate: string) => {
    const dates = [];
    let current = dayjs(startDate, "DD-MM-YYYY");
    const end = dayjs(endDate, "DD-MM-YYYY");

    while (current.isSameOrBefore(end)) {
      dates.push(current.format("DD-MM-YYYY"));
      current = current.add(1, "day");
    }

    return dates;
  };

  /**
   * Creates a map of dates to staff members with their assigned colors.
   *
   * Uses `useMemo` to optimize performance, recalculating only when
   * `selectedStaffId` or `schedule` changes. Filters out off days and
   * maps paired staff details (including color) to specific dates.
   *
   * @returns {Map<string, staffDTOWithColor>} A map of dates to staff details.
   */
  const highlightedDateStaffs = useMemo(() => {
    const map = new Map<string, staffDTOWithColor>();

    const currentStaff = schedule?.staffs?.find(
      (staff) => staff.id === selectedStaffId
    );
    if (!currentStaff) return map;

    const offDays = currentStaff.offDays;

    currentStaff.pairList?.forEach((pair) => {
      const pairedStaff = coloredStaffs.find((s) => s.id === pair.staffId);
      if (!pairedStaff) return;

      const dateList = getDatesBetween(pair.startDate, pair.endDate);

      dateList
        .filter((d) => !offDays.includes(d))
        .forEach((d) => {
          map.set(d, pairedStaff);
        });
    });

    return map;
  }, [selectedStaffId, schedule]);

  dayjs.extend(customParseFormat);

  const getPlugins = () => {
    const plugins = [dayGridPlugin];

    plugins.push(interactionPlugin);
    return plugins;
  };

  const getShiftById = (id: string) =>
    schedule?.shifts?.find((shift) => shift.id === id);

  const getAssigmentById = (id: string) => {
    return schedule?.assignments?.find((assign) => id === assign.id);
  };

  const getStaffById = (id: string) => {
    return schedule?.staffs?.find((staff) => id === staff.id);
  };

  const validDates = useMemo(() => {
    const dates = [];
    let currentDate = dayjs(schedule.scheduleStartDate);
    while (
      currentDate.isBefore(schedule.scheduleEndDate) ||
      currentDate.isSame(schedule.scheduleEndDate)
    ) {
      dates.push(currentDate.format("YYYY-MM-DD"));
      currentDate = currentDate.add(1, "day");
    }
    return dates;
  }, [schedule]);

  /**
   * Generates calendar events for the selected staff member.
   * Filters assignments based on the selected staff ID and creates event objects
   * with relevant details like title, date, and styling. Updates the `events` state
   * with the generated list.
   */
  const generateStaffBasedCalendar = () => {
    if (!selectedStaffId) {
      setEvents([]);
      return;
    }

    const works: EventInput[] = [];

    for (let i = 0; i < schedule?.assignments?.length; i++) {
      if (
        selectedStaffId &&
        schedule.assignments[i].staffId !== selectedStaffId
      ) {
        continue;
      }
      const className = schedule?.shifts?.findIndex(
        (shift) => shift.id === schedule?.assignments?.[i]?.shiftId
      );

      const assignmentDate = dayjs
        .utc(schedule?.assignments?.[i]?.shiftStart)
        .format("YYYY-MM-DD");
      const isValidDate = validDates.includes(assignmentDate);

      const work = {
        id: schedule?.assignments?.[i]?.id,
        title: getShiftById(schedule?.assignments?.[i]?.shiftId)?.name,
        duration: "01:00",
        date: assignmentDate,
        staffId: schedule?.assignments?.[i]?.staffId,
        shiftId: schedule?.assignments?.[i]?.shiftId,
        className: `event ${classes[className]} ${
          getAssigmentById(schedule?.assignments?.[i]?.id)?.isUpdated
            ? "highlight"
            : ""
        } ${!isValidDate ? "invalid-date" : ""}`,
      };
      works.push(work);
    }

    setEvents(works);
  };

  useEffect(() => {
    generateStaffBasedCalendar();
    if (calendarRef.current) {
      queueMicrotask(() => {
        if (calendarRef.current) {
          calendarRef.current
            .getApi()
            .gotoDate(dayjs(schedule.scheduleStartDate).toDate());
        }
      });
    }
  }, [selectedStaffId, schedule]);

  const RenderEventContent = ({ eventInfo }: any) => {
    const handleEventClick = () => {
      const assignment = schedule.assignments.find(
        (e) => e.id === eventInfo.event.id
      );
      let staff, shift;
      if (assignment) {
        staff = getStaffById(assignment.staffId);
        shift = getShiftById(assignment.shiftId);
        if (staff && shift) {
          const currentEvent: EventPopupData = {
            id: eventInfo.event.id,
            title: shift.name,
            staffName: staff.name,
            durationHourly: shift.shiftDurationHourly,
            startTime: shift.shiftStart,
            endTime: shift.shiftEnd,
            eventDate: eventInfo.event.start,
            staffColor: coloredStaffs.find((e) => e.id === staff!.id)!.color,
          };
          setSelectedEvent(currentEvent);
        } else {
          alert("Staff or Shift not found!");
        }
      } else {
        alert("Assignment Not Found");
      }
    };
    return (
      <div onClick={handleEventClick} className="event-content">
        <p className="px-4 py-2 text-xs truncate overflow-hidden whitespace-nowrap">
          {eventInfo.event.title}
        </p>
      </div>
    );
  };

  /**
   * Handles the event drop action on the calendar.
   *
   * Updates the assignment's start and end dates in the store when an event is dragged
   * and dropped to a new date.
   *
   * @param {EventDropArg} info - Contains details about the dropped event.
   */
  const handleEventDrop = (info: EventDropArg) => {
    const { id, startStr, endStr } = info.event;

    dispatch(
      updateAssignmentDate({
        id,
        newShiftStart: startStr,
        newShiftEnd: endStr,
      }) as any
    );
  };

  return (
    <div className="calendar-section dark:bg-slate-900!">
      <div className="calendar-wrapper">
        <FullCalendar
          ref={calendarRef}
          locale={auth.language}
          plugins={getPlugins()}
          contentHeight={400}
          handleWindowResize={true}
          selectable={true}
          editable={true}
          eventOverlap={true}
          eventDurationEditable={false}
          eventDrop={handleEventDrop}
          dragScroll={false}
          initialView="dayGridMonth"
          initialDate={initialDate}
          events={events}
          firstDay={1}
          dayMaxEventRows={4}
          headerToolbar={{ end: "prev,today,next", start: "title" }}
          buttonText={{ today: t("today") }}
          fixedWeekCount={true}
          showNonCurrentDates={true}
          eventContent={(eventInfo: any) => (
            <RenderEventContent eventInfo={eventInfo} />
          )}
          datesSet={(info: any) => {
            const prevButton = document.querySelector(
              ".fc-prev-button"
            ) as HTMLButtonElement;
            const nextButton = document.querySelector(
              ".fc-next-button"
            ) as HTMLButtonElement;
            const todayButton = document.querySelector(
              ".fc-today-button"
            ) as HTMLButtonElement;

            if (prevButton && nextButton && todayButton) {
              prevButton.parentElement!.className += " flex";
              prevButton.parentElement!.parentElement!.className +=
                " flex items-center";
              prevButton.className +=
                " bg-white! border-gray-300! border-r-1! dark:bg-black! dark:border-slate-800! dark:text-white! dark:hover:bg-accent! disabled:bg-gray-400! disabled:text-white! focus:shadow-none! rounded-r-none! text-black! text-sm! hover:bg-gray-100!";

              todayButton.className +=
                " bg-gray-400! border-gray-300! dark:bg-black! dark:border-slate-800! dark:text-white! dark:hover:bg-accent! focus:shadow-none! not-disabled:bg-white! not-disabled:hover:bg-gray-100! not-disabled:text-black! px-4! rounded-none! text-sm!";

              nextButton.className +=
                " bg-white! border-gray-300! border-l-1! dark:bg-black! dark:border-slate-800! dark:text-white! dark:hover:bg-accent! disabled:bg-gray-400! disabled:text-white! focus:shadow-none! rounded-l-none! text-black! text-sm! hover:bg-gray-100!";
            }

            const startDiff = dayjs(info.start)
              .utc()
              .diff(
                dayjs(schedule.scheduleStartDate).subtract(1, "day").utc(),
                "days"
              );
            const endDiff = dayjs(dayjs(schedule.scheduleEndDate)).diff(
              info.end,
              "days"
            );
            if (prevButton && nextButton) {
              if (startDiff < 0 && startDiff > -35) prevButton.disabled = true;
              else prevButton.disabled = false;

              if (endDiff < 0 && endDiff > -32) nextButton.disabled = true;
              else nextButton.disabled = false;
            }
          }}
          dayCellContent={({ date }) => {
            const formattedDate = dayjs(date).date();
            const dateKey = dayjs(date).format("DD-MM-YYYY");
            const found = validDates.includes(dayjs(date).format("YYYY-MM-DD"));
            const highlightStaff = highlightedDateStaffs.get(dateKey);
            let isHighlighted = false;
            if (highlightStaff) isHighlighted = true;

            return (
              <div
                className={`relative z-[9999] ${
                  found ? "" : "date-range-disabled"
                } ${isHighlighted ? "highlightedPair" : ""}`}
                style={{ borderColor: highlightStaff?.color }}
                onMouseEnter={(e) => {
                  setHoveredDate(dateKey);

                  const frame = e.currentTarget.closest(
                    ".fc-daygrid-day-frame"
                  ) as HTMLElement;
                  if (frame) {
                    frame.style.zIndex = "9999";
                    frame.style.position = "relative";
                  }
                }}
                onMouseLeave={(e) => {
                  setHoveredDate(null);

                  const frame = e.currentTarget.closest(
                    ".fc-daygrid-day-frame"
                  ) as HTMLElement;
                  if (frame) {
                    frame.style.zIndex = ""; // reset to default
                  }
                }}
              >
                {formattedDate}

                {hoveredDate === dateKey && highlightStaff && (
                  <div
                    className="absolute bottom-full mt-1 left-1/2 -translate-x-1/2 px-4 py-2 border-[1px] bg-white text-black text-xs rounded-sm shadow-sm z-[9999]"
                    style={{ boxShadow: "0 0 6px " + highlightStaff.color }}
                  >
                    {highlightStaff.name}
                  </div>
                )}
              </div>
            );
          }}
        />

        {/* Event Details Dialog */}
        <Dialog
          open={!!selectedEvent}
          onOpenChange={(open) => !open && setSelectedEvent(null)}
        >
          <DialogTitle className="sr-only">
            {selectedEvent?.title || t("eventDetails")}
          </DialogTitle>

          <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden">
            {selectedEvent && (
              <div className="flex flex-col">
                {/* Header with event color */}
                <div
                  className="relative p-8 text-white overflow-hidden"
                  style={{ backgroundColor: selectedEvent.staffColor }}
                >
                  {/* Background pattern for visual interest */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white"></div>
                    <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-white"></div>
                  </div>

                  <div className="relative z-10">
                    <h2 className="text-2xl font-bold mb-3">
                      {selectedEvent.title}
                    </h2>
                    <div className="flex items-center gap-2 text-white/90">
                      <CalendarIcon className="h-4 w-4" />
                      <span className="font-medium">
                        {formatDate(selectedEvent.eventDate, {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          weekday: "long",
                          locale: auth.language,
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Personnel Info */}
                  <Card className="overflow-hidden border-0 shadow-sm p-0">
                    <CardContent className="p-0">
                      <div className="flex items-center p-8 bg-slate-50 dark:bg-slate-800">
                        <Avatar
                          className="h-14 w-14 mr-4 border-2"
                          style={{ borderColor: selectedEvent.staffColor }}
                        >
                          <AvatarImage
                            src={"/placeholder.svg"}
                            alt={selectedEvent.staffName}
                          />
                          <AvatarFallback
                            style={{
                              backgroundColor: `${selectedEvent.staffColor}20`,
                              color: selectedEvent.staffColor,
                            }}
                          >
                            {selectedEvent.staffName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                            {selectedEvent.staffName}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {t("personnel.personnel")}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Event Details */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center gap-3 p-8 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                      <div className="bg-slate-200 dark:bg-slate-700 p-2 rounded-full">
                        <Clock className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {t("event.eventHours")}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-base font-medium">
                            {selectedEvent.startTime}
                          </p>
                          <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                          <p className="text-base font-medium">
                            {selectedEvent.endTime}
                          </p>
                          <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">
                            {`(${selectedEvent.durationHourly} ${t("hours")})`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedEvent(null)}
                    >
                      {t("close")}
                    </Button>
                    <Button
                      style={{ backgroundColor: selectedEvent.staffColor }}
                      className="hover:opacity-90"
                      onClick={(e) =>
                        (e.currentTarget.innerText = t("notImplementedYet"))
                      }
                    >
                      {t("edit")}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CalendarContainer;
