import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createClient } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';

const supabase = createClient(
  'https://sbepsehwykxrxzgmvwid.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNiZXBzZWh3eWt4cnh6Z212d2lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0MTQ0NTQsImV4cCI6MjA2MTk5MDQ1NH0.zy3zlWut2dSJMnos5SrjxFQgDXy5lSHMrIVDG7zr_bY' // Pegue em Project Settings > API > anon key
);

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  router = inject(Router);

  private userAuthenticated$ = new BehaviorSubject<boolean>(false);
  private userRole$ = new BehaviorSubject<string | null>('admin');

  signInWithGoogle() {
    return supabase.auth.signInWithOAuth({
      provider: 'google',
    });
  }

  login() {
    this.userAuthenticated$.next(true);
    this.router.navigate(['/']);
  }

  logout() {
    this.userAuthenticated$.next(false);
    this.router.navigateByUrl('/auth').then(() => {
      this.router.navigate(['/']);
    });
  }

  isAuthenticated() {
    return this.userAuthenticated$.value;
  }

  isAuthenticated$() {
    return this.userAuthenticated$.asObservable();
  }

  setUserRole(role: string) {
    this.userRole$.next(role);
  }

  getUserRole$(): Observable<string | null> {
    return this.userRole$.asObservable();
  }
}
