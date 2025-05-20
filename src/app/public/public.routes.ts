import { VexRoutes } from '@vex/interfaces/vex-route.interface';
import { LayoutComponent } from './layout/layout.component';


export const PUBLIC_ROUTES: VexRoutes = [
    {
        path: 'public',
        component: LayoutComponent,
        children: [

        ]
    }
];