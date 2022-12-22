import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class ComponentsService {

  private API_URL = "https://api.themoviedb.org/3/movie/top_rated/"
  private API_RELEASE ="{movie_id}/release_dates?"
  private API_KEY = "?api_key=b194194954a1e2b3515bed02aa0f04c0"


  constructor(
    private http : HttpClient
  ) { }

  public getMostPupolarFilms$(page: number) {
    return this.http.get(`${this.API_URL+this.API_KEY}&page=${page}`);
  }

  public getReleaseDate$() {
    return this.http.get("https://api.themoviedb.org/3/certification/movie/list?api_key=b194194954a1e2b3515bed02aa0f04c0")
  }

  public getCertifications$(id: number) {
    return this.http.get(`https://api.themoviedb.org/3/movie/${id}/release_dates?api_key=b194194954a1e2b3515bed02aa0f04c0`)
  }
}

