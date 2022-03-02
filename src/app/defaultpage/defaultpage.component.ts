import { Component, OnInit, EventEmitter, Output, NgZone, ɵbypassSanitizationTrustResourceUrl } from '@angular/core';
import { ReadfilesService } from '../services/readfiles.service';
import { SessionToursService } from '../services/session-tours.service';

declare var Tour;
@Component({
  selector: 'app-defaultpage',
  templateUrl: './defaultpage.component.html',
  styleUrls: ['./defaultpage.component.scss']
})
export class DefaultpageComponent implements OnInit {
  init_tour: any;
  results_tour: any;


  @Output() searchedBook = new EventEmitter();
  constructor(private readFileService: ReadfilesService,
              private _ngZone: NgZone,
              private sessionToursService: SessionToursService
  ) { }

  defaultLiteraryBooks = ["1261", "1261", "1261", "1261", "1261" ]
  defaultDetectiveBooks = ["1032"]

  //defaultBooks = ["1261", "1032", "1095", "1888", "1263" ] //, "284", "2057"
  defaultBooks = ["1400", "1342",  "2852", "5323", "6498"] //, "284", "2057"
  summaryBooks;

  defaultBookInfo = []

  ngOnInit(): void {
      this.readFileService.getBookSummaryFile().subscribe(data => {
         this.summaryBooks = data;
         this.defaultBooks.forEach(book => {
            const bookInfo = this.getBookInfo(book);
            this.defaultBookInfo.push({bookId : book, bookInfo});
         })
         if(this.sessionToursService.showTours() !='false') 
            this.startTour();
         });
  }

  startTour() {    
    this._ngZone.runOutsideAngular(() => {
      this.init_tour = new Tour({                           
          storage: false,   
          template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div>"
                     
      });
      this.init_tour.addStep({
          element: ".defaultpage--flex",
          title: "Step 1",
          animation: true,
          content: "Start your search for similar books with one of our favorite recommendations. Click one of the books to proceed",
          placement: "left",
          smartPlacement: true,      
          backdrop:true,
          onShow: function() {
            let x = <HTMLElement>document.querySelector('.popover')
         }
          
      });
      // Initialize the tour
      this.init_tour.init();

    });

    this.init_tour.start(true);
     
  }


  getBookInfo(bookId) {
    if(!this.summaryBooks) return;
    const bookInfo = this.summaryBooks[bookId];
    if(bookInfo && bookInfo.volumeInfo && bookInfo.volumeInfo.description)
        bookInfo.volumeInfo.description = bookInfo.volumeInfo.description.replace(/<[^>]*>/g, '');
    return bookInfo;
  }

  searchBook(bookId) {
    if(this.init_tour)
        this.init_tour.end();
    this.searchedBook.emit(bookId);
  }

}
