import { Component, OnInit } from '@angular/core';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RouterOutlet } from '@angular/router';
import { VexConfigService } from '@vex/config/vex-config.service';
import { VexSidebarComponent } from '@vex/components/vex-sidebar/vex-sidebar.component';
import { AsyncPipe, NgIf, NgTemplateOutlet } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { VexProgressBarComponent } from '@vex/components/vex-progress-bar/vex-progress-bar.component';
import { VexConfig } from '@vex/config/vex-config.interface';
import { BaseLayoutComponent } from 'src/app/layouts/base-layout/base-layout.component';
import { QuickpanelComponent } from 'src/app/layouts/components/quickpanel/quickpanel.component';
import { ConfigPanelToggleComponent } from 'src/app/layouts/components/config-panel/config-panel-toggle/config-panel-toggle.component';
import { ConfigPanelComponent } from 'src/app/layouts/components/config-panel/config-panel.component';
import { SearchComponent } from 'src/app/layouts/components/toolbar/search/search.component';
import { FooterComponent } from '../footer/footer.component';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { HeaderComponent } from '../header/header.component';

@Component({
    selector: 'private-vex-layout',
    templateUrl: './private.layout.component.html',
    styleUrls: ['./private.layout.component.scss'],
    imports: [
        BaseLayoutComponent,
        NgIf,
        AsyncPipe,
        SidenavComponent,
        HeaderComponent,
        FooterComponent,
        QuickpanelComponent,
        ConfigPanelToggleComponent,
        VexSidebarComponent,
        ConfigPanelComponent,
        MatDialogModule,
        MatSidenavModule,
        NgTemplateOutlet,
        RouterOutlet,
        SearchComponent,
        VexProgressBarComponent
    ],
    standalone: true
})

export class PrivateLayoutComponent implements OnInit {

    config$: Observable<VexConfig> = this.configService.config$;
    sidenavCollapsed$: Observable<boolean> = this.layoutService.sidenavCollapsed$;
    sidenavDisableClose$: Observable<boolean> = this.layoutService.isDesktop$;

    sidenavFixedInViewport$: Observable<boolean> = this.layoutService.isDesktop$.pipe(map((isDesktop) => !isDesktop));
    
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
    ) {}

	ngOnInit() {
		let config = this.configService.configs[1];
		config.style.borderRadius.value = 0;
		this.configService.updateConfig(config);
	}

    onSidenavClosed(): void {
        this.layoutService.closeSidenav();
    }

    onQuickpanelClosed(): void {
        this.layoutService.closeQuickpanel();
    }
    
}
