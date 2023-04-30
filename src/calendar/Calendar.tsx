import { FC, useEffect, useMemo } from "react";
import { useRecoilState } from "recoil";
import { importerState } from "../importer/importer.state";
import { calendarState } from "./calendar.state";

const extractDays = (lines: string[]) => {
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
        if (currentCalendarState.selectedDay && !days.includes(currentCalendarState.selectedDay)) {
            setCalendarState({
                selectedDay: "",
            });
        }
    }, [currentCalendarState.selectedDay, days, setCalendarState]);

    return (
        <div className="days">
            {days.map((d) => (
                <div key={d}>
                    <button
                        className={d === currentCalendarState.selectedDay ? "active" : ""}
                        onClick={() =>
                            setCalendarState({
                                ...currentCalendarState,
                                selectedDay: d,
                            })
                        }
                    >
                        {d}
                    </button>
                </div>
            ))}
        </div>
    );
};
