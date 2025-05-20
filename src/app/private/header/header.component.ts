import {
  Component,
  DestroyRef,
  HostBinding,
  inject,
  OnInit
} from '@angular/core';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { VexConfigService } from '@vex/config/vex-config.service';
import { filter, map, startWith, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { NavigationComponent } from '../navigation/navigation.component';
import { PrivateNavigationItemComponent } from '../navigation/private-navigation-item/private-navigation-item.component';
import { MatMenuModule } from '@angular/material/menu';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { checkRouterChildsData } from '@vex/utils/check-router-childs-data';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationItem } from '../navigation/navigation-item.interface';
import { NavigationService } from '../navigation/navigation.service';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { HeaderNotificationsComponent } from './header-notifications/header-notifications.component';
import { Link } from '@vex/interfaces/link.interface';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
    selector: 'vex-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule,
        NgIf,
        RouterLink,
        MatMenuModule,
        NgClass,
        NgFor,
        PrivateNavigationItemComponent,
        NavigationComponent,
        AsyncPipe,
        VexBreadcrumbsComponent,
        HeaderNotificationsComponent,
		MatTabsModule,
		RouterLinkActive
    ]
})

export class HeaderComponent implements OnInit {
    @HostBinding('class.shadow-b')
    showShadow: boolean = false;

	links: Link[] = [
		{
		  label: 'People',
		  route: '/private/users'
		},
		{
		  label: 'Project',
		  route: '../frequent'
		},
		{
		  label: 'Inventory',
		  route: '../starred'
		},
		{
		  label: 'Contract',
		  route: '../starred'
		}
	];

    navigationItems$: Observable<NavigationItem[]> = this.navigationService.items$;

    isHorizontalLayout$: Observable<boolean> = this.configService.config$.pipe(
        map((config) => config.layout === 'horizontal')
    );
    isVerticalLayout$: Observable<boolean> = this.configService.config$.pipe(
        map((config) => config.layout === 'vertical')
    );
    isNavbarInToolbar$: Observable<boolean> = this.configService.config$.pipe(
        map((config) => config.navbar.position === 'in-toolbar')
    );
    isNavbarBelowToolbar$: Observable<boolean> = this.configService.config$.pipe(
        map((config) => config.navbar.position === 'below-toolbar')
    );
    userVisible$: Observable<boolean> = this.configService.config$.pipe(
        map((config) => config.toolbar.user.visible)
    );
    title$: Observable<string> = this.configService.select(
        (config) => config.sidenav.title
    );

    isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
    megaMenuOpen$: Observable<boolean> = of(false);
    private readonly destroyRef: DestroyRef = inject(DestroyRef);

    constructor(
        private readonly layoutService: VexLayoutService,
        private readonly configService: VexConfigService,
        private readonly navigationService: NavigationService,
        private readonly router: Router
    ) {}

    ngOnInit() {
        this.router.events
        .pipe(
            filter((event) => event instanceof NavigationEnd),
            startWith(null),
            takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(() => {
            this.showShadow = checkRouterChildsData(
            this.router.routerState.root.snapshot,
            (data) => data.toolbarShadowEnabled ?? false
            );
        });
    }

    openQuickpanel(): void {
        this.layoutService.openQuickpanel();
    }

    openSidenav(): void {
        this.layoutService.openSidenav();
    }

}
