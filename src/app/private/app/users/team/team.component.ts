import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { TeamService } from './team.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ContactsCardComponent } from 'src/app/pages/apps/contacts/components/contacts-card/contacts-card.component';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { LogService } from 'src/app/core/services/log.service';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { EditTeamModalComponent } from 'src/app/private/utilities/edit-team-modal/edit-team-modal.component';
import { ModelRequestBase } from 'src/app/core/base/model.request.base';
import { NotificationModalComponent } from 'src/app/private/utilities/notification-modal/notification.modal.component';
import { YesNoModalComponent } from 'src/app/private/utilities/yes-no-modal/yes-no-modal.component';
import { MatCardModule } from '@angular/material/card';
import { LoadingModalComponent } from 'src/app/private/utilities/loading-modal/loading.modal.component';

interface suggestedMembers {
	id: number;
	name: string;
	department: string;
	isOnTeam: string;
	profileImageName: string;
	profileImageUrl: string;
}

interface teamMembers {
	id: number;
	firstName: string;
	lastName: string;
	middleName: string;
	position: string;
	profileImageName: string;
	profileImageUrl: string;
	createdAt: string;
	updatedAt: string;
}


@Component({
	selector: 'vex-team',
	standalone: true,
	animations: [
		scaleIn400ms,
		fadeInRight400ms,
		stagger40ms,
		fadeInUp400ms,
		scaleFadeIn400ms
	],
	imports: [
		MatIconModule,
		MatTabsModule,
		NgFor,
		RouterLinkActive,
		RouterLink,
		MatButtonModule,
		MatTooltipModule,
		NgIf,
		ContactsCardComponent,
		AsyncPipe,
		MatCardModule
	],
	templateUrl: './team.component.html',
	styleUrl: './team.component.scss',
	providers: [TeamService]
})

export class TeamComponent implements OnInit {

	team_name: string = '-';
	description: string = '-';
	suggestions: suggestedMembers[] = [];
	members: teamMembers[] = [];

	constructor(
		private route: ActivatedRoute,
		private teamService: TeamService,
		private log: LogService,
		private dialog: MatDialog,
		
	) { }

	ngOnInit(): void { 
		this.route.paramMap.subscribe(params => {
			const id = params.get('id')!;
			this.teamDetails(id);
		});
		this.suggestedMembers();
	}

	toggleEditing() {
		const dialogRef = this.dialog.open(EditTeamModalComponent, {
			width: '50%',
			disableClose: true,
			data: { team_name: this.team_name, description: this.description }
		});
		dialogRef.afterClosed().subscribe(result => {
			if(result) {
				let req = new ModelRequestBase();
				result.team_id = this.route.snapshot.paramMap.get('id');
				req.payload = result;
				this.teamService.editTeam(req).subscribe(
					(response) => {
						console.log(response);
						const id = response.payload.result;
						this.teamDetails(id);
					},
					(error) => {
						this.log.logError(error);
						this.dialog.open(NotificationModalComponent, {
							width: '400px',
							disableClose: true,
							data: { message: error.error.message }
						})
					}
				)
			}
		});
	}
	
	add(user: any) {
		this.dialog.open(YesNoModalComponent, {
			width: '400px', 
			disableClose: true,
			data: { message: `Are you sure you want to add ${user.name} to your team?` }
		}).afterClosed().subscribe(
			(result) => {
				if(result) {
					let loading =this.dialog.open(LoadingModalComponent, {
						width: '400px', 
						disableClose: true,
						data: { message: `Adding ${user.name} to your team!` }
					})
					const team_id = this.route.snapshot.paramMap.get('id')!;
					const user_id = [user.id];
					const data = { team_id: team_id, user_id: user_id };
					let model = new ModelRequestBase();
					model.payload = data;
					this.teamService.assignUserToTeam(model).subscribe(
						(response) => {
							loading.close();
							this.dialog.open(NotificationModalComponent, {
								width: '400px',
								disableClose: true,
								data: { message: response.message }
							})
							this.suggestedMembers();
							this.teamDetails(team_id);
						}
					)
				}
			}
		)
	}

	remove(user: any) {
		this.dialog.open(YesNoModalComponent, {
			width: '400px', 
			disableClose: true,
			data: { message: `Are you sure you want to remove ${user.firstName} ${user.lastName} from your team?` }
		}).afterClosed().subscribe(
			(result) => {
				if(result) {
					let loading =this.dialog.open(LoadingModalComponent, {
						width: '400px', 
						disableClose: true,
						data: { message: `Removing ${user.name} to your team!` }
					})
					const team_id = this.route.snapshot.paramMap.get('id')!;
					const user_id = user.id;
					const data = { team_id: team_id, user_id: user_id };
					let model = new ModelRequestBase();
					model.payload = data;
					this.teamService.removeUserFromTeam(model).subscribe(
						(response) => {
							loading.close();
							this.dialog.open(NotificationModalComponent, {
								width: '400px',
								disableClose: true,
								data: { message: response.message }
							})
							this.suggestedMembers();
							this.teamDetails(team_id);
						}
					)
				}
			}
		)
	}

	private teamDetails(id: string) {
		this.teamService.getTeam(id).subscribe(
			(response) => {
				this.team_name = response.payload.teamName;
				this.description = response.payload.description;
				const data: teamMembers[] = response.payload?.teamLists ?? [];
				data.forEach(element => {
					const date = new Date(element.createdAt);
					const options: Intl.DateTimeFormatOptions = {
						day: '2-digit',
						month: 'long',
						year: 'numeric'
					};
					const formatted = date.toLocaleDateString('en-GB', options);
					element.createdAt = formatted;
					element.profileImageUrl = element.profileImageUrl != 'null' 
						? environment.getBaseUrl + element.profileImageUrl 
						: environment.feBaseUrl + 'assets/img/avatars/noavatar.png';
				});

				this.members = data;
			},
			(error) => {
				this.log.logError(error);
			}
		);
	}

	private suggestedMembers() {
		this.teamService.getSuggestedMembers().subscribe(
			(response) => {
				const data: suggestedMembers[] = response.payload.teamLists;
				data.forEach(element => {
					element.profileImageUrl = element.profileImageUrl != 'null' 
						? environment.getBaseUrl + element.profileImageUrl 
						: environment.feBaseUrl + 'assets/img/avatars/noavatar.png';
				});
				this.suggestions = data;
			},
			(error) => {
				this.log.logError(error);
			}
		);
	}

}
