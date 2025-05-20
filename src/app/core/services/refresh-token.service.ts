import { Observable } from "rxjs";
import { ModelResponseBase } from "../base/model.response.base";
import { ModelRequestBase } from "../base/model.request.base";
import { ApiBase } from "../base/api.base";
import { Injectable } from "@angular/core";
import { LogService } from "./log.service";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "./storage.service";
import { RefreshTokenRequestModel } from "../contracts/refresh-token.request.model";
import { RefreshTokenResponseModel } from "../contracts/refresh-token.response.model";


@Injectable({ providedIn: 'root' })
export class RefreshTokenService extends ApiBase {

	constructor(
		protected log: LogService,
		protected http: HttpClient,
		private storageService: StorageService,
	) {
		super(http, log);
	}

	public actionRefresh(): Observable<boolean> {
		const model = new RefreshTokenRequestModel();
		return new Observable<boolean>((observer) => {
			this.refreshToken({ ...model }).subscribe({
				next: (response) => {
					this.log.logDebug(`Refresh Token Data Response: ${JSON.stringify(response)}`);
					const data  = new RefreshTokenResponseModel(response.payload);
					this.storageService.setToken(data.payload);
					observer.next(true); 
					observer.complete();
				},
				error: (error) => {
					this.log.logError(`Refresh Token Error: ${JSON.stringify(error)}`);
					observer.next(false); 
					observer.complete();
				}
			});
		});
	}

	public refreshToken(data: RefreshTokenRequestModel): Observable<ModelResponseBase> {
		const payload = new ModelRequestBase({
			endpoint: "web/private/refresh/token",
			payload: data,
		});
		return this.post(payload);
	}

}