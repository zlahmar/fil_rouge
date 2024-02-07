import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { JoinComponent } from './components/join/join.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NotLoggedComponent } from './components/not-logged/not-logged.component';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'qzy-welcome-page',
  standalone: true,
  imports: [CommonModule, TranslateModule, JoinComponent, DashboardComponent, NotLoggedComponent],
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.scss',
})
export class WelcomePageComponent {
  private readonly authService = inject(AuthService);
  isLogged$ = this.authService.user$;

}
