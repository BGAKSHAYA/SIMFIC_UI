import { Component, OnInit, Input, HostListener, NgZone, ElementRef, ViewChild } from '@angular/core';
import { ReadfilesService } from '../services/readfiles.service';
import { Book } from '../services/google-api.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { FEATURE_TYPES, FEATURE_DESCRIPTION, TOP_K } from '../constants';
import {BOOK} from '../search/search.component';
import { Router } from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { SessionToursService } from '../services/session-tours.service';
import { TopkresultsService } from '../services/topkresults.service';

interface  TOP_K_BOOK {
  rank : number,
  weight : number;
  bookId : string,
  bookInfo : Book
}

export interface UserTrackInterface {
  rank: number,
  browser: string,
  os : string,
  os_version : string,
  query: string,
  resultBookClicked : string,
  sessionTime: string,
  systemName: string
}

interface RANKED_FEATURE {
  rank: number,
  feature: string
}

declare var Tour:any
@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})


export class ResultComponent implements OnInit {
  TOP_K_BOOKS : TOP_K_BOOK[] =[];
  RANKED_FEATURES : RANKED_FEATURE[] =[];
  Important_Aspects = [];
  Local_Aspects =new Map();
  Feature_Description = FEATURE_DESCRIPTION;

  summaryBooks;
  clicked_book_index : number;
  deviceInfo;
  resultBookDetails : BOOK[] = [];

  results_tour: any;
  tour_started = false;

  @ViewChild('firstSeeMore') firstSeeMore : ElementRef;
  @Input('original_books') original_books ;
  @Input('searchedBook') searchedBook : string;
  @Input('searchedBookName') searchedBookName : string;
  @Input('session_time') session_time;
  
  @Input('searchResults')
  set searchResults(value) {

    this.clicked_book_index = -1;
    this.TOP_K_BOOKS = [];
    this.RANKED_FEATURES = [];
    this.resultBookDetails = [];
    this.Important_Aspects = [];
    this.Local_Aspects = new Map();
    
    if(!value) return

    value = value.replace('/{/g','').replace('/}/g', '');
    value = value.split('-');
    let topK = value[0];

    const results = topK.split(',').slice(0, TOP_K);
    results.forEach((result, rank) => {
        let row= result.split('=');
        row[1] = row[1].replace('}', '');
        if(row[1].split('pg')[1] != this.searchedBook)  {    
          let bookInfo = this.getBookInfo(row[1].split('pg')[1])
          this.TOP_K_BOOKS.push({rank: rank+1, weight : row[0], bookId:row[1], bookInfo})
          this.resultBookDetails.push(this.original_books.filter((book) => book.bookId== row[1].split('pg')[1])[0]);
        }
    });
 
    if(value.length != 1) {

        let ranks = value[1];
        let localranks = value[2];
        const ranked_features = ranks.split(',');
        ranked_features.forEach(feature_rank => {
          let row= feature_rank.split('=');
          let rank= parseInt(row[0].replace('{', ''));
          let feature = row[1].replace('}', '');;
          this.RANKED_FEATURES.push({rank, feature})
        });
        
        this.RANKED_FEATURES.forEach(ranked_feature => {
          let aspects = FEATURE_TYPES[ranked_feature.feature.trim().split(' ')[1]];
          aspects.forEach(aspect => {
                if(!this.Important_Aspects.includes(aspect))
                    this.Important_Aspects.push(aspect)
          })      
        }); 
        this.Important_Aspects = this.Important_Aspects.slice(0,3)
        let localfeatures = localranks.replace('{','')
        localfeatures = localfeatures.replace('}', '').split(', ');

        localfeatures.forEach(localfeature => {
          
          localfeature= localfeature.split('=')
          localfeature[1] = localfeature[1].replace('[','')
          localfeature[1] = localfeature[1].replace(']', '').split(',').slice(0,-1);
          localfeature[1] = localfeature[1].filter(value => value !='34').map(value => FEATURE_TYPES[value])
          let features = new Set()
          localfeature[1].forEach(element => {
            if(element)
              element.forEach(e => features.add(e))
          });
          
          this.Local_Aspects.set(localfeature[0].trim(), Array.from(features))
          
        })
    }
  }

  constructor(private readFileService: ReadfilesService, 
              private deviceService: DeviceDetectorService,
              private sessionToursService: SessionToursService,
              private topKService: TopkresultsService,
              private router: Router,
              location: PlatformLocation,
              private _ngZone: NgZone
  ) { }
  
  
  ngOnInit(): void {
      this.readFileService.getBookSummaryFile().subscribe(data => {
         this.summaryBooks = data;
      })
      this.deviceInfo = this.deviceService.getDeviceInfo();
  }

  ngAfterViewChecked() {

    if(this.firstSeeMore && !this.tour_started) {
      if(this.sessionToursService.showTours() !='false' ) {
          setTimeout(() => {
            this.startTour()
            this.tour_started = true;
          }, 500); 
      }
    }
  }

  getBookInfo(bookId) {
    if(!this.summaryBooks) return;
    const bookInfo = this.summaryBooks[bookId];
    if(bookInfo && bookInfo.volumeInfo && bookInfo.volumeInfo.description)
        bookInfo.volumeInfo.description = bookInfo.volumeInfo.description.replace(/<[^>]*>/g, '');
    return bookInfo;
  }

  seeMoreDetails(clicked_book_index, clicked_book) {
     if(this.results_tour)
        this.results_tour.goTo(1)
     this.clicked_book_index = clicked_book_index;
     this.sendUserTrack(clicked_book);
  }

  collapseSeeMore() {
    this.clicked_book_index = -1;
  }
  startTour() {
    this._ngZone.runOutsideAngular(() => {
      this.results_tour = new Tour({                           
          storage: false, 
          onEnd: (tour) => { this.sessionToursService.setTourInfo(false)  },
                       
      });
      this.results_tour.addStep({
          element: ".results--see_more-first",
          title: "Step 2",
          content: "Click on Read More to get more detailed information of the books",
          placement: 'bottom',
          backdrop: true  
      });
      this.results_tour.addStep({
        element: ".search--input",
        title: "Step 3",
        content: "Search books by Title/ Author/ Genre",
        placement: 'bottom',
        backdrop: true 
      });
      this.results_tour.addStep({
        element: ".search--settings-icon",
        title: "Step 4",
        content: "You can change the Search Settings here",
        placement: 'bottom',
        backdrop: true  

       });
      this.results_tour.init();
    });

    this.results_tour.start(true);
  }
  sendUserTrack(book) {
    const trackInfo : UserTrackInterface = {
      rank : book.rank,
      browser: this.deviceInfo.browser,
      os: this.deviceInfo.os,
      os_version: this.deviceInfo.os_version,
      query: this.searchedBook,
      resultBookClicked: book.bookId,
      sessionTime: this.session_time,
      systemName: this.topKService.getSystemName()
    }
    this.readFileService.sendUserTrackInfo(trackInfo).subscribe(data => data);
  }
 }
