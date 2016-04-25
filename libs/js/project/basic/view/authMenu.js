
new eHtml('auth-login', '<h1>Account SignIn</h1>\
<input type="email" placeholder="e-mail">\
<input type="password" placeholder="password">\
<div class="conditions-checkbox checked"><span>remember password</span></div>\
<a href="" class="noHref button">\
    <div class="all-news big-button"><span>SignIn</span></div>\
</a>\
<a href="" class="noHref blue">forgot password</a>\
<a href="" class="noHref button">\
    <div class="all-news big-button"><span>SignUp</span></div>\
</a>', {
    h1: 'title',
    input: 'email,password',
    a: 'signin,forgot,signup',
    span: 'sremember,ssignin,ssignup'
});

new eHtml('auth-register', '<h1>Account SignUp</h1>\
<input type="email" placeholder="e-mail">\
<input type="text" placeholder="Fullname">\
<input type="password" placeholder="password">\
<input type="password" placeholder="repeat password">\
<a href="" class="noHref button">\
    <div class="all-news big-button"><span>SignUp</span></div>\
</a>\
<a href="" class="noHref button">\
    <div class="all-news big-button"><span>SignIn</span></div>\
</a>\
<div class="progress">\
    <div class="active"></div>\
    <div></div>\
    <div></div>\
</div>', {
    h1: 'title',
    input: 'email,name,password,pwd2',
    a: 'signup,signin',
    span: 'ssignup,ssignin'
});


new eView('auth-login', {
    create: function() { return HTML['auth-login'](cr('div')); },
    init: function(self, obj) {
        map(parseLS('title,forgot,sremember,ssignin,ssignup'), function(key) {
            self.V[key].val = PAGE.ld(self.V[key].val);
        });
        
        self.V.password.attr({placeholder:PAGE.ld(self.V.password.attr('placeholder'))});
        
        if ( glob('email') ) {
            self.V.email.val = glob('email');
        }
        
        self.F.signin = function() {
            if ( VALIDATOR.email(self.V.email) && VALIDATOR.notEmpty(self.V.password) ) {
                ENGINE._auth.login({
                    email   : self.V.email.val,
                    password: self.V.password.val
                }, null, function(sd) {
                    if ( sd.field == 'password' ) {
                        self.V.password.remCls('isValid');
                        self.V.password.addCls('notValid');
                    }
                });
            }
            return false;
        }
        
        evt(self.V.email,    'keyup', function(ev) { if ( ev.keyCode == 13 ) { self.F.signin(); } });
        evt(self.V.password, 'keyup', function(ev) { if ( ev.keyCode == 13 ) { self.F.signin(); } });
        clearEvents(self.V.signin).onclick = self.F.signin;
        
        clearEvents(self.V.signup).onclick = function() {
            POP.modal.show('auth-register');
            return false;
        };
    }
});

new eView('auth-register', {
    create: function() { return HTML['auth-register'](cr('div')); },
    init: function(self, obj) {
        map(parseLS('title,ssignin,ssignup'), function(key) {
            self.V[key].val = PAGE.ld(self.V[key].val);
        });
        self.V.name.attr({placeholder:PAGE.ld(self.V.name.attr('placeholder'))});
        self.V.password.attr({placeholder:PAGE.ld(self.V.password.attr('placeholder'))});
        self.V.pwd2.attr({placeholder:PAGE.ld(self.V.pwd2.attr('placeholder'))});
        
        self.F.signup = function() {
            if ( VALIDATOR.email(self.V.email) && VALIDATOR.pwdMatch(self.V.password, self.V.pwd2) ) {
                
                var nameMap = self.V.name.val.split(/\s+/g);
                
                ENGINE._auth.register({
                    email     : self.V.email.val,
                    first_name: nameMap.splice(0,1)[0],
                    last_name : nameMap.join(' '),
                    password  : self.V.password.val
                }, null, function(sd) {});
            }
            return false;
        }
        
        evt(self.V.pwd2, 'keyup', function(ev) { if ( ev.keyCode == 13 ) { self.F.signup(); } });
        clearEvents(self.V.signup).onclick = self.F.signup;
        
        clearEvents(self.V.signin).onclick = function() {
            POP.modal.show('auth-login');
            return false;
        };
    }
});









new eHtml('loginMenu','\
    <p>email</p><input type="text" />\
    <p>pwd</p><input type="password" />\
    <p></p><input type="submit" />',{
    p: 'lemail,lpwd,lsubmit',
    input: 'email,pwd,submit'
});



new eView('loginMenu', {
    create: function() { return HTML.loginMenu(cr('div','loginMenu')); },
    init: function(self) {
        self.V.email.val = glob('email') || '';
        
        self.F.sbm = function() {
            if ( VALIDATOR.email(self.V.email) ) {
                ENGINE._auth.login({
                    email : self.V.email.val,
                    pwd   : self.V.pwd.val
                    
                }, null, function() {
                    self.V.email.remCls('isValid');
                    self.V.email.addCls('notValid');
                });
            }
        }
        
        self.V.email.onkeyup = self.V.pwd.onkeyup = function(ev) {
            if ( ev.keyCode == 13 ) {
                self.F.sbm();
            }
        }
        self.V.submit.onclick = self.F.sbm;
    }
});

















