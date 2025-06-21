import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const authRequired = route.data['authRequired'] !== false;
    const isAuthenticated = this.authService.isLoggedIn();

    if (authRequired && !isAuthenticated) {
      // Redirect to login with return URL
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    }

    if (!authRequired && isAuthenticated) {
      // Redirect away if already logged in
      this.router.navigate(['/dashboard']);
      return false;
    }

    return true;
  }
}
