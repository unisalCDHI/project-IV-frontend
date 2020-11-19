import {
    HttpErrorResponse, HttpEvent,

    HttpHandler, HttpInterceptor,

    HttpRequest, HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class HttpsRequestInterceptor implements HttpInterceptor {
    constructor() { }
    intercept(
        req: HttpRequest<any>,
        next: HttpHandler,
    ): Observable<HttpEvent<any>> {
        const dupReq = req.clone({
            headers: req.headers.set('Authorization', localStorage.getItem('token') ? localStorage.getItem('token') : ''),
        });
        return next.handle(dupReq).pipe(
            map((event: any) => {
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                if (error.status === 403) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('id');
                    window.location.reload();
                }
                return throwError(error);
            }));
    }
}

@NgModule({
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpsRequestInterceptor,
            multi: true,
        },
    ],
})

export class Interceptor { }