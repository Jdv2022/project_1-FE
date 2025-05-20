import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiBase } from "src/app/core/base/api.base";
import { ModelRequestBase } from "src/app/core/base/model.request.base";
import { ModelResponseBase } from "src/app/core/base/model.response.base";
import { LogService } from "src/app/core/services/log.service";
import { LoginRequestModel } from "./login.request.model";


@Injectable()
export class LoginService extends ApiBase {

	public constructor(
		protected http: HttpClient,
		protected log:LogService
	) {
		super(http, log);
	}

	public login(data: LoginRequestModel): Observable<ModelResponseBase> {
		this.log.logDebug(`Login Data: ${data}`);
		const payload = new ModelRequestBase({
			endpoint: "web/login",
			payload: data,
		});
		return this.post(payload);
	}

}