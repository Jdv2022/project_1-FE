import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoginService } from './login.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { LoginResponseModel } from './login.response.model';
import { LoginRequestModel } from './login.request.model';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
	selector: 'vex-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	animations: [fadeInUp400ms],
	standalone: true,
	providers: [LoginService],
	imports: [
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		NgIf,
		MatButtonModule,
		MatTooltipModule,
		MatIconModule,
		MatCheckboxModule,
		RouterLink,
		MatSnackBarModule,
		MatCardModule,
		MatProgressSpinnerModule
	]
})

export class LoginComponent implements OnInit {
	public loading: boolean = false;
	public color: string = 'accent';
	public content: string = 'Authenticating. Please wait...';

	form = this.fb.group({
		username: [
			'', 
			[
				Validators.required,
				Validators.maxLength(12),
				Validators.pattern(/^[a-zA-Z0-9_]+$/) 
			]
		],
		password: [
			'', 
			[
				Validators.required,
				Validators.minLength(8),
			]
		]
	});
	
	inputType: string = 'password';
	visible: boolean = false;
	serverMessage: string = '';

	constructor(
		private router: Router,
		private fb: FormBuilder,
		private cd: ChangeDetectorRef,
		private loginService: LoginService,
		private auth: AuthService,
		private storageService: StorageService,
	) {
		
	}

	ngOnInit() {
		if(this.auth.isAuthenticated()) {
			this.router.navigate(['']);
		}
	}

	send() {
		this.serverMessage = '';
		const inputUsername = this.form.get('username')!.value;
		const inputPassword = this.form.get('password')!.value;
		const payload = new LoginRequestModel({
			username: inputUsername,
			password: inputPassword,
		});
		this.loginService.login(payload).subscribe({
			next: (response) => {
				this.loading = true;
				setTimeout(() => {
					this.content = 'Authenticated. Redirecting...';
					this.color = 'primary';
					const data = new LoginResponseModel(response.payload);
					console.log(response)
					this.storageService.setToken(data.access_token);
					setTimeout(() => {
						this.router.navigate(['/private']);
					}, 1500);
				}, 1000);
			},	
			error: (error) => {
				this.serverMessage = error.error.message;
			}
		});
	}

	toggleVisibility() {
		if (this.visible) {
			this.inputType = 'password';
			this.visible = false;
			this.cd.markForCheck();
		} 
		else {
			this.inputType = 'text';
			this.visible = true;
			this.cd.markForCheck();
		}
	}

}
