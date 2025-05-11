/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import ProfileCard from "../Profile";
import CalendarContainer from "../Calendar";

import { useSelector } from "react-redux";
import { getAuthUser } from "../../store/auth/selector";
import { getSchedule } from "../../store/schedule/selector";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchSchedule } from "../../store/schedule/actions";
import { setProfile } from "../../store/auth/actions";

import "../profileCalendar.scss";
import Header from "../Header";
import PersonnelSelector from "../PersonnelSelector";
import type { staffDTOWithColor } from "@/models/user";

const ProfileCalendar = () => {
  const dispatch = useDispatch();

  const auth = useSelector(getAuthUser);
  const schedule = useSelector(getSchedule);
  const [staffs, setStaffs] = useState<staffDTOWithColor[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<string>("");

  const randomColors = [
    "#33B5FF",
    "#2ECC71",
    "#FF5733",
    "#8E44AD",
    "#F1C40F",
    "#E67E22",
    "#1ABC9C",
    "#FF33A8",
    "#34495E",
    "#3498DB",
    "#9B59B6",
    "#E74C3C",
    "#27AE60",
    "#F39C12",
    "#16A085",
    "#BDC3C7",
  ];

  useEffect(() => {
    dispatch(setProfile() as any);
    dispatch(fetchSchedule() as any);
  }, []);

  // 2. When schedule is ready, enrich it with colors
  useEffect(() => {
    if (schedule.staffs?.length) {
      const coloredStaffs = schedule.staffs.map((staff, i) => ({
        id: staff.id,
        name: staff.name,
        color: randomColors[i % randomColors.length], // Safe looping
      }));
      setStaffs(coloredStaffs);
    }
  }, [schedule.staffs]);

  const onStaffChange = (staffId: string) => {
    setSelectedStaff((prev) => {
      // If clicking on already selected item, deselect it
      if (prev === staffId) {
        return "";
      }
      // Otherwise, replace the current selection with the new one
      return staffId;
    });
  };

  return (
    <div className="profile-calendar-container">
      <Header
        profile={auth}
        members={staffs}
        selectedId={selectedStaff}
        onStaffChange={onStaffChange}
      />

      <div className="flex flex-1 w-full overflow-hidden">
        {/* This is the left side of the page */}
        <div className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hidden md:block">
          <div className="p-4">
            {/* User Card */}
            <ProfileCard profile={auth} />

            {/* Team Selector with integrated search */}
            <PersonnelSelector
              members={staffs}
              selectedId={selectedStaff}
              onStaffChange={onStaffChange}
            />
          </div>
        </div>

        {/* This is the right side which is calendar */}
        <div className="flex-1 flex flex-col w-full overflow-hidden">
          {/* Calendar */}
          <div className="flex-1 w-full overflow-auto bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <CalendarContainer
              schedule={schedule}
              auth={auth}
              selectedStaffId={selectedStaff}
              coloredStaffs={staffs}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCalendar;
