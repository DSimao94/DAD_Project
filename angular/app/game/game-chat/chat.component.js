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
var websocket_service_1 = require("../../services/websocket.service");
var forms_1 = require("@angular/forms");
var Game_1 = require("../../model/Game");
var ChatComponent = (function () {
    function ChatComponent(fb, websocketService) {
        var _this = this;
        this.fb = fb;
        this.websocketService = websocketService;
        this.chatChannel = [];
        this.complexForm = fb.group({
            'message': [null, forms_1.Validators.required],
        });
        this.websocketService.getGameChatMessages().subscribe(function (m) {
            _this.chatChannel.push({ user: m[0], message: m[1] });
        });
    }
    ChatComponent.prototype.sendMessage = function (value) {
        this.websocketService.sendGameChatMessage(value.message, this.chatGame._id);
        this.message = '';
    };
    return ChatComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Game_1.Game)
], ChatComponent.prototype, "chatGame", void 0);
ChatComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'game-chat',
        templateUrl: 'chat.component.html'
    }),
    __metadata("design:paramtypes", [forms_1.FormBuilder, websocket_service_1.WebSocketService])
], ChatComponent);
exports.ChatComponent = ChatComponent;
//# sourceMappingURL=chat.component.js.map