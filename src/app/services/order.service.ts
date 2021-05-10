import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  orders;

  getOrders() {
    let headers = new HttpHeaders();
    let token = localStorage.getItem('token');
    headers.append('Authorization', 'Bearer ' + token);
    headers.append('Accept', 'application/json')

    return this.http.get('/api/orders', {
      headers: headers 
    }).pipe(
      map( (response: any) => {
        return response;
      })
    )// });.subscribe(response => {
    //   this.log(response);
    //   return response;
    // });
  }
}
