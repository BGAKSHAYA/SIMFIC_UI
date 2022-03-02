import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';
import { HttpClientModule }    from '@angular/common/http';
import { ResultComponent } from './result/result.component';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { DefaultpageComponent } from './defaultpage/defaultpage.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NgbModule, NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap'; 

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    ResultComponent,
    DefaultpageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    DeviceDetectorModule.forRoot(),
    NgbModule,
    BrowserAnimationsModule
  ],
  providers: [     
     NgbTooltipConfig
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
