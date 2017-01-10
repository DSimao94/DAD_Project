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
var user_service_1 = require("../services/user.service");
var game_service_1 = require("../services/game.service");
var router_1 = require("@angular/router");
var game_component_1 = require("./game.component");
var http_1 = require("@angular/http");
var chat_component_1 = require("./game-chat/chat.component");
var forms_1 = require("@angular/forms");
var ng2_bs3_modal_1 = require("ng2-bs3-modal/ng2-bs3-modal");
var GameModule = (function () {
    function GameModule() {
    }
    return GameModule;
}());
GameModule = __decorate([
    core_1.NgModule({
        imports: [platform_browser_1.BrowserModule, http_1.HttpModule, router_1.RouterModule, forms_1.FormsModule, forms_1.ReactiveFormsModule, ng2_bs3_modal_1.Ng2Bs3ModalModule],
        providers: [user_service_1.UserService, game_service_1.GameService],
        declarations: [game_component_1.GameComponent, chat_component_1.ChatComponent],
        exports: [game_component_1.GameComponent]
    }),
    __metadata("design:paramtypes", [])
], GameModule);
exports.GameModule = GameModule;
//# sourceMappingURL=game.module.js.map