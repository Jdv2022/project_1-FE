import { Component, Inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
	selector: 'vex-loading.modal',
	standalone: true,
	templateUrl: './loading.modal.component.html',
	styleUrl: './loading.modal.component.scss',
	imports: [
		MatProgressSpinnerModule,
		MatCardModule
	],
})

export class LoadingModalComponent {

	color: string = 'primary';
	message: string | null = '';

	constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {
		this.message = data.message;
	}

}
