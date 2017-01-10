import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {UserService} from "../services/user.service";
import {GameService} from "../services/game.service";
import {RouterModule} from "@angular/router";
import {GameComponent} from "./game.component";
import {HttpModule} from "@angular/http";
import {ChatComponent} from "./game-chat/chat.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';


@NgModule({
    imports: [BrowserModule, HttpModule, RouterModule, FormsModule, ReactiveFormsModule, Ng2Bs3ModalModule],
    providers: [UserService, GameService],
    declarations: [GameComponent, ChatComponent],
    exports: [GameComponent]
})
export class GameModule {
}