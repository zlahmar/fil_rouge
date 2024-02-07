import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PingService, PingStatus } from '../../services/ping.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../services/auth/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'qzy-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatTooltipModule, TranslateModule, MatMenuModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private readonly pingService = inject(PingService);
  private readonly authService = inject(AuthService);
  pingStatus$ = this.pingService.ping();
  protected readonly PingStatus = PingStatus;
  isLoggedIn$ = this.authService.isLogged$;
  userDetails$ = this.authService.userDetails$;

  logout() {
    this.authService.logout();
  }
}
