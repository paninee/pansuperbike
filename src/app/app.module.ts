import {APP_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {environment} from '../environments/environment';
import {provideFirestore, getFirestore} from '@angular/fire/firestore';
import {provideStorage, getStorage} from '@angular/fire/storage';
import {provideAuth, getAuth} from '@angular/fire/auth';
import {ThemingService} from './shared/services/theming.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideAuth(() => getAuth())
  ],
  providers: [
    {provide: APP_ID, useValue: 'app-pansuperbike'},
    ThemingService // service
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
