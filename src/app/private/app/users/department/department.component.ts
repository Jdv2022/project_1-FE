import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
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
import { ModelRequestBase } from 'src/app/core/base/model.request.base';
import { NotificationModalComponent } from 'src/app/private/utilities/notification-modal/notification.modal.component';
import { YesNoModalComponent } from 'src/app/private/utilities/yes-no-modal/yes-no-modal.component';
import { MatCardModule } from '@angular/material/card';
import { LoadingModalComponent } from 'src/app/private/utilities/loading-modal/loading.modal.component';
import { DepartmentService } from './department.service';
import { EditDepartmentModalComponent } from './edit-department-modal/edit-department-modal.component';

interface suggestedMembers {
	id: number;
	name: string;
	department: string;
	isOnDepartment: string;
	profileImageName: string;
	profileImageUrl: string;
}

interface departmentMembers {
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
	selector: 'vex-department',
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
	templateUrl: './department.component.html',
	styleUrl: './department.component.scss',
	providers: [DepartmentService]
})

export class DepartmentComponent implements OnInit {

	department_name: string = '-';
	description: string = '-';
	suggestions: suggestedMembers[] = [];
	members: departmentMembers[] = [];
	department_id!: number;

	constructor(
		private route: ActivatedRoute,
		private departmentService: DepartmentService,
		private log: LogService,
		private dialog: MatDialog,
		private router: Router
	) { }

	ngOnInit(): void { 
		this.route.paramMap.subscribe(params => {
			this.department_id = Number(params.get('id'));
			const id = params.get('id')!;
			console.log("ASDASDASDASDASD")
			this.departmentDetails(id);
		});
		this.suggestedMembers();
	}

	toggleEditing() {
		const dialogRef = this.dialog.open(EditDepartmentModalComponent, {
			width: '50%',
			disableClose: true,
			data: { department_name: this.department_name, description: this.description }
		});
		dialogRef.afterClosed().subscribe(result => {
			if(result) {
				let req = new ModelRequestBase();
				result.department_id = this.route.snapshot.paramMap.get('id');
				req.payload = result;
				this.departmentService.editDepartment(req).subscribe(
					(response) => {
						console.log(response);
						const id = response.payload.result;
						this.departmentDetails(id);
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
			data: { message: `Are you sure you want to add ${user.name} to your department?` }
		}).afterClosed().subscribe(
			(result) => {
				if(result) {
					let loading =this.dialog.open(LoadingModalComponent, {
						width: '400px', 
						disableClose: true,
						data: { message: `Adding ${user.name} to your department!` }
					})
					const department_id = this.route.snapshot.paramMap.get('id')!;
					const user_id = [user.id];
					const data = { department_id: department_id, user_id: user_id };
					let model = new ModelRequestBase();
					model.payload = data;
					this.departmentService.assignUserToDepartment(model).subscribe(
						(response) => {
							loading.close();
							this.dialog.open(NotificationModalComponent, {
								width: '400px',
								disableClose: true,
								data: { message: response.message }
							})
							this.suggestedMembers();
							this.departmentDetails(department_id);
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
						data: { message: `Removing ${user.name} to your department!` }
					})
					const department_id = this.route.snapshot.paramMap.get('id')!;
					const user_id = user.id;
					const data = { department_id: department_id, user_id: user_id };
					let model = new ModelRequestBase();
					model.payload = data;
					this.departmentService.removeUserFromDepartment(model).subscribe(
						(response) => {
							loading.close();
							this.dialog.open(NotificationModalComponent, {
								width: '400px',
								disableClose: true,
								data: { message: response.message }
							})
							this.suggestedMembers();
							this.departmentDetails(department_id);
						}
					)
				}
			}
		)
	}

	private departmentDetails(id: string) {
		console.log("ASDASDASDASDASD")
		this.departmentService.getDepartment(id).subscribe(
			(response) => {
				console.log("XXXXX");
				console.log(response);
				this.department_name = response.payload.departmentName;
				this.description = response.payload.description;
				const data: departmentMembers[] = response.payload?.departmentLists ?? [];
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

	deleteDepartment() {
		this.dialog.open(YesNoModalComponent, {
			width: '400px', 
			disableClose: true,
			data: { message: `Are you sure you want to delete this department?` }
		}).afterClosed().subscribe(
			(result) => {
				if(result) {
					let model = new ModelRequestBase();
					model.payload = { department_id: this.department_id, user_id: this.department_id };
					this.departmentService.deleteDepartment(model).subscribe(
						(response) => {
							this.router.navigate([`private/users/teams/departments`]);
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
			}
		)
	}

	private suggestedMembers() {
		this.departmentService.getSuggestedMembers().subscribe(
			(response) => {
				const data: suggestedMembers[] = response.payload.departmentLists;
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
