import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
	selector: 'vex-users',
	standalone: true,
	imports: [
		RouterOutlet,
	],
	templateUrl: './users.component.html',
	styleUrl: './users.component.scss'
	
})

export class UsersComponent implements OnInit {

	constructor(private route: Router) { }

	ngOnInit(): void {
		if(this.route.url == '/private/users') {
			this.route.navigate(['private/users/list'])
		};
	}

}
