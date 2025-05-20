import {
  Component,
  DestroyRef,
  HostBinding,
  inject,
  OnInit
} from '@angular/core';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { VexConfigService } from '@vex/config/vex-config.service';
import { filter, map, startWith } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { NavigationComponent } from '../navigation/navigation.component';
import { NavigationItemComponent } from '../navigation/navigation-item/navigation-item.component';
import { MatMenuModule } from '@angular/material/menu';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { checkRouterChildsData } from '@vex/utils/check-router-childs-data';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationItem } from '../navigation/navigation-item.interface';
import { NavigationService } from '../navigation/navigation.service';

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
		NavigationItemComponent,
		NavigationComponent,
		AsyncPipe
	]
})
export class HeaderComponent implements OnInit {
	@HostBinding('class.shadow-b')
	showShadow: boolean = false;

	navigationItems$: Observable<NavigationItem[]> =
		this.navigationService.items$;

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

}
