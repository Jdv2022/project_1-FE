import { CommonModule, NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { provideAnimations } from '@angular/platform-browser/animations';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger60ms } from '@vex/animations/stagger.animation';

@Component({
	selector: 'vex-edit-department-modal',
	standalone: true,
	imports: [
		MatButtonModule,
		MatIconModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		NgIf,
		ReactiveFormsModule,
		CommonModule,
		MatCardModule
	],
	providers: [provideAnimations()],
	templateUrl: './edit-department-modal.component.html',
	styleUrl: './edit-department-modal.component.scss',
	animations: [stagger60ms, fadeInUp400ms],
})

export class EditDepartmentModalComponent {

	departmentForm: FormGroup;

	constructor(
		private fb: UntypedFormBuilder,
		public dialogRef: MatDialogRef<EditDepartmentModalComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.departmentForm = this.fb.group({
			department_name: [this.data.department_name, Validators.required],
			description: [this.data.description, Validators.required],
		});
	}

	onSubmit() {
		this.dialogRef.close({
			department_name: this.departmentForm.value.department_name,
			description: this.departmentForm.value.description
		});
	}

	close() {
		this.dialogRef.close();
	}
}
