import { Component } from '@angular/core';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RouterOutlet } from '@angular/router';
import { VexConfigService } from '@vex/config/vex-config.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { VexConfig } from '@vex/config/vex-config.interface';
import { BaseLayoutComponent } from 'src/app/layouts/base-layout/base-layout.component';
import { HeaderComponent } from '../header/header.component';

@Component({
	selector: 'vex-layout',
	templateUrl: './layout.component.html',
	styleUrls: ['./layout.component.scss'],
	imports: [
		BaseLayoutComponent,
		NgIf,
		AsyncPipe,
		HeaderComponent,
		MatSidenavModule,
		RouterOutlet,
	],
	standalone: true
})
export class LayoutComponent {
	config$: Observable<VexConfig> = this.configService.config$;
	sidenavCollapsed$: Observable<boolean> = this.layoutService.sidenavCollapsed$;
	sidenavDisableClose$: Observable<boolean> = this.layoutService.isDesktop$;
	sidenavFixedInViewport$: Observable<boolean> =
		this.layoutService.isDesktop$.pipe(map((isDesktop) => !isDesktop));
	sidenavMode$: Observable<MatDrawerMode> = combineLatest([
		this.layoutService.isDesktop$,
		this.configService.select((config) => config.layout)
	]).pipe(
		map(([isDesktop, layout]) =>
		!isDesktop || layout === 'vertical' ? 'over' : 'side'
		)
	);
	sidenavOpen$: Observable<boolean> = this.layoutService.sidenavOpen$;
	configPanelOpen$: Observable<boolean> = this.layoutService.configPanelOpen$;
	quickpanelOpen$: Observable<boolean> = this.layoutService.quickpanelOpen$;

	constructor(
		private readonly layoutService: VexLayoutService,
		private readonly configService: VexConfigService
	) {
		this.configService.updateConfig(this.configService.configs[5])
	}

	onSidenavClosed(): void {
		this.layoutService.closeSidenav();
	}

	onQuickpanelClosed(): void {
		this.layoutService.closeQuickpanel();
	}
}
