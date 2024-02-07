import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { TranslateService } from '@ngx-translate/core';
import { fr } from './translations/fr';

@Component({
  standalone: true,
  imports: [RouterModule, HeaderComponent],
  selector: 'qzy-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly translateService = inject(TranslateService);
  title = 'quizzy-front';

  constructor() {
    this.translateService.setDefaultLang('fr');
    this.translateService.setTranslation('fr', fr);
    this.translateService.use('fr');
  }


}
