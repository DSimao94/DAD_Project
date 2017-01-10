import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from "@angular/http";
import {UserService} from "../services/user.service";
import {GameService} from "../services/game.service";
import {ProfileComponent} from "./profile.component";
import {RouterModule} from "@angular/router";
import {WebSocketService} from "../services/websocket.service";
import {FormsModule, ReactiveFormsModule}   from '@angular/forms';
import { ImageUploadModule } from 'ng2-imageupload';
import { FileSelectDirective} from 'ng2-file-upload';
//import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';

@NgModule({
    imports: [BrowserModule, HttpModule, RouterModule, ImageUploadModule, FormsModule, ReactiveFormsModule],
    providers: [UserService, GameService],
    declarations: [ProfileComponent, FileSelectDirective],
    exports: [ProfileComponent]
})
export class ProfileModule {
}