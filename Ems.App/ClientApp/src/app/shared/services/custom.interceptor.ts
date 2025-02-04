import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class CustomInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        let appToken = sessionStorage.getItem('app.token');

        if (request.url.includes("/Register")) {
            request = request.clone({
                withCredentials: true,
                reportProgress: true,
            });
            return next.handle(request);
        }

        if (request.url.includes("User/login")) {
            request = request.clone({
                withCredentials: true,
                reportProgress: true,
            });
        } else {
            if (!appToken) {
                console.error('Token is null');
                return null;
            }
            request = request.clone({
                withCredentials: true,
                reportProgress: true,
                setHeaders: {
                    Authorization: `Bearer ${appToken}`
                }
            });
        }
        return next.handle(request)
    }
}
