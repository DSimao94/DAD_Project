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
var app_component_1 = require("./app.component");
var authentication_module_1 = require("./authentication/authentication.module");
var app_routing_module_1 = require("./app.routing.module");
var registration_module_1 = require("./registration/registration.module");
var home_module_1 = require("./home/home.module");
var game_module_1 = require("./game/game.module");
var profile_module_1 = require("./profile/profile.module");
var cookies_service_1 = require("angular2-cookie/services/cookies.service");
var websocket_service_1 = require("./services/websocket.service");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [platform_browser_1.BrowserModule, authentication_module_1.AuthenticationModule, registration_module_1.RegistrationModule, home_module_1.HomeModule, app_routing_module_1.AppRoutingModule, game_module_1.GameModule, profile_module_1.ProfileModule],
        declarations: [app_component_1.AppComponent],
        providers: [cookies_service_1.CookieService, websocket_service_1.WebSocketService],
        bootstrap: [app_component_1.AppComponent]
    }),
    __metadata("design:paramtypes", [])
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map