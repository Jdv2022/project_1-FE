import { Injectable } from '@angular/core';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { NavigationItem } from './navigation-item.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  	providedIn: 'root'
})
export class NavigationLoaderService {
	private readonly _items: BehaviorSubject<NavigationItem[]> =
		new BehaviorSubject<NavigationItem[]>([]);

	get items$(): Observable<NavigationItem[]> {
		return this._items.asObservable();
	}

	constructor(private readonly layoutService: VexLayoutService) {
		this.loadNavigation();
	}

	loadNavigation(): void {
		this._items.next([{
			type: 'subheading',
			label: 'Users',
			children: [
				{
					type: 'link',
					label: 'Overview',
					route: 'users/overview',
					icon: 'mat:dashboard',
					routerLinkActiveOptions: { exact: true }
				},
				{
					type: 'link',
					label: 'List',
					route: 'users/list',
					icon: 'mat:account_circle',
					routerLinkActiveOptions: { exact: true }
				},
				{
					type: 'link',
					label: 'Register',
					route: 'users/register',
					icon: 'mat:person_add',
					routerLinkActiveOptions: { exact: true }
				},
				{
					type: 'link',
					label: 'Attendance',
					route: 'users/attendance',
					icon: 'mat:check_circle',
					routerLinkActiveOptions: { exact: true }
				},
			]
		},
		{
			type: 'subheading',
			label: 'Teams',
			children: [
				{
					type: 'link',
					label: 'Create Team',
					route: 'users/create/team',
					icon: 'mat:group_add',
					routerLinkActiveOptions: { exact: true }
				},
				{
					type: 'link',
					label: 'Teams & Departments',
					route: 'users/teams/Departments',
					icon: 'mat:group',
					routerLinkActiveOptions: { exact: true }
				},
				{
					type: 'link',
					label: 'Shifts',
					route: 'users/shifts',
					icon: 'mat:schedule',
					routerLinkActiveOptions: { exact: true }
				},
			]
		},
		{
			type: 'subheading',
			label: 'Security',
			children: [
				{
					type: 'link',
					label: 'Archive',
					route: '/',
					icon: 'mat:archive',
					routerLinkActiveOptions: { exact: true }
				},
				{
					type: 'link',
					label: 'Permissions',
					route: '/',
					icon: 'mat:security',
					routerLinkActiveOptions: { exact: true }
				},
				{
					type: 'link',
					label: 'Activity log',
					route: '/',
					icon: 'mat:history',
					routerLinkActiveOptions: { exact: true }
				},
			]
		}
	]);
	}
}
