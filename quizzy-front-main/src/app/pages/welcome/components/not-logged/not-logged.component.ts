import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'qzy-not-logged',
  standalone: true,
  imports: [CommonModule, MatButtonModule, TranslateModule, RouterLink],
  templateUrl: './not-logged.component.html',
  styleUrl: './not-logged.component.scss',
})
export class NotLoggedComponent {}
