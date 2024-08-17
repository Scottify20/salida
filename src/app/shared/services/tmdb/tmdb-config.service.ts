import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TmdbConfigService {
  constructor() {}

  // baseUrl = 'https://omdb-titles-browser-api-proxy.vercel.app/api/tmdb';
  baseUrl = 'http://192.168.100.238:8000/api/tmdb';
}
