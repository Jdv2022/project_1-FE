import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiBase } from "src/app/core/base/api.base";
import { ModelRequestBase } from "src/app/core/base/model.request.base";
import { ModelResponseBase } from "src/app/core/base/model.response.base";
import { LogService } from "src/app/core/services/log.service";


@Injectable()
export class ListService extends ApiBase {

	constructor(
		protected http: HttpClient,
		protected log: LogService,
	) {
		super(http, log);
	}

	getUserList(requestData: ModelRequestBase): Observable<ModelResponseBase> {
		requestData.endpoint = "web/private/user/list";
		return this.post<ModelResponseBase>(requestData);
	}

}