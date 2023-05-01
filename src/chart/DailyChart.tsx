import { FC, useMemo } from "react";
import { useRecoilState } from "recoil";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ReferenceArea,
    ReferenceLine,
} from "recharts";
import { importerState } from "../importer/importer.state";
import { format, parse } from "date-fns";

type GlucoseData = {
    minutesInDay: number;
    glucose: number;
    note: string;
};

const refdate = new Date();

const minutesInDayFormatter = (minutesInDay: number) => {
    const hours = ("" + Math.floor(minutesInDay / 60)).padStart(2, "0");
    const minues = ("" + (minutesInDay % 60)).padStart(2, "0");

    return `${hours}:${minues}`;
};

const extractGlucoseData = (
    lines: string[],
    selectedDay: Date | null
): {
    measures: GlucoseData[];
    meals: GlucoseData[];
} | null => {
    if (!selectedDay) {
        return null;
    }

    const selectedDayString = format(selectedDay, "dd-MM-yyyy");
    if (!lines?.length || !selectedDay) {
        return null;
    }

    const relevantLines = lines
        .map((l) => {
            const row = l.split(",");
            return { datetime: row[2], type: row[3], glucoseValue: row[3] === "0" ? row[4] : row[5], note: row[9] };
        })
        .filter(({ datetime }) => datetime.split(" ")[0] === selectedDayString);

    const data = relevantLines
        .map(({ datetime, glucoseValue, type, note }) => {
            const date = parse(datetime, "dd-MM-yyyy HH:mm", refdate);

            const minutesInDay = date.getHours() * 60 + date.getMinutes();

            return {
                type,
                note,
                minutesInDay,
                glucose: Number(glucoseValue),
            };
        })
        .sort((a, b) => a.minutesInDay - b.minutesInDay);

    const measures = data.filter((d) => d.type === "0" || d.type === "1");
    const meals = data.filter((d) => d.type === "5");

    return { measures, meals };
};

export const DailyChart: FC<{ selectedDay: Date }> = ({ selectedDay }) => {
    const [currentImportState] = useRecoilState(importerState);

    const glucoseData = useMemo(
        () => extractGlucoseData(currentImportState.lines, selectedDay),
        [selectedDay, currentImportState.lines]
    );

    if (!currentImportState?.lines?.length) {
        return null;
    }

    if (!selectedDay) {
        return <div>Valassz ki egy napot!</div>;
    }

    if (!currentImportState.lines) {
        return <div>Tolts fel rendes adatokat!</div>;
    }

    if (!glucoseData) {
        return <div>Valamit elrontottam :(</div>;
    }

    return (
        <div>
            <h3>{format(selectedDay, "MM-dd")}</h3>
            <LineChart
                width={800}
                height={400}
                data={glucoseData.measures}
                margin={{
                    top: 80,
                    left: 0,
                    right: 0,
                    bottom: 0,
                }}
            >
                <Line type="monotone" dataKey="glucose" stroke="#8884d8" />
                <XAxis
                    dataKey="minutesInDay"
                    type="number"
                    tickFormatter={(minutesInDay) => minutesInDayFormatter(minutesInDay)}
                    domain={[0, 24 * 60]}
                    tickCount={60}
                />
                <YAxis type="number" domain={[2, 12]} tickCount={10} />
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

                {glucoseData.meals.map((m, i) => (
                    <ReferenceLine
                        key={i}
                        isFront
                        x={m.minutesInDay}
                        stroke="orange"
                        strokeDasharray="3 3"
                        label={`(${m.note})🍎`}
                    />
                ))}
            </LineChart>
        </div>
    );
};
