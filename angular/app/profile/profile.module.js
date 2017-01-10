"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var http_1 = require("@angular/http");
var user_service_1 = require("../services/user.service");
var game_service_1 = require("../services/game.service");
var profile_component_1 = require("./profile.component");
var router_1 = require("@angular/router");
var forms_1 = require("@angular/forms");
var ng2_imageupload_1 = require("ng2-imageupload");
var ng2_file_upload_1 = require("ng2-file-upload");
//import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
var ProfileModule = (function () {
    function ProfileModule() {
    }
    return ProfileModule;
}());
ProfileModule = __decorate([
    core_1.NgModule({
        imports: [platform_browser_1.BrowserModule, http_1.HttpModule, router_1.RouterModule, ng2_imageupload_1.ImageUploadModule, forms_1.FormsModule, forms_1.ReactiveFormsModule],
        providers: [user_service_1.UserService, game_service_1.GameService],
        declarations: [profile_component_1.ProfileComponent, ng2_file_upload_1.FileSelectDirective],
        exports: [profile_component_1.ProfileComponent]
    }),
    __metadata("design:paramtypes", [])
], ProfileModule);
exports.ProfileModule = ProfileModule;
//# sourceMappingURL=profile.module.js.map