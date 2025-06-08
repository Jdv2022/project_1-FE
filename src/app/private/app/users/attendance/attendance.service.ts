import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiBase } from "src/app/core/base/api.base";
import { ModelRequestBase } from "src/app/core/base/model.request.base";
import { ModelResponseBase } from "src/app/core/base/model.response.base";
import { LogService } from "src/app/core/services/log.service";


@Injectable()
export class AttendanceService extends ApiBase {

	public constructor(
		protected http: HttpClient,
		protected log: LogService
	) {
		super(http, log);
	}

	getDateAndTimeToday(data: ModelRequestBase): Observable<ModelResponseBase> {
		data.endpoint = "web/private/user/attendance/day/today";
		return this.post(data);
	}

	clockIn(data: ModelRequestBase): Observable<ModelResponseBase> {
		data.endpoint = "web/private/user/attendance/clock/in";
		return this.post(data);
	}

	clockOut(data: ModelRequestBase): Observable<ModelResponseBase> {
		data.endpoint = "web/private/user/attendance/clock/out";
		return this.post(data);
	}

	getAttendance(data: ModelRequestBase): Observable<ModelResponseBase> {
		data.endpoint = "web/private/user/attendance";
		return this.post(data);
	}

}