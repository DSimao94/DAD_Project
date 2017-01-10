import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from "@angular/http";
import {UserService} from "../services/user.service";
import {GameService} from "../services/game.service";
import {HomeComponent} from "./home.component";
import {FormsModule, ReactiveFormsModule}   from '@angular/forms';
import {RouterModule} from "@angular/router";
import {WebSocketService} from "../services/websocket.service";

@NgModule({
    imports: [BrowserModule, HttpModule, FormsModule, ReactiveFormsModule, RouterModule],
    providers: [UserService, GameService],
    declarations: [HomeComponent],
    exports: [HomeComponent]
})
export class HomeModule {
}