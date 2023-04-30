import { FC, useMemo } from "react";
import { useRecoilState } from "recoil";
import { calendarState } from "../calendar/calendar.state";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { importerState } from "../importer/importer.state";

type GlucoseData = {
    time: string;
    glucose: number;
};

const extractGlucoseData = (lines: string[], selectedDay: string): GlucoseData[] => {
    if (!lines?.length || !selectedDay) {
        return [];
    }

    const relevantLines = lines
        .map((l) => {
            const row = l.split(",");
            return { datetime: row[2], glucoseValue: row[3] === "0" ? row[4] : row[5] };
        })
        .filter(({datetime, glucoseValue}) => glucoseValue && datetime.split(" ")[0] === selectedDay);

    const data: GlucoseData[] = relevantLines.map(({datetime, glucoseValue}) => ({
        time: datetime.split(" ")[1],
        glucose: Number(glucoseValue),
    }));

    return data;
};

export const DailyChart: FC = () => {
    const [currentCalendarState] = useRecoilState(calendarState);
    const [currentImportState] = useRecoilState(importerState);

    const glucoseData = useMemo(
        () => extractGlucoseData(currentImportState.lines, currentCalendarState.selectedDay),
        [currentCalendarState.selectedDay, currentImportState.lines]
    );

    if (!currentCalendarState.selectedDay) {
        return <div>Valassz ki egy napot!</div>;
    }

    if (!currentImportState.lines) {
        return <div>Tolts fel rendes adatokat!</div>;
    }

    return (
        <LineChart width={800} height={400} data={glucoseData}>
            <Line type="monotone" dataKey="glucose" stroke="#8884d8" />
            <XAxis dataKey="time" />
            <YAxis min={2} max={12} />
            <Tooltip />
        </LineChart>
    );
};
