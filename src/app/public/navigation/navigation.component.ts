import { Component } from '@angular/core';
import { NavigationItemComponent } from './navigation-item/navigation-item.component';
import { AsyncPipe, NgFor } from '@angular/common';
import { Observable } from 'rxjs';
import { NavigationService } from './navigation.service';
import { NavigationItem } from './navigation-item.interface';

@Component({
  selector: 'vex-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  standalone: true,
  imports: [NgFor, NavigationItemComponent, AsyncPipe]
})
export class NavigationComponent {
  items$: Observable<NavigationItem[]> = this.navigationService.items$;

  constructor(private navigationService: NavigationService) {}
}
