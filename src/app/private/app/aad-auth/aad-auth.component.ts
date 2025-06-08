import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LogService } from 'src/app/core/services/log.service';
import { Router, RouterOutlet } from '@angular/router';
import { StorageService } from 'src/app/core/services/storage.service';
import { AadAuthService } from './aad-auth.service';
import { InitService } from 'src/app/core/services/init.service';
import { InitModel } from 'src/app/core/contracts/init.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommonModule } from '@angular/common';
import { RefreshTokenService } from 'src/app/core/services/refresh-token.service';
import { RefreshTokenRequestModel } from 'src/app/core/contracts/refresh-token.request.model';
import { RefreshTokenResponseModel } from 'src/app/core/contracts/refresh-token.response.model';

@Component({
	selector: 'vex-aad-auth',
	standalone: true,
	imports: [
		MatProgressSpinnerModule,
		MatCardModule,
		RouterOutlet,
		CommonModule
	],
	providers: [AadAuthService],
	templateUrl: './aad-auth.component.html',
	styleUrl: './aad-auth.component.scss'
	
})

export class AadAuthComponent implements OnInit {

	public color: string = 'accent';
	public content: string = 'Authenticating. Please wait...';
	private refreshAttempts = 0;
	private maxRefreshAttempts = 3;
	public loading: boolean = true;

	constructor(
		private aadAuthService: AadAuthService,
		private log: LogService,
		private route: Router,
		private storageService: StorageService,
		private initService: InitService,
		private auth: AuthService,
		private refreshTokenService: RefreshTokenService
	) { }

	async ngOnInit(): Promise<void> {
		this.initService.initAppApi().then(response => {
            this.log.logDebug(`LoginComponent [ngOnInit] AES`);
			const data = new InitModel(response.payload);
            if(!data.cue) return;
			this.storageService.setKey(data.cue);
        }).catch(error => {
            this.log.logError(`LoginComponent [ngOnInit] AES: ${error}`);
        });
		this.content = "Loading...";
		await new Promise(resolve => setTimeout(resolve, 500));
		if(!this.auth.isAuthenticated()) {
			this.log.logDebug("Redirecting to login page...");
			this.route.navigate(['login']);
			this.loading = false;
		}
		else {
			const model = new RefreshTokenRequestModel();
			this.aadAuthService.validateToken({...model}).subscribe({
				next: (response) => {
					this.log.logDebug(`Validate Token Data Response: ${JSON.stringify(response)}`);
				},	
				error: (error) => {
					this.log.logError(`Validate Token Data Response: ${JSON.stringify(error)}`);
					if (this.refreshAttempts < this.maxRefreshAttempts) {
						// this.refreshAttempts++;
						// this.refreshTokenService.refreshToken(new RefreshTokenRequestModel()).subscribe({
						// 	next: (response) => {
						// 		this.log.logDebug(`Refresh Token Data Response: ${JSON.stringify(response)}`);
						// 		const data = new RefreshTokenResponseModel(response);
						// 		this.storageService.setToken(data.payload);
						// 	},	
						// 	error: (error) => {
						// 		this.log.logError(`Refresh Token Data Response: ${JSON.stringify(error)}`);
						// 	}
						// });
					} 
					else {
						this.storageService.deleteToken();
						this.storageService.deleteAes();
						this.route.navigate(['login']);
					}
				}
			});
			this.loading = false;
		}
	}

}
