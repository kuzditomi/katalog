import { atom } from "recoil";

type CalendarState = {
    from: Date | null;
    to: Date | null;
};

export const calendarState = atom<CalendarState>({
    key: "calendarState",
    default: {
        from: null,
        to: null,
    },
});
