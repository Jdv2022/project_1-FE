import { Injectable } from "@angular/core";
import { StorageService } from "./storage.service";
import { Router } from "@angular/router";

@Injectable({providedIn: 'root'})
export class AuthService {

    public constructor(
		private storageService: StorageService,
		private route: Router
	) {

    }

    public isAuthenticated(): boolean {
        const token = this.storageService.getToken();
		if(token) return true;
		return false;
    }

}