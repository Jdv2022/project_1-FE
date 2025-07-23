import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiBase } from "src/app/core/base/api.base";
import { ModelRequestBase } from "src/app/core/base/model.request.base";
import { ModelResponseBase } from "src/app/core/base/model.response.base";
import { LogService } from "src/app/core/services/log.service";


@Injectable()
export class CreateDepartmentService extends ApiBase {

	constructor(
		protected http: HttpClient,
		protected log: LogService
	) { 
		super(http, log);
	}

	createDepartment(data: ModelRequestBase) {
		data.endpoint = "web/private/user/create/department";
		return this.post<ModelResponseBase>(data);
	}

}