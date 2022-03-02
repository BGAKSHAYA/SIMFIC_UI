import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, NgZone } from '@angular/core';
import { ReadfilesService } from '../services/readfiles.service';
import { Papa } from 'ngx-papaparse';
import { ENGLISH_GENRES, ENGLISH_GENRES_DESCRIPTION, GERMAN_GENRES, LANGUAGES, ENGLISH_GENRES_LIST, GERMAN_GENRES_LIST , SYSTEM_NAME } from '../constants'
import { SimilarityCalculationService } from '../services/similarity-calculation.service';
import { GoogleApiService } from '../services/google-api.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { TopkresultsService } from '../services/topkresults.service';
import { Router } from '@angular/router';
import { SessionToursService } from '../services/session-tours.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { GoogleFormsReaderService } from '../services/google-forms-reader.service';


export interface BOOK {
  bookGenre: string;
  bookId: number;
  bookAuthor: string;
  bookName: string;
  bookLanguage: string;
  bookGenreDescription: string;
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})


export class SearchComponent implements OnInit, AfterViewInit {
  englishGenres = ENGLISH_GENRES;
  germanGenres = GERMAN_GENRES;
  languages = LANGUAGES;
  systemnames = SYSTEM_NAME


  systemChanged = false;
  original_books: BOOK[] = new Array();
  filtered_books: BOOK[] = new Array();

  selectedLanguage : string = LANGUAGES.English;
  selectedEnglishGenre = ENGLISH_GENRES.All;
  selectedGermanGenre = GERMAN_GENRES.All;

  searchedBook : number;
  searchedBookName : string;

  englishGenreList = ENGLISH_GENRES_LIST;
  germanGenreList = GERMAN_GENRES_LIST;

  features_extracted = new Map();
  searchResults;

  randomNumber1 = Math.ceil(Math.random()*10)
  randomNumber2 = Math.ceil(Math.random()*10)
  captchaResult = false

  sessionTime = localStorage.getItem('sessionTime') ? localStorage.getItem('sessionTime') : '';
  //sessionTime = '';
  isChromeBrowser: Boolean = false;
  isIEBrowser: Boolean = false;

  systemName : string = SYSTEM_NAME.simfic;
  displaySystemName : string = "System A";

  @ViewChild('bookNames') bookNames : ElementRef;
  @ViewChild('bookDataList') bookDataList : ElementRef;
  @ViewChild('captchaModal') captchaModal : ElementRef;
  @ViewChild('captchaSubmit') captchaSubmit : ElementRef;

  constructor(private sanitizer: DomSanitizer, 
              private readfilesService: ReadfilesService,
              private papa: Papa,
              private similarityCalculationService : SimilarityCalculationService, 
              private googleApiService: GoogleApiService,
              private sessionToursService: SessionToursService,
              private topKResults: TopkresultsService,
              private router: Router,
              private deviceService: DeviceDetectorService,
              private googleFormsReader : GoogleFormsReaderService)   { }

  ngOnInit(): void {
    
    this.readfilesService.getBooksCsv().subscribe(data => {
      this.papa.parse(data, {
        complete: (result) => {
          const bookCategoryIndex = result.data[0].indexOf('Category');
          let allBookNames = [];
          let allBookIDs = [];
          for (var i = 1; i < result.data.length; i += 1) {
            let row = result.data[i];
            if(row.length !=5 ) continue
            let hasCommasInAuthorName = row[bookCategoryIndex + 4].split(',')
            let book = {
              bookGenre: row[bookCategoryIndex].trim(),
              bookId: row[bookCategoryIndex + 1],
              bookName: row[bookCategoryIndex + 2].split('\n')[0],
              bookLanguage: row[bookCategoryIndex + 3 ],
              bookAuthor:  hasCommasInAuthorName.length == 2 ? hasCommasInAuthorName[1] + ' '+ hasCommasInAuthorName[0] : row[bookCategoryIndex + 4],
              bookGenreDescription: ENGLISH_GENRES_DESCRIPTION[row[bookCategoryIndex]]
            };
            this.original_books.push(book);
            allBookNames.push(row[bookCategoryIndex + 2].split('\n')[0]);
            allBookIDs.push(row[bookCategoryIndex + 1])
           }
          //  this.googleApiService.findBookSummary(allBookNames, allBookIDs);
           this.filtered_books = this.original_books;
       }})

    })


    this.readfilesService.getFeaturesExtractedCsvFile().subscribe((data: any) => {
      this.papa.parse(data, {
        complete: (result) => {
          for(let i = 1; i < result.data.length; i+=1) {
            const row = result.data[i];
            const bookId =  row[0];
            const featureValues  = row.slice(1,row.length);
            this.features_extracted.set(bookId, featureValues);
        }
      }
    })
   })

   this.isChromeBrowser = this.deviceService.getDeviceInfo().browser == 'Chrome';
   this.isIEBrowser = this.deviceService.getDeviceInfo().browser == 'IE'
  }

