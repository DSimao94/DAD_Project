import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent}  from './app.component';
import {AuthenticationModule} from "./authentication/authentication.module";
import {AppRoutingModule} from "./app.routing.module";
import {RegistrationModule} from "./registration/registration.module";
import {HomeModule} from "./home/home.module";
import {GameModule} from "./game/game.module";
import {ProfileModule} from "./profile/profile.module";
import {CookieService} from 'angular2-cookie/services/cookies.service';
import {WebSocketService} from "./services/websocket.service";

@NgModule({
    imports: [BrowserModule, AuthenticationModule, RegistrationModule, HomeModule, AppRoutingModule, GameModule, ProfileModule],
    declarations: [AppComponent],
    providers: [CookieService, WebSocketService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
