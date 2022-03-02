
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

export type Book = {
  id: string;
  volumeInfo: {
    title: string;
    subtitle: string;
    authors: string[];
    publisher: string;
    publishDate: string;
    description: string;
    averageRating: number;
    ratingsCount: number;
    imageLinks: {
      thumbnail: string;
      smallThumbnail: string;
    };
  };
}

@Injectable({ providedIn: 'root' })
export class GoogleApiService {
  private API_PATH = 'https://www.googleapis.com/books/v1/volumes';
  bookSummary = {}

  constructor(private http: HttpClient) { }

  search(query: string): Observable<Book[]> {
    return this.http
      .get<{ items: Book[] }>(`${this.API_PATH}?q=${query}`)
      .pipe(map(books => books.items || []));
  }

  getById(volumeId: string): Observable<Book> {
    return this.http.get<Book>(`${this.API_PATH}/${volumeId}`);
  }
 
  async findBookSummary(books, bookIds) {
    await Promise.all(books.map(async (book, index) => {
      const books:Book[] = await this.search(book).toPromise();
     
      if(!books[0]) {
        this.bookSummary[bookIds[index]] = [];
        return;
      }
      const bookid = books[0].id; 
      const book_details = await this.getById(bookid).toPromise();
      this.bookSummary[bookIds[index]] = book_details
    }));
  }

  getBookSummary() {
    return this.bookSummary;
  }

}