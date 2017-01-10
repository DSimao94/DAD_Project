import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {User} from "../model/User";
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";
import {ImageResult, ResizeOptions} from 'ng2-imageupload';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {FileUploader} from "ng2-file-upload";



@Component({
    moduleId: module.id,
    templateUrl: 'profile.component.html',
    styleUrls: ['profile.component.css']
})

export class ProfileComponent implements OnInit {
    complexForm: FormGroup;

    public uploader:FileUploader = new FileUploader({url:'http://localhost:8080/upload'});

    constructor(fb: FormBuilder, private router: Router, private userService: UserService) {
        this.complexForm = fb.group({
            'image': [null, Validators.required]
        });
    }

    ngOnInit(): void {
    }

    saveNewImage() {
        // TODO

        this.goLobby();
    }

    logOut(): void {
        this.userService
            .logOut()
            .then(() => this.router.navigate(['/']));
    }

    getAuthUser(): User {
        return JSON.parse(localStorage.getItem('user'));
    }

    goProfile(): void {
        this.router.navigate(['/profile']);
    }

    goLobby(): void {
        this.router.navigate(['/home']);
    }

}

