import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';
@Injectable()
export class CustomInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const baseUrl = environment.endPoint;

    return this.authService.accessToken$.pipe(

      switchMap((accessToken) => {
          const modifiedRequest = request.clone({
          url: `${baseUrl}/${request.url}`,
          setHeaders: {
            Authorization: `Bearer ${accessToken || localStorage.getItem('@dpApiAccess')}`
          }
        });

        console.log('Modified Request URL:', modifiedRequest.url);

        return next.handle(modifiedRequest).pipe(
          catchError((error: HttpErrorResponse) => {

            if (error.ok === false && error.status === 0)
              return throwError({message: 'Erro de conexão tente mais tarde.'});
            else if (error.status === 401) {
              return throwError({message: 'Erro de autenticação, tente atualizar a página ou realize novamente o login.'});
            }
            return throwError(error);
          })
        );
      })
    );
  }
}
