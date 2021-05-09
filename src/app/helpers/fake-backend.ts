import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.endsWith('/api/authenticate') && method === 'POST':
                    return authenticate();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }    
        }

        // route functions

        function authenticate() {
            const {email, password}  = JSON.parse(body);
            let users = [
                {
                    id : 1,
                    email : 'paul@domain.com',
                    password : '1234',
                    name : 'Paul Alcabasa',
                    admin : true,
                    token : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJwYXVsQGRvbWFpbi5jb20iLCJuYW1lIjoiUGF1bCBBbGNhYmFzYSIsImFkbWluIjp0cnVlLCJpYXQiOjE1MTYyMzkwMjJ9.7fcY3KGrcNYleZxhItM61qxccarxd5mvpza31WuHrv8'
                },
                {
                    id : 1,
                    email : 'france@domain.com',
                    password : '1234',
                    name : 'Francia Clavillas',
                    admin : false,
                    token : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJmcmFuY2VAZG9tYWluLmNvbSIsIm5hbWUiOiJGcmFuY2lhIENsYXZpbGxhcyIsImFkbWluIjpmYWxzZSwiaWF0IjoxNTE2MjM5MDIyfQ.q1WiKUcZ8vz-7-wPGeHtio2KgbPSvruH4cCql6ECvzA' 
                },
            ];
    
            const user = users.find(userData => 
                (userData.email == email && userData.password == password)
            );
            if (!user) return error({message : 'Username or password is incorrect'});
            return ok({
                id: user.id,
                email: user.email,
                name: user.name,
                admin : user.admin,
                token: user.token
            })
        }

    

     

       

        // helper functions

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
        }

        function error(body?) {
            return of(new HttpResponse({ status: 200, body }))
            //return throwError({ error: { message } });
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function isLoggedIn() {
            return headers.get('Authorization') === 'Bearer fake-jwt-token';
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }
    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};


    