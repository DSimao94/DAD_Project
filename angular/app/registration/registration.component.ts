import {Component} from '@angular/core';
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {User} from "../model/User";

@Component({
    moduleId: module.id,
    selector: 'registration',
    templateUrl: 'registration.component.html',
    styleUrls: ['registration.component.css']
})
export class RegistrationComponent {
    complexForm: FormGroup;
    model: any = {};

    constructor(fb: FormBuilder, private router: Router, private userService: UserService) {
        const emailRegex = '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$';

        this.complexForm = fb.group({
            'username': [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
            'email': [null, Validators.compose([Validators.required, Validators.pattern((emailRegex))])],
            'password': [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
            'passwordConfirmation': [null, Validators.required]
        });
    }

    submitForm(value: any) {
        let user = new User('', value.username, value.email, value.password, 0, 0);
        this.userService
            .create(user)
            .then(r => {
                if (r.error) {
                    this.complexForm.controls['username'].setErrors({'server': 'Username already taken'})
                } else {
                    this.router.navigate(['/login'])
                }
            })
    }

    goBack() {
        this.router.navigate(['/'])
    }
}