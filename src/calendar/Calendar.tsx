import { FC, useMemo } from "react";
import { useRecoilState } from "recoil";
import { importerState } from "../importer/importer.state";
import { calendarState } from "./calendar.state";
import ReactCalendar from "react-calendar";
import { format } from "date-fns";
import { getDays } from "./getDays";

export const Calendar: FC = () => {
    const [currentImportState] = useRecoilState(importerState);
    const [_, setCalendarState] = useRecoilState(calendarState);

    const days = useMemo(() => getDays(currentImportState.lines.slice(2)), [currentImportState]);

    if (!currentImportState?.lines?.length) {
        return null;
    }

    return (
        <div className="calendar">
            <ReactCalendar
                returnValue="range"
                selectRange={true}
                tileDisabled={(day) => !days.includes(format(day.date, "dd-MM-yyyy"))}
                onChange={(value) => {
                    const range = value as [Date, Date];

                    if (!range?.length) {
                        return;
                    }

                    setCalendarState({
                        from: range[0],
                        to: range[1],
                    });
                }}
            />
        </div>
    );
};
