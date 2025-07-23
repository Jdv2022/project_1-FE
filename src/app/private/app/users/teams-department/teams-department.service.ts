import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiBase } from "src/app/core/base/api.base";
import { ModelRequestBase } from "src/app/core/base/model.request.base";
import { ModelResponseBase } from "src/app/core/base/model.response.base";
import { LogService } from "src/app/core/services/log.service";



@Injectable()

export class TeamsDepartmentService extends ApiBase {

	constructor(http: HttpClient, log: LogService) {
		super(http, log);
	}
	
	getTeamLists(requestData: ModelRequestBase): Observable<ModelResponseBase> {
		requestData.endpoint = "web/private/user/teams/lists";
		return this.post(requestData);
	}

	getDepartmentLists(requestData: ModelRequestBase): Observable<ModelResponseBase> {
		requestData.endpoint = "web/private/user/departments";
		return this.post(requestData);
	}

}