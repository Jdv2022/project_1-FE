import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiBase } from "src/app/core/base/api.base";
import { ModelRequestBase } from "src/app/core/base/model.request.base";
import { ModelResponseBase } from "src/app/core/base/model.response.base";
import { LogService } from "src/app/core/services/log.service";


@Injectable()

export class TeamService extends ApiBase {

	constructor(http: HttpClient, log: LogService) {
		super(http, log);
	}

	getTeam(id: string): Observable<ModelResponseBase> {
		this.log.logDebug('getTeam');
		let req = new ModelRequestBase();
		req.endpoint = "web/private/user/team/details/" + id;
		return this.post(req);
	}

	getSuggestedMembers(): Observable<ModelResponseBase> {
		this.log.logDebug('getSuggestedMembers');
		let req = new ModelRequestBase();
		req.endpoint = "web/private/user/team/suggested/members";
		return this.post(req);
	}

	editTeam(data: ModelRequestBase): Observable<ModelResponseBase> {
		this.log.logDebug('editTeam');
		data.endpoint = "web/private/user/teams/edit";
		return this.post(data);
	}

	assignUserToTeam(data: ModelRequestBase): Observable<ModelResponseBase> {
		this.log.logDebug('assignUserToTeam');
		data.endpoint = "web/private/assign/user/to/teams";
		return this.post(data);
	}

	removeUserFromTeam(data: ModelRequestBase): Observable<ModelResponseBase> {
		this.log.logDebug('removeUserFromTeam');
		data.endpoint = "web/private/user/team/remove";
		return this.post(data);
	}

}