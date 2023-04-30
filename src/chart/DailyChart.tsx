import { FC, useMemo } from "react";
import { useRecoilState } from "recoil";
import { calendarState } from "../calendar/calendar.state";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceArea } from "recharts";
import { importerState } from "../importer/importer.state";
import { format, parse } from "date-fns";

type GlucoseData = {
    minutesInDay: number;
    glucose: number;
};

const refdate = new Date();

const minutesInDayFormatter = (minutesInDay: number) => {
    const hours = ("" + Math.floor(minutesInDay / 60)).padStart(2, "0");
    const minues = ("" + (minutesInDay % 60)).padStart(2, "0");

    return `${hours}:${minues}`;
};

const extractGlucoseData = (lines: string[], selectedDay: Date | null): GlucoseData[] => {
    if (!selectedDay) {
        return [];
    }

    const selectedDayString = format(selectedDay, "dd-MM-yyyy");
    if (!lines?.length || !selectedDay) {
        return [];
    }

    const relevantLines = lines
        .map((l) => {
            const row = l.split(",");
            return { datetime: row[2], glucoseValue: row[3] === "0" ? row[4] : row[5] };
        })
        .filter(({ datetime, glucoseValue }) => glucoseValue && datetime.split(" ")[0] === selectedDayString);

    const data: GlucoseData[] = relevantLines
        .map(({ datetime, glucoseValue }) => {
            const date = parse(datetime, "dd-MM-yyyy HH:mm", refdate);

            const minutesInDay = date.getHours() * 60 + date.getMinutes();

            return {
                minutesInDay,
                glucose: Number(glucoseValue),
            };
        })
        .sort((a, b) => a.minutesInDay - b.minutesInDay);

    return data;
};

export const DailyChart: FC = () => {
    const [currentCalendarState] = useRecoilState(calendarState);
    const [currentImportState] = useRecoilState(importerState);

    const glucoseData = useMemo(
        () => extractGlucoseData(currentImportState.lines, currentCalendarState.selectedDay),
        [currentCalendarState.selectedDay, currentImportState.lines]
    );

    if(!currentImportState?.lines?.length){
        return null;
    }

    if (!currentCalendarState.selectedDay) {
        return <div>Valassz ki egy napot!</div>;
    }

    if (!currentImportState.lines) {
        return <div>Tolts fel rendes adatokat!</div>;
    }

    return (
        <LineChart width={800} height={400} data={glucoseData}>
            <Line type="monotone" dataKey="glucose" stroke="#8884d8" />
            <XAxis
                dataKey="minutesInDay"
                type="number"
                tickFormatter={(minutesInDay) => minutesInDayFormatter(minutesInDay)}
                domain={[0, 24 * 60]}
                tickCount={24}
            />
            <YAxis type="number" domain={[2, 12]} />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <ReferenceArea y1={4} y2={8} fill="#B8E0D2" fillOpacity={0.3} />
            <Tooltip
                labelFormatter={(_, points) => {
                    if (!points?.length) {
                        return "";
                    }
                    const { minutesInDay } = points[0].payload as GlucoseData;
                    return minutesInDayFormatter(minutesInDay);
                }}
            />
        </LineChart>
    );
};
