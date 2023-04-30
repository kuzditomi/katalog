import { atom } from "recoil";

type CalendarState = {
    selectedDay: Date | null
}

export const calendarState = atom<CalendarState>({
    key: "calendarState",
    default: {
        selectedDay: null,
    },
});
