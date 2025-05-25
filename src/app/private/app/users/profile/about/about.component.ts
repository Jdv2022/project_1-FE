import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';
import { FriendSuggestion } from 'src/app/pages/apps/social/social.component';
import { friendSuggestions } from 'src/static-data/friend-suggestions';
import { ProfileService } from '../profile.service';

@Component({
	selector: 'vex-about',
	standalone: true,
	imports: [MatIconModule, NgFor, NgIf, MatButtonModule],
	templateUrl: './about.component.html',
	styleUrl: './about.component.scss',
	animations: [fadeInUp400ms, fadeInRight400ms, scaleIn400ms, stagger40ms]
})

export class AboutComponent {
	team = friendSuggestions;

	userDetailsPhone: string = '-';
	userDetailsEmail: string = '-';
	userRolesType1: string = '-';
	userDetailsDateOfBirth: Date | string = '-';
	daysBeforeBirthday: string = '-';
	userRolesDescription: string = '-';
	userDetailsAddress: string = '-';
	userDetailsGender: string = '-';
	createdAt: string = '-';
	updatedAt: string = '-';
	createdBy: string = '-';
	updatedBy: string = '-';
	userDepartmentsDepartmentName: string = '-';

	constructor(
		private profileService: ProfileService
	) {}

	ngOnInit(): void {
		this.profileService.profileData$.subscribe(
			profile => {
				if(profile.payload !== undefined) {
					this.userDetailsPhone = profile.payload.userDetailsPhone ?? '-';
					this.userDetailsEmail = profile.payload.userDetailsEmail ?? '-';
					this.userRolesType1 = profile.payload.userRolesType1 ?? '-';
					this.userRolesDescription = profile.payload.userRolesDescription ?? '-';
					this.userDetailsAddress = profile.payload.userDetailsAddress ?? '-';
					this.userDetailsGender = profile.payload.userDetailsGender ?? '-';
					this.userDetailsDateOfBirth = profile.payload.userDetailsDateOfBirth ?? '-';
					this.daysBeforeBirthday = profile.payload.daysTillBirthday ?? '-';
					this.userDepartmentsDepartmentName = profile.payload.userDepartmentsDepartmentName ?? '-';
					this.createdAt = profile.payload.created_at ?? '-';
					this.updatedAt = profile.payload.updated_at ?? '-';
					this.createdBy = profile.payload.created_by ?? '-';
					this.updatedBy = profile.payload.updated_by ?? '-';
				}
			}
		);
	}

	addFriend(friend: FriendSuggestion) {
		friend.added = true;
	}

	removeFriend(friend: FriendSuggestion) {
		friend.added = false;
	}

	trackByName(index: number, friend: FriendSuggestion) {
		return friend.name;
	}
	
}
