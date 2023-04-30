import { ChangeEvent, FC, useCallback } from "react";
import { atom, useRecoilState } from "recoil";

const importState = atom({
    key: "importState",
    default: {
        fileName: "",
    },
});

export const Importer: FC = () => {
    const [currentImportState, setImportstate] = useRecoilState(importState);

    const changeHandler = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setImportstate({
                ...currentImportState,
                fileName: event.target.files?.[0].name || "",
            });
        },
        [currentImportState, setImportstate]
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
