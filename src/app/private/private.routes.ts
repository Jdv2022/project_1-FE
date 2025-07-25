import { VexRoutes } from '@vex/interfaces/vex-route.interface';
import { privateGuard } from './private.guard';
import { AadAuthComponent } from './app/aad-auth/aad-auth.component';
import { LoginComponent } from './app/users/login/login.component';
import { PrivateLayoutComponent } from './private-layout/private.layout.component';
import { UsersComponent } from './app/users.component';
import { ProfileComponent } from 'src/app/private/app/users/profile/profile.component';
import PROFILE_ROUTES from './app/users/profile/profile.routes';
import { ProfileService } from './app/users/profile/profile.service';
import { TeamsDepartmentComponent } from './app/users/teams-department/teams-department.component';

export const PRIVATE_ROUTES: VexRoutes = [
    {
        path: '',
        component: AadAuthComponent,
        children: [
			{
				path: 'login',
				component: LoginComponent,
				children: [
		
				]
			},
			{
				path: 'private',
				component: PrivateLayoutComponent,
				canActivate: [privateGuard],
				children: [
					{
						path: 'users',
						component: UsersComponent,
						children: [
							{
								path: 'list',
								loadComponent: () =>
								import('src/app/private/app/users/list/list.component').then((m) => m.ListsComponent)
							},
							{
								path: 'register',
								loadComponent: () =>
								import('src/app/private/app/users/register/register.component').then((m) => m.RegisterComponent)
							},
							{
								path: 'attendance',
								loadComponent: () =>
								import('src/app/private/app/users/attendance/attendance.component').then((m) => m.AttendanceComponent)
							},
							{
								path: 'attendance',
								loadComponent: () =>
								import('src/app/private/app/users/attendance/attendance.component').then((m) => m.AttendanceComponent)
							},
							{
								path: 'create/team',
								loadComponent: () =>
								import('src/app/private/app/users/create-team/create-team.component').then((m) => m.CreateTeamComponent)
							},
							{
								path: 'team/details/:id',
								loadComponent: () =>
								import('src/app/private/app/users/team/team.component').then((m) => m.TeamComponent)
							},
							{
								path: 'teams/departments',
								loadComponent: () =>
									import('src/app/private/app/users/teams-department/teams-department.component').then((m) => m.TeamsDepartmentComponent)
							},
							{
								path: 'create/department',
								loadComponent: () =>
									import('src/app/private/app/users/create-department/create-department.component').then((m) => m.CreateDepartmentComponent)
							},
							{
								path: 'department/details/:id',
								loadComponent: () =>
								import('src/app/private/app/users/department/department.component').then((m) => m.DepartmentComponent)
							},
							{
								path: 'profile/:id',
								component: ProfileComponent,
								providers: [ProfileService],
								children: [
									...PROFILE_ROUTES
								]
							},
						]
					},
				]
			},
        ]
    }
];