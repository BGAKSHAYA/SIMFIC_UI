import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SimilarityCalculationService {

  queryBookChunks = new Map();
  chunkLevelSimilarity = new Map();
  chunk_results = new Map();
  book_results = new Map();
  books_lengths = new Map();

  constructor() { }

  getChunkLevelSimilarity(queryBook, features_extracted) {
    for (const key of features_extracted.keys()) {
      if(key.includes(queryBook)) {
         this.queryBookChunks.set(key, features_extracted.get(key));
         features_extracted.delete(key);
      } else {
        let bookId = key.split('-')[0];
        if(this.books_lengths.get(bookId))
          this.books_lengths.set(bookId, this.books_lengths.get(bookId) + 1);
        else 
          this.books_lengths.set(bookId, 1);
      }
    }
    for(const queryBookChunk of this.queryBookChunks.keys()) {
       for(const corpusBookChunk of features_extracted.keys()) {
          const result = this.getL2Similarity(this.queryBookChunks.get(queryBookChunk), features_extracted.get(corpusBookChunk));
          this.chunk_results.set(corpusBookChunk, result);
       }
       this.chunk_results =  new Map([...this.chunk_results.entries()].sort((a, b) => b[1] - a[1]));
       let topKresults_chunks = new Map();
       let topK = 75;
       const chunks = this.chunk_results.keys();
       for(let k = 0; k < topK; k++) {
         const nextChunk = chunks.next().value;
         if(this.chunkLevelSimilarity.get(nextChunk)) {
            const addedSimilarityScore =  this.chunk_results.get(nextChunk) +  this.chunkLevelSimilarity.get(nextChunk);
            this.chunkLevelSimilarity.set(nextChunk, Math.round(addedSimilarityScore* 10000.0000) / 10000.0000);

         } else {
          this.chunkLevelSimilarity.set(nextChunk,  this.chunk_results.get(nextChunk));
         }        
       }
    }

    this.book_results = new Map();
    for(const chunkBook of this.chunkLevelSimilarity.keys()) {
       let bookId = chunkBook.split('-')[0];
       if(bookId == 'pg10067')
       if(this.book_results.get(bookId))
          this.book_results.set(bookId, this.book_results.get(bookId) + this.chunkLevelSimilarity.get(chunkBook));
       else
          this.book_results.set(bookId,  this.chunkLevelSimilarity.get(chunkBook)); 
         //this.book_results.set(bookId, Math.round((book_weight / noOfChunks) * 10000.0000) / 10000.0000)
    }
  
    for(const bookId of this.book_results.keys()) {
      const book_weight = this.book_results.get(bookId);
      const noOfChunks = this.books_lengths.get(bookId);
      this.book_results.set(bookId, Math.round((book_weight / noOfChunks) * 10000.0000) / 10000.0000);
    }
  }
 
  getCosineSimilarity(feature1, feature2) {
    let dotproduct = 0;
    let firstFeatureLength = 0;
    let secondFeatureLength = 0;
     for(let i=0; i<feature1.length; i++) {
        let v1 = parseFloat(feature1[i]);
        let v2 = parseFloat(feature2[i]);
        dotproduct += v1*v2;
        firstFeatureLength += v1*v1;
        secondFeatureLength += v2*v2;
     }
     firstFeatureLength = Math.sqrt(firstFeatureLength);
     secondFeatureLength = Math.sqrt(secondFeatureLength);
     return dotproduct/(firstFeatureLength * secondFeatureLength)
  }

  getL2Similarity(feature1, feature2) {
    let result = 0.0;
     for(let i=0; i<feature1.length-2; i++) {
        let v1 = parseFloat(feature1[i]);
        let v2 = parseFloat(feature2[i]);
        result += Math.pow(v2-v1, 2);
     }
     result = Math.sqrt(result);
     result = 1/(1 + result);
     result = Math.round(result * 10000.0000) / 10000.0000
     return result;
  }

}
