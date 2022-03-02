import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserTrackInterface } from '../result/result.component';

@Injectable({
  providedIn: 'root'
})
export class ReadfilesService {

  featuresExtractedCsvFile = 'assets/Features_Extracted.txt';
  booksCsvFile = 'assets/Books.txt';
  bookSummaryFile = 'assets/booksummary.json';

  constructor( private http: HttpClient) { }

  getFeaturesExtractedCsvFile() {
     return this.http.get(this.featuresExtractedCsvFile,  { responseType: 'text'})
  }

  getBooksCsv() {
    return this.http.get(this.booksCsvFile,  { responseType: 'text'})
  }

  getBookSummaryFile() {
    return this.http.get(this.bookSummaryFile)
  }

  sendUserTrackInfo(trackInfo : UserTrackInterface) {
    return this.http.post('/track', trackInfo,   { responseType: 'text'});
  }
}
