import { Component } from '@angular/core';
import { TopkresultsService } from './services/topkresults.service';
import { LANGUAGES, SYSTEM_NAME } from './constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'fictionUI';

  constructor(private topKResults: TopkresultsService) {}
  ngOnInit() {
    this.topKResults.getTopKResults('pg1400', LANGUAGES.English, SYSTEM_NAME.random).subscribe((data : any)=> data);
  }
}
