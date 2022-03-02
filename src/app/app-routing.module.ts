import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { ResultComponent } from './result/result.component';
import { AppComponent } from './app.component';


const routes: Routes = [
  // { path: 'index', component: AppComponent },
  // { path: 'results', component: ResultComponent },
  // { path: '',   redirectTo: '/index', pathMatch: 'full' }, // redirect to `first-component`
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