  ngAfterViewInit() {
    if(!this.sessionTime)
       this.captchaModal.nativeElement.click();
  }

  startTourForApp() {
    location.reload();
    this.sessionToursService.setTourInfo(true)
  }

  navigateToHome() {
    this.systemChanged = true;
    this.searchResults = null;
    this.bookNames.nativeElement.value = '';

  }
  checkCaptchaResult(event){
      this.captchaResult = this.randomNumber1 + this.randomNumber2 == parseInt(event.srcElement.value);
      if(event.keyCode == 13) {
          this.captchaSubmit.nativeElement.click();
      }
  }
  onLanguageChange(value) {
    this.selectedLanguage = value;
    this.filtered_books = this.original_books.filter((book) => book.bookLanguage == this.selectedLanguage);
    this.selectedGermanGenre = this.germanGenres.All;
    this.selectedEnglishGenre = this.englishGenres.All;
  }

  onGenreChange(value) {
    if(this.selectedLanguage == LANGUAGES.English) {
      this.selectedEnglishGenre = value;
      if(this.selectedEnglishGenre == this.englishGenres.All)
            this.filtered_books = this.original_books.filter((book) => book.bookLanguage == this.selectedLanguage)
      else
            this.filtered_books = this.original_books.filter((book) => book.bookLanguage == this.selectedLanguage && book.bookGenre.trim() == this.selectedEnglishGenre)
    } else {
      this.selectedGermanGenre = value;
      if(this.selectedGermanGenre == this.germanGenres.All)
            this.filtered_books = this.original_books.filter((book) => book.bookLanguage == this.selectedLanguage)
      else
            this.filtered_books = this.original_books.filter((book) => book.bookLanguage == this.selectedLanguage && book.bookGenre.trim() == this.selectedGermanGenre)
    }
  }

  onSearch() {
    const querybook = this.original_books.filter((book) => this.replaceUmlauts(book.bookName).trim().toLowerCase().replace(' ','') == this.replaceUmlauts(this.bookNames.nativeElement.value.split(' by ')[0]).trim().toLowerCase().replace(' ',''))[0]
    if(querybook) {
      this.searchedBook = querybook.bookId;
      this.searchedBookName = querybook.bookName;
      this.searchResults = null;
      this.topKResults.getTopKResults('pg'+this.searchedBook, this.selectedLanguage,this.systemName).subscribe((data : any)=> this.searchResults = data);
      this.systemChanged = false;
      this.bookNames.nativeElement.value = this.searchedBookName;

    }
  }

  onSearchWithId(bookId) {
    this.searchedBook = bookId;
    let searchedBookDetails =this.original_books.filter((book) => book.bookId== this.searchedBook)[0]
    this.searchedBookName = searchedBookDetails.bookName;
    let searchedBookLanguage = searchedBookDetails.bookLanguage;

    this.topKResults.getTopKResults('pg'+this.searchedBook, searchedBookLanguage ,this.systemName).subscribe((data : any)=> this.searchResults = data);
    this.bookNames.nativeElement.value = this.searchedBookName;
    this.systemChanged = false;
  }

  //To generate the book information from Google Books API
  get dataUri(): SafeUrl {
    const jsonData = JSON.stringify(this.googleApiService.getBookSummary());
    const uri = 'data:application/json;charset=UTF-8,' + encodeURIComponent(jsonData);
    return this.sanitizer.bypassSecurityTrustUrl(uri);
  }

  captureSessionInfo() {
    this.sessionTime = new Date().toString()
    localStorage.setItem('sessionTime', this.sessionTime)
  }
  replaceUmlauts = function(s) {
    const tr = {"ä":"ae", "ü":"ue", "ö":"oe", "ß":"ss" }
    return s.replace(/[äöüß]/g, function($0) { return tr[$0] })
   }

   onSystemChange(systemName:string){
      this.systemChanged = this.systemName!=systemName;
      this.systemName= systemName;
      this.topKResults.setSystemName(this.systemName);
      this.searchResults = null;
      this.bookNames.nativeElement.value = '';
   }

   async redirectForms() {
    window.open(await this.googleFormsReader.readGoogleForms())
   }
}
