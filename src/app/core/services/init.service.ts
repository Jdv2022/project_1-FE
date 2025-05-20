import { Injectable } from "@angular/core";
import { ModelResponseBase } from "../base/model.response.base";
import { ModelRequestBase } from "../base/model.request.base";
import { ApiBase } from "../base/api.base";
import { LogService } from "./log.service";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
/*
*	This is use to set the AES keys for enc and dec
* 	This is called twice during login component and aad-auth render
*/
export class InitService extends ApiBase {

	private latest: boolean = false;

	constructor(
		protected log: LogService,
		protected http: HttpClient
	) { 
		super(http, log);
	}

	public async initAppApi(): Promise<ModelResponseBase> {
		if(this.latest) {
			return new ModelResponseBase();
		}
        const arg = new ModelRequestBase({
            endpoint: 'meta/data',
			isEncrypt: false
        });
		this.latest = true;
        return this.postPromise<ModelResponseBase>(arg);
    }

}