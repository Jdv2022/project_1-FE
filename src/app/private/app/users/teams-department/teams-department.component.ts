import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TeamsDepartmentService } from './teams-department.service';
import { ModelRequestBase } from 'src/app/core/base/model.request.base';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { stagger40ms } from '@vex/animations/stagger.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';

interface Team {
	id: string;
	teamName: string;
	description: string;
	createdAt: string;
	updatedAt: string;
}

interface Department {
	id: string;
	departmentName: string;
	description: string;
	createdAt: string;
	updatedAt: string;
}

@Component({
	selector: 'vex-teams-department',
	standalone: true,
	imports: [
		MatIconModule,
		NgIf,
		NgFor,
		VexPageLayoutComponent,
		MatTableModule,
		NgClass,
		MatPaginatorModule,
		VexPageLayoutComponent,
		MatButtonToggleModule,
		ReactiveFormsModule,
		VexPageLayoutContentDirective,
		NgIf,
		MatButtonModule,
		MatTooltipModule,
		MatIconModule,
		MatMenuModule,
		MatTableModule,
		MatSortModule,
		MatCheckboxModule,
		NgFor,
		NgClass,
		MatPaginatorModule,
		FormsModule,
		MatDialogModule,
		MatInputModule,
	],
	
	animations: [
		scaleFadeIn400ms,
		stagger40ms,
		fadeInUp400ms
	],
	templateUrl: './teams-department.component.html',
	styleUrl: './teams-department.component.scss',
	providers: [TeamsDepartmentService]
})

export class TeamsDepartmentComponent implements OnInit {

	departments: any[] = [];
	teams: any[] = [];
	dataSourceTeams!: MatTableDataSource<Team>;
	dataSourceDepartments!: MatTableDataSource<Department>;
	pageSizeTeams = 5;
	pageSizeDepartments = 5;
	pageSizeOptions: number[] = [5, 10, 20, 50];
	selection = new SelectionModel<Team>(true, []);
	searchCtrl = new UntypedFormControl();

	@ViewChild(MatPaginator, { static: true }) paginatorTeams?: MatPaginator;
	@ViewChild(MatPaginator, { static: true }) paginatorDepartments?: MatPaginator;
	@ViewChild(MatSort, { static: true }) sortTeams?: MatSort;
	@ViewChild(MatSort, { static: true }) sortDepartments?: MatSort;

	@Input()
	columnsTeam: TableColumn<Team>[] = [
		{
			label: 'Action',
			property: 'id',
			type: 'button',
			visible: true,
			cssClasses: ['text-secondary', 'font-medium']
		},
		{
			label: 'Team Name',
			property: 'teamName',
			type: 'text',
			visible: true,
			cssClasses: ['text-secondary', 'font-medium']
		},
		{
			label: 'Description',
			property: 'description',
			type: 'text',
			visible: true,
			cssClasses: ['text-secondary', 'font-medium']
		},
		{
			label: 'Created At',
			property: 'createdAt',
			type: 'text',
			visible: true,
			cssClasses: ['text-secondary', 'font-medium']
		},
		{
			label: 'Updated At',
			property: 'updatedAt',
			type: 'text',
			visible: true,
			cssClasses: ['text-secondary', 'font-medium']
		},
	];

	@Input()
	columnsDepartment: TableColumn<Department>[] = [
		{
			label: 'Action',
			property: 'id',
			type: 'button',
			visible: true,
			cssClasses: ['text-secondary', 'font-medium']
		},
		{
			label: 'Department Name',
			property: 'departmentName',
			type: 'text',
			visible: true,
			cssClasses: ['text-secondary', 'font-medium']
		},
		{
			label: 'Description',
			property: 'description',
			type: 'text',
			visible: true,
			cssClasses: ['text-secondary', 'font-medium']
		},
		{
			label: 'Created At',
			property: 'createdAt',
			type: 'text',
			visible: true,
			cssClasses: ['text-secondary', 'font-medium']
		},
		{
			label: 'Updated At',
			property: 'updatedAt',
			type: 'text',
			visible: true,
			cssClasses: ['text-secondary', 'font-medium']
		},
	];

	constructor(
		private teamsDepartmentService: TeamsDepartmentService,
		private router: Router
	) { }

	ngOnInit(): void {
		this.getTeams();
		this.getDepartments();
	}

    trackByProperty<T>(index: number, column: TableColumn<T>) {
        return column.property;
    }

	get visibleColumnsTeam() {
        return this.columnsTeam
			.filter((column) => column.visible)
			.map((column) => column.property);
    }

	get visibleColumnsDepartment() {
        return this.columnsDepartment
			.filter((column) => column.visible)
			.map((column) => column.property);
    }

	openTeam(id: string) {
		this.router.navigate([`private/users/team/details/${id}`]);
	}

	openDepartment(id: string) {
		this.router.navigate([`private/users/department/details/${id}`]);
	}

	private getTeams() {
		let model = new ModelRequestBase();
		model.payload = null;
		this.teamsDepartmentService.getTeamLists(model).subscribe(
			(res: any) => {
				this.teams = res.payload.teamLists;
				this.dataSourceTeams = new MatTableDataSource<Team>(this.teams);
				if (this.paginatorTeams) {
					this.dataSourceTeams.paginator = this.paginatorTeams;
				}
		
				if (this.sortTeams) {
					this.dataSourceTeams.sort = this.sortTeams;
				}
			}
		)
	}

	private getDepartments() {
		let model = new ModelRequestBase();
		model.payload = null;
		this.teamsDepartmentService.getDepartmentLists(model).subscribe(
			(res: any) => {
				console.log(res);
				this.departments = res.payload.departments;
				this.dataSourceDepartments = new MatTableDataSource<Department>(this.departments);
				console.log(this.dataSourceDepartments);
				if (this.paginatorDepartments) {
					this.dataSourceDepartments.paginator = this.paginatorDepartments;
				}
				if (this.sortDepartments) {
					this.dataSourceDepartments.sort = this.sortDepartments;
				}
			}
		)
	}

}
