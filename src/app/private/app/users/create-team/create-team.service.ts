import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiBase } from "src/app/core/base/api.base";
import { ModelRequestBase } from "src/app/core/base/model.request.base";
import { LogService } from "src/app/core/services/log.service";


@Injectable()

export class CreateTeamService extends ApiBase {

	public constructor(
		protected http: HttpClient,
		protected log: LogService,
	) {
		super(http, log);
	}

	public createTeam(data: ModelRequestBase): Observable<any> {
		data.endpoint = 'web/private/user/teams/create';
		return this.post(data);
	}
	
}