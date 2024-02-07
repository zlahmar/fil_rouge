import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'qzy-join',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule, TranslateModule, MatButtonModule],
  templateUrl: './join.component.html',
  styleUrl: './join.component.scss',
})
export class JoinComponent {
  private readonly router = inject(Router);
  joinCode = '';

  join() {
    this.router.navigateByUrl(`/join/${this.joinCode}`);
  }
}
