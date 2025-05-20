import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { LogService } from '../core/services/log.service';

export const privateGuard: CanActivateFn = (route, state) => {
    const auth = inject(AuthService);
    const logService = inject(LogService);
	const router = inject(Router);
	const stats = auth.isAuthenticated();
	logService.logDebug(`Private Guard: ${stats ? 'Authenticated' : 'Not Authenticated'}`);
    return stats ? true : router.createUrlTree(['/login']);
};
