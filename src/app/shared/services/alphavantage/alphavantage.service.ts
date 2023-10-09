// Alphavantage API to grab public stock data

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {Router} from '@angular/router';
import {map} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlphavantageService {
  private readonly apiKey = environment.alphaToken;
  private readonly alphaBase = environment.alphaBaseUrl;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
  }

  // Call Alphavantage to retrieve quote by a symbol
  getStockBySymbol(symbol: string) {
    let header = new HttpHeaders();
    header = header.set('Content-Type', 'application/json');
    return this.http.get(`${this.alphaBase}/query?apikey=${this.apiKey}&function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact`, {headers: header})
      .pipe(map(data => {
        return this.formatData(data);
      }));
  }

  // format Alphavantage data
  formatData(data: any) {
    let info = {subject: {}, data: {}};
    for (const key of Object.keys(data)) {
      let obj = data[key];
      if (typeof obj === 'object' && obj.hasOwnProperty('2. Symbol')) {
        info.subject = obj;
      } else {
        info.data = this.convertToArray(obj)
      }
    }
    return info
  }

  // format data and convert object and array
  convertToArray(data: any) {
    let array: AlphavantageData[] = [];
    for (const [key, value] of Object.entries(data)) {
      array.push(this.getAlphaData(key, value))
    }
    return array;
  }

  // get an object of alpha data
  getAlphaData(key: string, value: any): AlphavantageData {
    return {
      date: new Date(key),
      open: parseFloat(value[AlphavantageKeys.OPEN]),
      high: parseFloat(value[AlphavantageKeys.HIGH]),
      low: parseFloat(value[AlphavantageKeys.LOW]),
      close: parseFloat(value[AlphavantageKeys.CLOSE]),
      volume: parseFloat(value[AlphavantageKeys.VOLUME]),
    }
  }

  // Error handling
  notFound() {
    this.router.navigate(['not-found']);
  }
}

// Alphavantage keys of object
enum AlphavantageKeys {
  OPEN = '1. open',
  HIGH = '2. high',
  LOW = '3. low',
  CLOSE = '4. close',
  VOLUME = '5. volume',
}

// type definition
export interface AlphavantageData {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  date: Date;
}
