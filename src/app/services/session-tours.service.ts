import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionToursService {

  constructor() { }

  showTours() {
    const showTours = localStorage.getItem('showTours');
    return showTours == null || showTours
  }

  setTourInfo(showTours) {
    localStorage.setItem('showTours', showTours);
  }
}
