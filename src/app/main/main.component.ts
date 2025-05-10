import { MenuComponent } from '@admin/components/menu/menu.component';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '@shared/services/auth.service';

@Component({
  selector: 'app-main',
  imports: [
    RouterOutlet,
    MenuComponent,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  private auth = inject(AuthService);

  logout() {
    this.auth.logout();
  }
}
