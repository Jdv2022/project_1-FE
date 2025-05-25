import {
    AfterViewInit,
    Component,
    DestroyRef,
    inject,
    Input,
    OnInit,
    ViewChild
  } from '@angular/core';
  import { MatTableDataSource, MatTableModule } from '@angular/material/table';
  import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
  import { MatSort, MatSortModule } from '@angular/material/sort';
  import { MatDialog, MatDialogModule } from '@angular/material/dialog';
  import { TableColumn } from '@vex/interfaces/table-column.interface';
  import { SelectionModel } from '@angular/cdk/collections';
  import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
  import { stagger40ms } from '@vex/animations/stagger.animation';
  import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormControl
  } from '@angular/forms';
  import { MatCheckboxModule } from '@angular/material/checkbox';
  import { MatMenuModule } from '@angular/material/menu';
  import { MatIconModule } from '@angular/material/icon';
  import { MatTooltipModule } from '@angular/material/tooltip';
  import { MatButtonModule } from '@angular/material/button';
  import { NgClass, NgFor, NgIf } from '@angular/common';
  import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
  import { MatButtonToggleModule } from '@angular/material/button-toggle';
  import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
  import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
  import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
  import { MatInputModule } from '@angular/material/input';
import { CustomerCreateUpdateComponent } from 'src/app/pages/apps/aio-table/customer-create-update/customer-create-update.component';
import { ListUsersModel } from './list.users.model';
import { ListService } from './list.service';
import { ModelRequestBase } from 'src/app/core/base/model.request.base';
import { ReplaySubject } from 'rxjs';
import { USERS_HEIRARCHY } from 'src/static-data/users-heirarchy';

  @Component({
    selector: 'vex-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    animations: [fadeInUp400ms, stagger40ms],
    standalone: true,
	providers: [ListService],
    imports: [
        VexPageLayoutComponent,
        VexBreadcrumbsComponent,
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
        MatInputModule
    ]
})

//TODO replace ANY when actual data is here
export class ListsComponent implements OnInit, AfterViewInit {
    layoutCtrl = new UntypedFormControl('boxed');

    /**
     * Simulating a service with HTTP that returns Observables
     * You probably want to remove this and do all requests in a service with HTTP
     */
    subject$: ReplaySubject<ListUsersModel[]> = new ReplaySubject<ListUsersModel[]>(1);
    customers: ListUsersModel[] = [];

    @Input()
    columns: TableColumn<ListUsersModel>[] = [
        { label: 'Image', property: 'userDetailsProfileImageURL', type: 'image', visible: true },
        {
            label: 'Name',
            property: 'name',
            type: 'text',
            visible: true,
            cssClasses: ['font-medium']
        },
		{
            label: 'Phone',
            property: 'userDetailsPhone',
            type: 'text',
            visible: true,
            cssClasses: ['text-secondary', 'font-medium']
        },
		{
            label: 'Department',
            property: 'userDepartmentsDepartmentName',
            type: 'text',
            visible: true,
            cssClasses: ['text-secondary', 'font-medium']
        },
        {
            label: 'Address',
            property: 'userDetailsAddress',
            type: 'text',
            visible: true,
            cssClasses: ['text-secondary', 'font-medium']
        },
        {
            label: 'Birth Date',
            property: 'userDetailsDateOfBirth',
            type: 'text',
            visible: true,
            cssClasses: ['text-secondary', 'font-medium']
        },
		{
            label: 'Email Address',
            property: 'userDetailsEmail',
            type: 'text',
            visible: true,
            cssClasses: ['text-secondary', 'font-medium']
        },
		{
            label: 'Gender',
            property: 'userDetailsGender',
            type: 'text',
            visible: true,
            cssClasses: ['text-secondary', 'font-medium']
        },
        { label: 'Heirarchy', property: 'heirarchy', type: 'badge', visible: true },
    ];
    pageSize = 10;
    pageSizeOptions: number[] = [5, 10, 20, 50];
    dataSource!: MatTableDataSource<ListUsersModel>;
    selection = new SelectionModel<ListUsersModel>(true, []);
    searchCtrl = new UntypedFormControl();

    // labels = USERS_HEIRARCHY;

    @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort?: MatSort;

    private readonly destroyRef: DestroyRef = inject(DestroyRef);

    constructor(
		private dialog: MatDialog,
		private listService: ListService
	) {}

    get visibleColumns() {
        return this.columns
        .filter((column) => column.visible)
        .map((column) => column.property);
    }

    /**
     * Example on how to get data and pass it to the table - usually you would want a dedicated service with a HTTP request for this
     * We are simulating this request here.
     */
    getData() {
        // return of(aioTableData.map((customer) => new ListUsersModel(customer)));
    }

    ngOnInit() {
        this.dataSource = new MatTableDataSource();

		this.listService.getUserList(new ModelRequestBase()).subscribe(
			(response) => {
				const users = response.payload.map((user: any) => {
					return new ListUsersModel(user);
				});
				this.dataSource.data = users;
			}
		)
		console.log(this.dataSource)
        this.searchCtrl.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((value) => this.onFilterChange(value));
    }

    ngAfterViewInit() {
        if (this.paginator) {
        	this.dataSource.paginator = this.paginator;
        }

        if (this.sort) {
        	this.dataSource.sort = this.sort;
        }
    }

    deleteCustomer(customer: ListUsersModel) {
        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */
        this.customers.splice(
        this.customers.findIndex(
            (existingCustomer) => existingCustomer.id === customer.id
        ),
        1
        );
        this.selection.deselect(customer);
        this.subject$.next(this.customers);
    }

    deleteCustomers(customers: ListUsersModel[]) {
        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */
        customers.forEach((c) => this.deleteCustomer(c));
    }

    onFilterChange(value: string) {
        if (!this.dataSource) {
        return;
        }
        value = value.trim();
        value = value.toLowerCase();
        this.dataSource.filter = value;
    }

    toggleColumnVisibility(column: TableColumn<ListUsersModel>, event: Event) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        column.visible = !column.visible;
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected()
			? this.selection.clear()
			: this.dataSource.data.forEach((row) => this.selection.select(row));
    }

    trackByProperty<T>(index: number, column: TableColumn<T>) {
        return column.property;
    }

    // onLabelChange(change: MatSelectChange, row: ListUsersModel) {
    //     const index = this.customers.findIndex((c) => c === row);
    //     this.customers[index].labels = change.value;
    //     this.subject$.next(this.customers);
    // }
}
