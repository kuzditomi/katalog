export function parseCsvFile(file: File): Promise<string[]> {
    const promise = new Promise<string[]>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = (event) => {
            if(!event.target?.result){
                reject('invalid input');
                return;
            }

            const csvdata = event.target.result as string;
            const rowData = csvdata.split("\n").filter(l => l);

            resolve(rowData);
        };

        reader.onerror = (e) => reject(e);
    });

    return promise;
}
