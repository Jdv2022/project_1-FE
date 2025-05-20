import { HttpClient } from "@angular/common/http";
import { ApiBase } from "src/app/core/base/api.base";
import { LogService } from "src/app/core/services/log.service";
import { Observable } from "rxjs";
import { ModelResponseBase } from "src/app/core/base/model.response.base";
import { ModelRequestBase } from "src/app/core/base/model.request.base";
import { Injectable } from "@angular/core";
import { RefreshTokenRequestModel } from "src/app/core/contracts/refresh-token.request.model";

@Injectable()
export class AadAuthService extends ApiBase{

	constructor(
		protected http: HttpClient,
		protected log: LogService
	) {
		super(http, log);
	}

	public validateToken(data: RefreshTokenRequestModel): Observable<ModelResponseBase> {
		const payload = new ModelRequestBase({
			endpoint: "web/private/validate/token",
			payload: data,
			isEncrypt: false
		});
		return this.post(payload);
	}

}