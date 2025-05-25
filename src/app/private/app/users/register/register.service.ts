import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiBase } from "src/app/core/base/api.base";
import { ModelRequestBase } from "src/app/core/base/model.request.base";
import { ModelResponseBase } from "src/app/core/base/model.response.base";
import { LogService } from "src/app/core/services/log.service";
import { FileModelRequestBase } from "src/app/core/base/file.model.request.base";

@Injectable()
export class RegisterService extends ApiBase {

	public constructor(
		protected http: HttpClient,
		protected log: LogService,
	) {
		super(http, log);
	}

	public submit(data: FileModelRequestBase): Observable<ModelResponseBase> {
		data.endpoint = "web/private/user/register";
		return this.uploadFile(data);
	}

	public getRegistrationFormData(data: ModelRequestBase): Observable<ModelResponseBase> {
		data.endpoint = "web/private/user/registration/form/data";
		return this.post(data);
	}

}