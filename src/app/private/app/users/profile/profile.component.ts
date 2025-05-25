import { Component, OnInit } from '@angular/core';
import { Link } from '@vex/interfaces/link.interface';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgFor } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { LogService } from 'src/app/core/services/log.service';
import { ProfileService } from './profile.service';
import { ModelRequestBase } from 'src/app/core/base/model.request.base';
import { environment } from 'src/environments/environment';

export interface FriendSuggestion {
  name: string;
  imageSrc: string;
  friends: number;
  added: boolean;
}

@Component({
	selector: 'vex-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss'],
	animations: [scaleIn400ms, fadeInRight400ms],
	standalone: true,
	imports: [MatTabsModule, NgFor, RouterLinkActive, RouterLink, RouterOutlet]
})

export class ProfileComponent implements OnInit {
	urlId: string | null = null;

	links: Link[] = [
		{
			label: 'ABOUT',
			route: '',
			routerLinkActiveOptions: { exact: true }
		},
		{
			label: 'TIMELINE',
			route: './timeline'
		},
	];

	full_name: string = '-';
	userDetailsProfileImageURL: string = 'assets/img/avatars/noavatar.png';

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private log: LogService,
		private profileServie: ProfileService
	) {}

  	ngOnInit() {
		this.log
		this.urlId = this.activatedRoute.snapshot.paramMap.get('id');
		this.router.navigate([`private/users/profile/${this.urlId}/about`]);
		this.links[0].route = `about`;
		let requestModel = new ModelRequestBase();
		requestModel.payload = {'user_id': this.urlId};
		this.profileServie.getUserDetails(requestModel).subscribe(
			(response) => {
				this.full_name = response.payload.userDetailsFirstName + ' '+ response.payload.userDetailsMiddleName +' ' + response.payload.userDetailsLastName;
				if(response.payload.userDetailsProfileImageURL != 'null') {
					this.userDetailsProfileImageURL =  environment.getBaseUrl + response.payload.userDetailsProfileImageURL;
				}
			}
		)
	}

}
