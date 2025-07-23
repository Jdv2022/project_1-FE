import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiBase } from "src/app/core/base/api.base";
import { ModelRequestBase } from "src/app/core/base/model.request.base";
import { ModelResponseBase } from "src/app/core/base/model.response.base";
import { LogService } from "src/app/core/services/log.service";


@Injectable()

export class DepartmentService extends ApiBase {

	constructor(http: HttpClient, log: LogService) {
		super(http, log);
	}

	getDepartment(id: string): Observable<ModelResponseBase> {
		this.log.logDebug('getDepartment');
		let req = new ModelRequestBase();
		req.endpoint = "web/private/user/department/details/" + id;
		return this.post(req);
	}

	getSuggestedMembers(): Observable<ModelResponseBase> {
		this.log.logDebug('getSuggestedMembers');
		let req = new ModelRequestBase();
		req.endpoint = "web/private/user/department/suggested/members";
		return this.post(req);
	}

	editDepartment(data: ModelRequestBase): Observable<ModelResponseBase> {
		this.log.logDebug('editDepartment');
		data.endpoint = "web/private/user/departments/edit";
		return this.post(data);
	}

	assignUserToDepartment(data: ModelRequestBase): Observable<ModelResponseBase> {
		this.log.logDebug('assignUserToDepartment');
		data.endpoint = "web/private/assign/user/to/departments";
		return this.post(data);
	}

	removeUserFromDepartment(data: ModelRequestBase): Observable<ModelResponseBase> {
		this.log.logDebug('removeUserFromDepartment');
		data.endpoint = "web/private/user/department/remove";
		return this.post(data);
	}

	deleteDepartment(req: ModelRequestBase): Observable<ModelResponseBase> {
		this.log.logDebug('deleteDepartment');
		req.endpoint = "web/private/user/department/delete";
		return this.post(req);
	}

}