import { Component, inject } from '@angular/core';
import { AuthService } from '@shared/services/auth.service';

@Component({
  selector: 'app-auth',
  imports: [],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  private readonly auth = inject(AuthService);

  login() {
    this.auth.login();
  }
}
