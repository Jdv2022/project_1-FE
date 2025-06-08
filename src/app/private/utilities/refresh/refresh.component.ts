import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
	selector: 'vex-refresh',
	standalone: true,
	imports: [		
		MatProgressSpinnerModule,
		MatCardModule
	],
	templateUrl: './refresh.component.html',
	styleUrl: './refresh.component.scss'
})

export class RefreshComponent {

}
