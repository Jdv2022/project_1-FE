import { Component, Inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'vex-yes-no-modal',
	standalone: true,
	imports: [
		MatCardModule
	],
	templateUrl: './yes-no-modal.component.html',
	styleUrl: './yes-no-modal.component.scss'
})

export class YesNoModalComponent {

	notification: string = '';
	status: number = 0;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: { message: string, status: number },
		private dialogRef: MatDialogRef<YesNoModalComponent>
	) {
		this.notification = data.message;
		this.status = data.status;
	}

	onYesClick() {
		this.dialogRef.close(true);
	  }
	  
	onNoClick() {
		this.dialogRef.close(false);
	}

}
