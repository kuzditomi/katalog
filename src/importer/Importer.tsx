import { ChangeEvent, FC, useCallback } from "react";
import { useRecoilState } from "recoil";
import { parseCsvFile } from "./csvreader";
import { importerState } from "./importer.state";

export const Importer: FC = () => {
    const [currentImportState, setImportstate] = useRecoilState(importerState);

    const changeHandler = useCallback(
        async (event: ChangeEvent<HTMLInputElement>) => {
            const csvData = await parseCsvFile(event.target.files![0]);

            setImportstate({
                fileName: event.target.files?.[0].name || "",
                lines: csvData,
            });
        },
        [setImportstate]
    );

    return (
        <div>
            <input
                type="file"
                name="file"
                accept=".csv"
                onChange={changeHandler}
                style={{ display: "block", margin: "10px auto" }}
            />
            <span>{currentImportState.fileName}</span>
        </div>
    );
};
