import {Component, Input} from '@angular/core';
import {WebSocketService} from "../../services/websocket.service";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {Game} from "../../model/Game";

@Component({
    moduleId: module.id,
    selector: 'game-chat',
    templateUrl: 'chat.component.html'
})
export class ChatComponent {
    @Input()
    chatGame: Game;
    message: string;
    complexForm: FormGroup;
    chatChannel: any[] = [];

    constructor(private fb: FormBuilder, private websocketService: WebSocketService) {
        this.complexForm = fb.group({
            'message': [null, Validators.required],
        });
        this.websocketService.getGameChatMessages().subscribe((m: any) => {
            this.chatChannel.push({user: m[0], message: m[1]});
        });
    }

    sendMessage(value: any): void {
        this.websocketService.sendGameChatMessage(value.message, this.chatGame._id);
        this.message = '';
    }
}
