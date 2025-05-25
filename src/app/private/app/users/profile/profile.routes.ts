import { VexRoutes } from '@vex/interfaces/vex-route.interface';
import { ProfileComponent } from './profile.component';


const PROFILE_ROUTES: VexRoutes = [
  	{
		path: 'about',
		loadComponent: () =>
			import('./about/about.component').then(
				(m) => m.AboutComponent
			)
	},
	{
		path: 'timeline',
		loadComponent: () =>
			import('./timeline/timeline.component').then(
				(m) => m.TimelineComponent
			)
	}
];

export default PROFILE_ROUTES;
