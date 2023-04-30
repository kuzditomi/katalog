import { FC, useEffect, useMemo } from "react";
import { useRecoilState } from "recoil";
import { importerState } from "../importer/importer.state";
import { calendarState } from "./calendar.state";
import ReactCalendar from "react-calendar";
import { format } from "date-fns";

/**
 *
 * @returns format dd-MM-yyyy
 */
const extractDays = (lines: string[]): string[] => {
    if (!lines?.length) {
        return [];
    }

    const dates = lines.map((l) => l.split(",")[2].split(" ")[0]);
    const days = new Set(dates);

    return Array.from(days.keys());
};

export const Calendar: FC = () => {
    const [currentImportState] = useRecoilState(importerState);
    const [currentCalendarState, setCalendarState] = useRecoilState(calendarState);

    const days = useMemo(() => extractDays(currentImportState.lines.slice(2)), [currentImportState]);

    useEffect(() => {
        if (
            currentCalendarState.selectedDay &&
            !days.includes(format(currentCalendarState.selectedDay, "dd-MM-yyyy"))
        ) {
            setCalendarState({
                selectedDay: null,
            });
        }
    }, [currentCalendarState.selectedDay, days, setCalendarState]);

    if (!currentImportState?.lines?.length) {
        return null;
    }

    return (
        <div className="calendar">
            <ReactCalendar
                tileDisabled={(day) => !days.includes(format(day.date, "dd-MM-yyyy"))}
                onChange={(value) => {
                    if (value) {
                        setCalendarState({
                            ...currentCalendarState,
                            selectedDay: value as Date,
                        });
                    }
                }}
            />
        </div>
    );
};
