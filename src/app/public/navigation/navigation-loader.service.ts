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
    this._items.next([
			{
				type: 'subheading',
				label: 'Overview',
				children: [

				]
			},
			{
                type: 'subheading',
                label: 'Company Details',
                children: [
                    {
                        type: 'link',
                        label: 'About Us',
                        route: '/',
                        icon: 'mat:corporate_fare',
                        routerLinkActiveOptions: { exact: true }
                    },
                    {
                        type: 'link',
                        label: 'Mission & Vision',
                        route: '/',
                        icon: 'mat:flag',
                        routerLinkActiveOptions: { exact: true }
                    },
                    {
                        type: 'link',
                        label: 'Company History',
                        route: '/',
                        icon: 'mat:history',
                        routerLinkActiveOptions: { exact: true }
                    },

                ]
            },
			{
                type: 'subheading',
                label: 'Employees & Teams',
                children: [
                    {
                        type: 'link',
                        label: 'Key Personnel',
                        route: '/',
                        icon: 'mat:supervisor_account',
                        routerLinkActiveOptions: { exact: true }
                    },
                    {
                        type: 'link',
                        label: 'Teams & Departments',
                        route: '/',
                        icon: 'mat:groups',
                        routerLinkActiveOptions: { exact: true }
                    },
                ]
            },
            {
                type: 'subheading',
                label: 'Employees & Teams',
                children: [
                    {
                        type: 'link',
                        label: 'Ongoing Projects',
                        route: '/',
                        icon: 'mat:construction',
                        routerLinkActiveOptions: { exact: true }
                    },
                    {
                        type: 'link',
                        label: 'Completed Projects',
                        route: '/',
                        icon: 'mat:task_alt',
                        routerLinkActiveOptions: { exact: true }
                    },
                ]
            },
            {
                type: 'subheading',
                label: 'Job Opportunities',
                children: [
                    {
                        type: 'link',
                        label: 'Open Positions',
                        route: '/',
                        icon: 'mat:work',
                        routerLinkActiveOptions: { exact: true }
                    },
                    {
                        type: 'link',
                        label: 'How to Apply',
                        route: '/',
                        icon: 'mat:how_to_reg',
                        routerLinkActiveOptions: { exact: true }
                    },
                ]
            },
            {
                type: 'subheading',
                label: 'Job Opportunities',
                children: [
                    {
                        type: 'link',
                        label: 'What We Offer',
                        route: '/',
                        icon: 'mat:home_repair_service',
                        routerLinkActiveOptions: { exact: true }
                    },
                    {
                        type: 'link',
                        label: 'Specializations',
                        route: '/',
                        icon: 'mat:engineering',
                        routerLinkActiveOptions: { exact: true }
                    },
                ]
            },
            {
                type: 'subheading',
                label: 'Contact Us',
                children: [
                    {
                        type: 'link',
                        label: 'Office Locations',
                        route: '/',
                        icon: 'mat:location_on',
                        routerLinkActiveOptions: { exact: true }
                    },
                    {
                        type: 'link',
                        label: 'Inquiry Form',
                        route: '/',
                        icon: 'mat:mail',
                        routerLinkActiveOptions: { exact: true }
                    },
                ]
            }
		]);
	}
}
