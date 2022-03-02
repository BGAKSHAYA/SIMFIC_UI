import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GOOGLE_API_KEY, GOOGLE_SHEETS, GOOGLE_FORMS } from '../constants';
import { Observable } from 'rxjs';
import { async } from '@angular/core/testing';

@Injectable({
  providedIn: 'root'
})
export class GoogleFormsReaderService {

  sheetsData = new Map()
  selectedSheet;
  constructor(private http: HttpClient) { }

  getForm(sheet : string) : Observable<any> {
    let url = 'https://sheets.googleapis.com/v4/spreadsheets/' + sheet + '/values/A:A?key=' + GOOGLE_API_KEY;
    return this.http.get(url);
  }

  async readGoogleForms() {
    await Promise.all(GOOGLE_SHEETS.map( async (sheet, index) => {
          const sheetData = await this.getForm(sheet).toPromise();
          this.sheetsData.set(index, sheetData)
    }))
    let minLength= this.sheetsData.get(0).values ? this.sheetsData.get(0).values.length : 0;
    let selectionSheet = 0;
    this.sheetsData.forEach((sheetData, index) => {
        selectionSheet = sheetData.values && sheetData.values.length < minLength ? index : selectionSheet;
    })
    this.selectedSheet = selectionSheet;
    return GOOGLE_FORMS[this.selectedSheet];
  }

}
