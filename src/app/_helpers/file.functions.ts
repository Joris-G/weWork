import { Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root'
})
export class FileFunction {
    constructor() { }

    getCsv(inputData: any): any {
        return new Promise((resolve, reject) => {
            if (inputData.files && inputData.files[0]) {
                var myFile = inputData.files[0];
                var reader = new FileReader();
                reader.addEventListener('load', (e) => {
                    let csvdata: any = e.target.result;
                    resolve(this.getParsecsvdata(csvdata));
                });
                reader.readAsBinaryString(myFile);
            }
        })

    }

    private getParsecsvdata(csvData: any): any {
        let parsedata = [];
        let newLinebrk = csvData.split("\n");
        for (let i = 1; i < newLinebrk.length; i++) {
            parsedata.push(newLinebrk[i].split(";"));
        }
        console.table(parsedata);
        return parsedata;
    }

}
