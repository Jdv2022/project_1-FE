import { Component, Input, OnInit } from '@angular/core';
import {
  NavigationItem,
  NavigationLink
} from 'src/app/private/navigation/navigation-item.interface';
import { filter, map, startWith } from 'rxjs/operators';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { trackByRoute } from '@vex/utils/track-by';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import {
  AsyncPipe,
  NgClass,
  NgFor,
  NgIf,
  NgTemplateOutlet
} from '@angular/common';
import { NavigationService } from '../navigation.service';

@Component({
  selector: 'private-vex-navigation-item',
  templateUrl: './private-navigation-item.component.html',
  styleUrls: ['./private-navigation-item.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    MatRippleModule,
    NgClass,
    RouterLink,
    MatMenuModule,
    NgFor,
    MatIconModule,
    NgTemplateOutlet,
    AsyncPipe
  ]
})
export class PrivateNavigationItemComponent implements OnInit {
  @Input({ required: true }) item!: NavigationItem;

  isActive$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    startWith(null),
    map(() => (item: NavigationItem) => this.hasActiveChilds(item))
  );

  isLink = this.navigationService.isLink;
  isDropdown = this.navigationService.isDropdown;
  isSubheading = this.navigationService.isSubheading;
  trackByRoute = trackByRoute;

  constructor(
    private navigationService: NavigationService,
    private router: Router
  ) {}

  ngOnInit() {}

  hasActiveChilds(parent: NavigationItem): boolean {
    if (this.isLink(parent)) {
      return this.router.isActive(parent.route as string, true);
    }

    if (this.isDropdown(parent) || this.isSubheading(parent)) {
      return parent.children.some((child) => {
        if (this.isDropdown(child)) {
          return this.hasActiveChilds(child);
        }

        if (this.isLink(child) && !this.isFunction(child.route)) {
          return this.router.isActive(child.route as string, true);
        }

        return false;
      });
    }

    return false;
  }

  isFunction(prop: NavigationLink['route']) {
    return prop instanceof Function;
  }
}
