import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SYSTEM_NAME } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class TopkresultsService {

  private API_URL = 'fiction/search?bookID='
  //private API_URL = 'http://localhost:8080/fiction/search?bookID='
  systemName = SYSTEM_NAME.simfic
  constructor(private http : HttpClient) { }
  
  setSystemName(systemName) {
    this.systemName = systemName;
  } 

  getSystemName() {
    return this.systemName;
  }

  getTopKResults(bookID: string, language : string, systemName : string) {
   return this.http.get(this.API_URL + bookID + '&language=' + language +'&systemName=' +systemName , {responseType : 'text'});
  }
}

