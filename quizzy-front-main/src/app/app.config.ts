import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { authInterceptor } from './services/auth/auth-interceptor.service';
import { SocketIoModule } from 'ngx-socket-io';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withComponentInputBinding()),
    provideAnimations(),
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(
      [
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideAuth(() => getAuth()),
        TranslateModule.forRoot()],
        SocketIoModule.forRoot({ url: environment.baseUrl }),
    )]
};
