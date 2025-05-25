import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { ApiBase } from "src/app/core/base/api.base";
import { ModelRequestBase } from "src/app/core/base/model.request.base";
import { ModelResponseBase } from "src/app/core/base/model.response.base";
import { LogService } from "src/app/core/services/log.service";


@Injectable()
export class ProfileService extends ApiBase {
	private profileData = new BehaviorSubject<ModelResponseBase>(new ModelResponseBase());
	public profileData$ = this.profileData.asObservable();

	public constructor(
		protected http: HttpClient,
		protected log: LogService,
	) {
		super(http, log);
	}

	getUserDetails(data: ModelRequestBase): Observable<ModelResponseBase> {
		const user_id = data.payload['user_id'];
		data.endpoint = "web/private/user/profile/" + user_id;
		return this.post<ModelResponseBase>(data).pipe(
			tap(responseData => this.setProfile(responseData))
		);
	}

	setProfile(data: ModelResponseBase): void {
		this.profileData.next(data);
	}

}