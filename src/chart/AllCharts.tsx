import { parse } from "date-fns";
import { FC } from "react";
import { useRecoilState } from "recoil";
import { calendarState } from "../calendar/calendar.state";
import { getDays } from "../calendar/getDays";
import { importerState } from "../importer/importer.state";
import { DailyChart } from "./DailyChart";

const refDate = new Date();
export const AllCharts: FC = () => {
    const [currentCalendarState] = useRecoilState(calendarState);
    const [currentImportState] = useRecoilState(importerState);

    const { from, to } = currentCalendarState;
    if (!from || !to) {
        return null;
    }

    to.setHours(23, 59);
    const days = getDays(currentImportState.lines);

    const selectedDays = days
        .filter((day) => {
            const daydate = parse(day, "dd-MM-yyyy", refDate);
            return daydate >= from && daydate <= to;
        })
        .sort((a, b) => {
            const aDate = parse(a, "dd-MM-yyyy", refDate);
            const bDate = parse(b, "dd-MM-yyyy", refDate);

            return aDate < bDate ? -1 : 1;
        });

    return (
        <div className="charts">
            {selectedDays.map((selectedDay) => (
                <DailyChart key={selectedDay} selectedDay={parse(selectedDay, "dd-MM-yyyy", refDate)} />
            ))}
        </div>
    );
};
