import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { firstValueFrom } from 'rxjs';
import { LogService } from "../services/log.service";
import { ModelRequestBase } from "./model.request.base";
import { FileModelRequestBase } from "./file.model.request.base";
import { FileModelResponseBase } from "./file.model.response.base";

export abstract class ApiBase {

    private baseUrl: string = environment.baseUrl;

    public constructor(
        protected http: HttpClient,
        protected log: LogService
    ) {}
	
	protected get<ModelResponseBase>(apiArgs: ModelRequestBase): Observable<ModelResponseBase> {
		return this.http.get<ModelResponseBase>(`${this.baseUrl}/${apiArgs.endpoint}`, {
			params: apiArgs.params
		});
	}
	
	protected async fetchFirst<ModelResponseBase>(apiArgs: ModelRequestBase): Promise<ModelResponseBase> {
		return firstValueFrom(this.http.get<ModelResponseBase>(`${this.baseUrl}/${apiArgs.endpoint}`, {
			params: apiArgs.params
		}));
	}
	
	protected post<ModelResponseBase>(apiArgs: ModelRequestBase): Observable<ModelResponseBase> {
		return this.http.post<ModelResponseBase>(`${this.baseUrl}/${apiArgs.endpoint}`, {...apiArgs});
	}

	public uploadFile(data: FileModelRequestBase): Observable<FileModelResponseBase> {
		return this.http.post<FileModelResponseBase>(`${this.baseUrl}/${data.endpoint}`, data);
	}
	
	protected async postPromise<ModelResponseBase>(apiArgs: ModelRequestBase): Promise<ModelResponseBase> {
		return firstValueFrom(this.http.post<ModelResponseBase>(
			`${this.baseUrl}/${apiArgs.endpoint}`, 
			{...apiArgs}, 
		));
	}

}