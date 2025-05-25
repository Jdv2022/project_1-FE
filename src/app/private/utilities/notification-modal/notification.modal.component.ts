import { Component, Inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
	selector: 'vex-notification.modal',
	standalone: true,
	templateUrl: './notification.modal.component.html',
	styleUrl: './notification.modal.component.scss',
	imports: [
		MatCardModule,
		MatProgressSpinnerModule
	],
})
export class NotificationModalComponent {

	notification: string = '';
	status: number = 0;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: { message: string, status: number },
		private dialogRef: MatDialogRef<NotificationModalComponent>
	) {
		this.notification = data.message;
		this.status = data.status;
	}

	close() {
		this.dialogRef.close();
	}
	
}
