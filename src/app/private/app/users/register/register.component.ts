import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
	AbstractControl,
	ReactiveFormsModule,
	UntypedFormBuilder,
	UntypedFormGroup,
	ValidationErrors,
	ValidatorFn,
	Validators
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, NgIf } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { stagger80ms } from '@vex/animations/stagger.animation';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { Observable, ReplaySubject } from 'rxjs';
import { LogService } from 'src/app/core/services/log.service';
import { RegisterService } from './register.service';
import { RegisterModel } from './register.model';
import { FileModelRequestBase } from 'src/app/core/base/file.model.request.base';
import { ModelRequestBase } from 'src/app/core/base/model.request.base';

interface ReviewTable {
    field: string;
    value: string;
}


@Component({
  	selector: 'vex-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss'],
	animations: [
		fadeInUp400ms,
		stagger80ms,
		fadeInRight400ms,
		scaleIn400ms
	],
	providers: [RegisterService],
	standalone: true,
	imports: [
		VexSecondaryToolbarComponent,
		VexBreadcrumbsComponent,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatTooltipModule,
		NgIf,
		MatIconModule,
		MatCheckboxModule,
		RouterLink,
		MatStepperModule,
		MatButtonModule,
		MatInputModule,
		MatSelectModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatInputModule,
		CommonModule,
		MatTableModule,
	]
})

export class RegisterComponent implements OnInit {
	@ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
	subject$: ReplaySubject<any> = new ReplaySubject<any>(1);
	data$: Observable<any> = this.subject$.asObservable();

	phonePrefixOptions = ['+1', '+27', '+44', '+49', '+61', '+91'];
	allowedFileTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
	isUploading = false;
	fileUrl!: string | null;
	uploadFile: File | null = null;
	departments: Array<any> = [];
	/**
	 * Horizontal Stepper
	 */
	// createAccountFormGroup: UntypedFormGroup = this.fb.group({
	// 	firstName: [null, 
	// 		[
	// 			Validators.required, 
	// 			Validators.minLength(2), 
	// 			Validators.maxLength(50), 
	// 			Validators.pattern('^[a-zA-Z ]+$')
	// 		]
	// 	],
	// 	middleName: [null, 
	// 		[
	// 			Validators.required, 
	// 			Validators.minLength(2), 
	// 			Validators.maxLength(50), 
	// 			Validators.pattern('^[a-zA-Z ]+$')
	// 		]
	// 	],
	// 	lastName: [null, 
	// 		[
	// 			Validators.required, 
	// 			Validators.minLength(2), 
	// 			Validators.maxLength(50), 
	// 			Validators.pattern('^[a-zA-Z ]+$')
	// 		]
	// 	],
	// 	email: [null,
	// 		[
	// 			Validators.required,
	// 			Validators.email,
	// 			Validators.maxLength(100),
	// 		],
	// 	],
	// 	address: [null, 
	// 		[
	// 			Validators.required, 
	// 		]
	// 	],
	// 	phone: [null, Validators.required],
	// 	gender: [null, Validators.required],
	// 	birthdate: [null, 
	// 		[
	// 			Validators.required,
	// 			this.minimumAgeValidator(18)
	// 		]
	// 	],
	// 	department: [null, Validators.required],
	// 	position: [null, Validators.required],
	// 	userName: [
	// 		null,
	// 		Validators.compose([Validators.required])
	// 	],
	// 	password: [
	// 		null,
	// 		Validators.compose([Validators.required, Validators.minLength(8)])
	// 	],
	// });

	createAccountFormGroup: UntypedFormGroup = this.fb.group({
		firstName: ['John', [
			Validators.required,
			Validators.minLength(2),
			Validators.maxLength(50),
			Validators.pattern('^[a-zA-Z ]+$')
		]],
		middleName: ['Mads', [
			Validators.required,
			Validators.minLength(2),
			Validators.maxLength(50),
			Validators.pattern('^[a-zA-Z ]+$')
		]],
		lastName: ['Doe', [
			Validators.required,
			Validators.minLength(2),
			Validators.maxLength(50),
			Validators.pattern('^[a-zA-Z ]+$')
		]],
		email: ['johndoe@example.com', [
			Validators.required,
			Validators.email,
			Validators.maxLength(100)
		]],
		address: ['123 Main Street', [Validators.required]],
		phone: ['09171234567', Validators.required],
		gender: ['Apples', Validators.required],
		birthdate: ['1990-01-01', [Validators.required, this.minimumAgeValidator(18)]],
		department: [null, Validators.required],
		position: ['Apples', Validators.required],
		userName: ['johndoe', Validators.required],
		password: ['12345678', Validators.compose([Validators.required, Validators.minLength(8)])],
	});

	confirmFormGroup: UntypedFormGroup = this.fb.group({
		terms: [null, Validators.requiredTrue]
	});

