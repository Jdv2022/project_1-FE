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
	selector: 'vex-edit-team-modal',
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
	templateUrl: './edit-team-modal.component.html',
	styleUrl: './edit-team-modal.component.scss',
	animations: [stagger60ms, fadeInUp400ms],
})

export class EditTeamModalComponent {

	teamForm: FormGroup;

	constructor(
		private fb: UntypedFormBuilder,
		public dialogRef: MatDialogRef<EditTeamModalComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.teamForm = this.fb.group({
			team_name: [this.data.team_name, Validators.required],
			description: [this.data.description, Validators.required],
		});
	}

	onSubmit() {
		this.dialogRef.close({
			team_name: this.teamForm.value.team_name,
			description: this.teamForm.value.description
		});
	}

	close() {
		this.dialogRef.close();
	}
}
