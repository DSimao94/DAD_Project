"use strict";
class Authentication {
    constructor() {
        this.login = (request, response, next) => {
            let user = request.user;
            delete user.passwordHash;
            response.json(user);
            return next();
        };
        this.logout = (request, response, next) => {
            request.logOut();
            response.json({ msg: 'Logout' });
            return next();
        };
        this.init = (server, settings) => {
            server.post(settings.prefix + 'login', settings.security.passport.authenticate('local', { 'session': false }), this.login);
            server.post(settings.prefix + 'logout', settings.security.authorize, this.logout);
            server.get('auth/facebook', settings.security.passport.authenticate('facebook', {
                session: false,
                scope: ['email']
            }));
            server.get('auth/facebook/callback', settings.security.passport.authenticate('facebook', {
                session: false,
                failureRedirect: '/login'
            }), function (req, res, next) {
                let d = new Date();
                d.setTime(d.getTime() + (3 * 24 * 60 * 60 * 1000));
                let expires = "expires=" + d.toUTCString();
                res.setHeader('Set-Cookie', 'token=' + req.user.token + '#' + req.user._id + ';' + expires + ';Path=/');
                res.setHeader('location', '/#/home');
                res.send(302);
                next();
            });
            server.get('auth/github', settings.security.passport.authenticate('github', {
                session: false,
                scope: ['email']
            }));
            server.get('auth/github/callback', settings.security.passport.authenticate('github', {
                session: false,
                failureRedirect: '/login'
            }), function (req, res, next) {
                let d = new Date();
                d.setTime(d.getTime() + (3 * 24 * 60 * 60 * 1000));
                let expires = "expires=" + d.toUTCString();
                res.setHeader('Set-Cookie', 'token=' + req.user.token + '#' + req.user._id + ';' + expires + ';Path=/');
                res.setHeader('location', '/#/home');
                res.send(302);
                next();
            });
            server.get('auth/google', settings.security.passport.authenticate('google', {
                session: false,
                scope: ['email']
            }));
            server.get('auth/google/callback', settings.security.passport.authenticate('google', {
                session: false,
                failureRedirect: '/login'
            }), function (req, res, next) {
                let d = new Date();
                d.setTime(d.getTime() + (3 * 24 * 60 * 60 * 1000));
                let expires = "expires=" + d.toUTCString();
                res.setHeader('Set-Cookie', 'token=' + req.user.token + '#' + req.user._id + ';' + expires + ';Path=/');
                res.setHeader('location', '/#/home');
                res.send(302);
                next();
            });
            console.log('Authentication routes registered');
        };
    }
}
exports.Authentication = Authentication;
