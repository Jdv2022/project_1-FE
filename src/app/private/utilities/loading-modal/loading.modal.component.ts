import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
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

}
