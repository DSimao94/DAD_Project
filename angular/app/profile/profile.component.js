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
var ng2_file_upload_1 = require("ng2-file-upload");
var ProfileComponent = (function () {
    function ProfileComponent(fb, router, userService) {
        this.router = router;
        this.userService = userService;
        this.uploader = new ng2_file_upload_1.FileUploader({ url: 'http://localhost:8080/upload' });
        this.complexForm = fb.group({
            'image': [null, forms_1.Validators.required]
        });
    }
    ProfileComponent.prototype.ngOnInit = function () {
    };
    ProfileComponent.prototype.saveNewImage = function () {
        // TODO
        this.goLobby();
    };
    ProfileComponent.prototype.logOut = function () {
        var _this = this;
        this.userService
            .logOut()
            .then(function () { return _this.router.navigate(['/']); });
    };
    ProfileComponent.prototype.getAuthUser = function () {
        return JSON.parse(localStorage.getItem('user'));
    };
    ProfileComponent.prototype.goProfile = function () {
        this.router.navigate(['/profile']);
    };
    ProfileComponent.prototype.goLobby = function () {
        this.router.navigate(['/home']);
    };
    return ProfileComponent;
}());
ProfileComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'profile.component.html',
        styleUrls: ['profile.component.css']
    }),
    __metadata("design:paramtypes", [forms_1.FormBuilder, router_1.Router, user_service_1.UserService])
], ProfileComponent);
exports.ProfileComponent = ProfileComponent;
//# sourceMappingURL=profile.component.js.map