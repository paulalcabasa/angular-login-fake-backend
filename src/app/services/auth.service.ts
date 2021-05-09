import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(credentials) {
    return this.http.post('/api/authenticate', 
      JSON.stringify(credentials))
      .pipe( 
        map( (response: any) => {
          let result = response;
          if(result && result.token) {
            localStorage.setItem('token', result.token);
            return true;
          }
          return false;
        })
      );
  }

  logout() {
  }

  isLoggedIn() {
    return false;
  }

}
