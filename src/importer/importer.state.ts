import { atom } from "recoil";

type ImportedData = {
    fileName: string;
    lines: string[]
}

export const importerState = atom<ImportedData>({
    key: "importState",
    default: {
        fileName: "",
        lines: []
    },
});
