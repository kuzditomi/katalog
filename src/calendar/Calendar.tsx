import { FC, useMemo } from "react";
import { useRecoilState } from "recoil";
import { importerState } from "../importer/importer.state";

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
    const days = useMemo(() => extractDays(currentImportState.lines.slice(2)), [currentImportState]);

    return (
        <div className="days">
            {days.map((d) => (
                <div key={d}>
                    <button>{d}</button>
                </div>
            ))}
        </div>
    );
};
