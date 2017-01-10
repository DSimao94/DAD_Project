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
var user_service_1 = require("../services/user.service");
var router_1 = require("@angular/router");
var forms_1 = require("@angular/forms");
var User_1 = require("../model/User");
var RegistrationComponent = (function () {
    function RegistrationComponent(fb, router, userService) {
        this.router = router;
        this.userService = userService;
        this.model = {};
        var emailRegex = '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$';
        this.complexForm = fb.group({
            'username': [null, forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.minLength(3), forms_1.Validators.maxLength(50)])],
            'email': [null, forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.pattern((emailRegex))])],
            'password': [null, forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.minLength(3), forms_1.Validators.maxLength(50)])],
            'passwordConfirmation': [null, forms_1.Validators.required]
        });
    }
    RegistrationComponent.prototype.submitForm = function (value) {
        var _this = this;
        var user = new User_1.User('', value.username, value.email, value.password, 0, 0);
        this.userService
            .create(user)
            .then(function (r) {
            if (r.error) {
                _this.complexForm.controls['username'].setErrors({ 'server': 'Username already taken' });
            }
            else {
                _this.router.navigate(['/login']);
            }
        });
    };
    RegistrationComponent.prototype.goBack = function () {
        this.router.navigate(['/']);
    };
    return RegistrationComponent;
}());
RegistrationComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'registration',
        templateUrl: 'registration.component.html',
        styleUrls: ['registration.component.css']
    }),
    __metadata("design:paramtypes", [forms_1.FormBuilder, router_1.Router, user_service_1.UserService])
], RegistrationComponent);
exports.RegistrationComponent = RegistrationComponent;
//# sourceMappingURL=registration.component.js.map