import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpResponse } from '@angular/common/http';
import { catchError, map, Observable, switchMap, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { LogService } from '../services/log.service';
import { environment } from 'src/environments/environment';
import { EncDecService } from '../services/encdec.service';
import { ModelRequestBase } from './model.request.base';
import { ModelResponseBase } from './model.response.base';
import { StorageService } from '../services/storage.service';
import { RefreshTokenService } from '../services/refresh-token.service';
import { Router } from '@angular/router';


export const interceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
	if (!req.url.trim().startsWith(environment.baseUrl)) {
        return next(req); 
    }

    const log = inject(LogService);
    const route = inject(Router);
    const encdec = inject(EncDecService);
    const storage = inject(StorageService);
    const modifiedReq = request(req, log, encdec, storage);

	return next(modifiedReq).pipe(
		map((event: HttpEvent<any>) => {
			if (event instanceof HttpResponse) {
				return response(event, log, encdec);
			}
			return event;
		}),
		catchError((error: HttpErrorResponse) => {
			// If 401, try to refresh token
			if (error.status === 401) {
				log.logDebug("Status is 401");
				const refreshTokenService = inject(RefreshTokenService);
				const storageService = inject(StorageService);
				log.logDebug("Initializing action [Refresh]");
				return refreshTokenService.actionRefresh().pipe(
					switchMap((success) => {
						if(!success) {
							route.navigate([''])
						}
						const newToken = storageService.getToken(); 
						const newReq = req.clone({
							headers: req.headers.set('Authorization', `Bearer ${newToken}`)
						});
						return next(newReq); 
					}),
					catchError(refreshErr => throwError(() => refreshErr))
				);
			}
		
			return throwError(() => error);
		})
	);
};

function request(
	req: HttpRequest<any>, 
	log: LogService, 
	encdec: EncDecService, 
	storage: StorageService
): HttpRequest<any> {
    log.logDebug("/------------------------REQUEST------------------------/");
    log.logDebug(`Request URL: [${req.url}]`);
    log.logDebug(`Request Headers: ${JSON.stringify(
        req.headers.keys().map(key => ({ [key]: req.headers.get(key) })), 
        null, 2
    )}`);
    log.logDebug(`Request Method [${req.method}]`);
    log.logDebug(`Request is with Credentials [${req.withCredentials}]`);
    log.logDebug(`Request Body: ${JSON.stringify(req.body, null, 2)}\n`);

	let reqData = req.body;

	if (reqData.isfile) {
		if(reqData.isEncrypt) {
		  	reqData.payload = encdec.encrypt(reqData.payload);
		}
		if(reqData.file) {
		  const formData = new FormData();
		  formData.append('payload', JSON.stringify(reqData.payload));
		  formData.append('file', reqData.file);
		  formData.append('isEncrypt', JSON.stringify(reqData.isEncrypt));
		  
		  reqData = formData;
		} 
		else {
		  const formData = new FormData();
		  formData.append('payload', JSON.stringify(reqData.payload));
		  formData.append('isEncrypt', JSON.stringify(reqData.isEncrypt));
		  reqData = formData;
		}
	} 
	else {
		if(reqData.isEncrypt) {
			reqData.payload = encdec.encrypt(reqData.payload);
		}
	}

	const token = storage.getToken();
	return req.clone({ 
		body: reqData,
		setHeaders: { Authorization: token ? `Bearer ${token}` : '' }
	});	  
}

function response(
	res: HttpResponse<any>, 
	log: LogService, 
	encdec: EncDecService
): HttpResponse<any> {
    log.logDebug(`Response status: ${res.status}`);
    log.logDebug("/------------------------RESPONSE------------------------/");

	let resData: ModelResponseBase = res.body;
	if(resData.isEncrypted) {
		resData.payload = encdec.decrypt(resData.payload);
	}
    return res.clone({ body: resData });
}

