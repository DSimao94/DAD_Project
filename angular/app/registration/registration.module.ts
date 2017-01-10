import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RegistrationComponent} from "./registration.component";
import {HttpModule} from "@angular/http";
import {UserService} from "../services/user.service";
import {FormsModule, ReactiveFormsModule}   from '@angular/forms';
import {RouterModule} from "@angular/router";

@NgModule({
    imports: [BrowserModule, HttpModule, FormsModule, ReactiveFormsModule, RouterModule],
    providers: [UserService],
    declarations: [RegistrationComponent],
    exports: [RegistrationComponent]
})
export class RegistrationModule {
}
