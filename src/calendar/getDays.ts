
/**
 *
 * @returns format dd-MM-yyyy
 */
export function getDays (lines: string[]): string[] {
    if (!lines?.length) {
        return [];
    }

    const dates = lines.map((l) => l.split(",")[2].split(" ")[0]);
    const days = new Set(dates);

    return Array.from(days.keys());
}