	columns: TableColumn<any>[] = [
		{
			label: 'Field',
			property: 'field',
			type: 'text',
			visible: true,
			cssClasses: ['font-medium']
		},
		{
			label: 'Value',
			property: 'value',
			type: 'text',
			visible: true,
			cssClasses: ['text-secondary', 'font-medium']
		},
	];

	dataSource!: MatTableDataSource<ReviewTable>;
	passwordInputType = 'password';

	constructor(
		private fb: UntypedFormBuilder,
		private cd: ChangeDetectorRef,
		private log: LogService,
		private registerService: RegisterService
	) {}

	ngOnInit(): void {
		this.log.logDebug("Register [ngOnInit]");
        this.dataSource = new MatTableDataSource();
		this.createAccountFormGroup.valueChanges.subscribe((formValues) => {
			this.updateTable(formValues);
		});
		this.registerService.getRegistrationFormData(new ModelRequestBase()).subscribe(
			(response) => {
				console.log(response)
			}
		)
	}

	updateTable(formValues: UntypedFormGroup): void {
		let tableData: ReviewTable[] = [];

		Object.entries(formValues).forEach(([key, value]) => {
			tableData.push({
				field: this.formatFieldName(key),
				value: this.formatValue(key, String(value)),
			});
		});

		this.dataSource.data = tableData; 
	}

	passwordHide: string = '•••••••';
	passwordShow: string = "";
	formatValue(key: string, value: string): string {
		switch(key) {
			case 'firstName':
				return value;
			case 'middleName':
				return value;
			case 'userName':
				return value;
			case 'password':
				this.passwordHide = "•".repeat(this.createAccountFormGroup.value.password?.length ?? 0)
				this.passwordShow = this.createAccountFormGroup.value.password;
				return this.passwordHide;
			case 'middleName':
				return value;
			case 'lastName':
				return this.formatFieldName(value);
			case 'email':
				return value;
			case 'address':
				return this.formatAddress(value);
			case 'phone':
				return value;
			case 'gender':
				return this.formatFieldName(value);
			case 'birthdate':
				return value;
			case 'department':
				return value;
			case 'position':
				return value;
			default:
				return '';
		} 
	}

	private formatAddress(address: string): string {
		return address
			.split(",") 
			.map(part => part.trim()) 
			.map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()) 
			.join(", ");
	}

	private formatFieldName(fieldName: string): string {
		if(fieldName == 'userName') return 'Username';
		return fieldName
			.replace(/([A-Z])/g, " $1") 
			.replace(/^./, str => str.toUpperCase()) 
			.trim(); 
	}

	showPassword() {
		this.passwordInputType = 'text';
		this.cd.markForCheck();
	}

	hidePassword() {
		this.passwordInputType = 'password';
		this.cd.markForCheck();
	}

	submit() {
		const data = {
			username: this.createAccountFormGroup.value.userName,
			password: this.createAccountFormGroup.value.password,
			address: this.createAccountFormGroup.value.address,
			birthdate: this.createAccountFormGroup.value.birthdate,
			department: this.createAccountFormGroup.value.department,
			email: this.createAccountFormGroup.value.email,
			firstname: this.createAccountFormGroup.value.firstName,
			middlename: this.createAccountFormGroup.value.middleName,
			lastname: this.createAccountFormGroup.value.lastName,
			gender: this.createAccountFormGroup.value.gender,
			phone: this.createAccountFormGroup.value.phone,
			position: this.createAccountFormGroup.value.position,
		};
		const model = new FileModelRequestBase();
		model.payload = data;
		model.file = this.uploadFile;
		this.registerService.submit(model).subscribe({
			next: (response) => {
				console.log(response)
			},	
			error: (error) => {
				this.log.logDebug(`Registration Data Response: ${error}`);
			}
		});
	}
	
	handleChange(event: any) {
		const file = event.target.files[0] as File;
		this.fileUrl = URL.createObjectURL(file);
		this.uploadFile = file;
	}
	
	handleRemovesFile() {
		if (this.fileInput && this.fileInput.nativeElement) {
			this.fileInput.nativeElement.value = null;
		}
		this.uploadFile = null;
		this.fileUrl = null;
	}

	minimumAgeValidator(minAge: number): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			if (!control.value) {
				return null; 
			}
			
			const birthDate = new Date(control.value);
			const today = new Date();
			const age = today.getFullYear() - birthDate.getFullYear();
			const hasBirthdayPassed = today.getMonth() > birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
			const actualAge = hasBirthdayPassed ? age : age - 1;
		
			return actualAge >= minAge ? null : { underage: true };
		};
	};

	get visibleColumns() {
        return this.columns
        	.filter((column) => column.visible)
        	.map((column) => column.property);
    }

	passwordInputTypes: { [key: number]: string } = {};
	togglePassword(rowIndex: number) {
		const current = this.passwordInputTypes[rowIndex] ?? 'password';
		this.passwordInputTypes[rowIndex] = current === 'password' ? 'text' : 'password';
	}

}
