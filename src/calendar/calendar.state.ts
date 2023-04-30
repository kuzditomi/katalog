import { atom } from "recoil";

type CalendarState = {
    selectedDay: string
}

export const calendarState = atom<CalendarState>({
    key: "calendarState",
    default: {
        selectedDay: "",
    },
});
