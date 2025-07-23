import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModelRequestBase } from 'src/app/core/base/model.request.base';
import { CreateDepartmentService } from './create-department.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgIf } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { NotificationModalComponent } from 'src/app/private/utilities/notification-modal/notification.modal.component';
import { LogService } from 'src/app/core/services/log.service';
import { YesNoModalComponent } from 'src/app/private/utilities/yes-no-modal/yes-no-modal.component';
import { stagger60ms } from '@vex/animations/stagger.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';

@Component({
	selector: 'vex-create-department',
	standalone: true,
	templateUrl: './create-department.component.html',
	styleUrl: './create-department.component.scss',
	providers: [CreateDepartmentService],
	animations: [
		stagger60ms,
		fadeInUp400ms
	],
	imports: [
		MatButtonModule,
		MatIconModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		NgIf,
		ReactiveFormsModule
	]
})

export class CreateDepartmentComponent {

	departmentForm!: FormGroup;

	constructor(
		private fb: UntypedFormBuilder,
		private service: CreateDepartmentService,
		private router: Router,
		private dialog: MatDialog,
		private log: LogService
	) {
		this.departmentForm = this.fb.group({
			department_name: [null, Validators.required],
			description: [null, Validators.required],
		});
	}

	ngOnInit() {}

	onSubmit() {
		this.dialog.open(YesNoModalComponent, {
			width: '400px', 
			disableClose: true,
			data: { message: 'Are you sure you want to create this department?' }
		}).afterClosed().subscribe(
			(result) => {
				if (!result) return;
				if (this.departmentForm.invalid) return;
				let data = new ModelRequestBase();
				data.payload = this.departmentForm.value;
				this.service.createDepartment(data).subscribe(
					(response) => {
						this.dialog.open(NotificationModalComponent, {
							width: '400px', 
							disableClose: true,
							data: { message: 'Department created successfully!' }
						}).afterClosed().subscribe(
							() => {
								this.router.navigate(['/private/users/departments/details/', response.payload.result]);
							}
						)
					},
					(error) => {
						this.log.logError('Create Department Error: ' + JSON.stringify(error));
						this.dialog.open(NotificationModalComponent, {
							width: '400px', 
							disableClose: true,
							data: { message: error.error.message }
						})
					}
				);
			}
		)
	}

}
