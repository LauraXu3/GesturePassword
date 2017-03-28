(function () {
        window.GesturePwd = function (container) {
            this.width = container.offsetWidth;
            this.height = container.offsetHeight;
            this.container = container;
            this.setOrVer=0;

        }
        GesturePwd.prototype.createCircle = function () {
            var count = 0;
            this.r = this.width / (2 + 4 * 3);
            this.inputPoint = [];
            this.arr = [];
            this.restPoint = [];
            var r = this.r;

            for(var i=0;i<3;i++) {
                for(var j=0;j<3;j++) {
                    count ++;
                    var obj = {
                        x: j * 4 * r + 3 * r,
                        y: i * 4 * r + 3 * r,
                        index: count
                    }
                    this.arr.push(obj);
                    this.restPoint.push(obj);
                }
            }
            this.ctx.clearRect(0, 0, this.width, this.height);
            for(var i=0;i < this.arr.length; i++) {
                this.drawCircle(this.arr[i].x,this.arr[i].y)
            }

        }
        GesturePwd.prototype.getPosition = function (e) {
            var rect = e.currentTarget.getBoundingClientRect();
            var po = {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top
            }
            return po;
        }
        GesturePwd.prototype.drawCircle = function (x,y,isInput) {
            this.ctx.beginPath();
            this.ctx.lineWidth = 2;
            if(isInput){
                this.ctx.lineWidth = 5;
                this.ctx.strokeStyle = '#F18904';
                this.ctx.fillStyle = '#BDA589';
            }else {
                this.ctx.strokeStyle = 'white';
                this.ctx.fillStyle = 'transparent';
            }
            this.ctx.arc(x, y, this.r, 0, Math.PI * 2,true);
            this.ctx.closePath();
            this.ctx.stroke();
            if(isInput){
                this.ctx.fill();
            }

        }

        GesturePwd.prototype.update = function (position) {
            for(var i=0;i<this.restPoint.length;i++){
                if(Math.abs(position.x - this.restPoint[i].x) < this.r
                    && Math.abs(position.y - this.restPoint[i].y) < this.r){
                    this.inputPoint.push(this.restPoint[i]);
                    this.restPoint.splice(i, 1);
                    this.ctx.clearRect(0,0,this.width,this.height);
                    for(var i=0;i<this.inputPoint.length;i++){
                        this.drawCircle(this.inputPoint[i].x,this.inputPoint[i].y,1);
                    }
                    for(var i=0;i<this.restPoint.length;i++) {
                        this.drawCircle(this.restPoint[i].x,this.restPoint[i].y,0);
                    }
                    this.drawLine();
                }
            };
        };

        GesturePwd.prototype.drawLine = function () {
            this.ctx.beginPath();
            this.ctx.lineWidth = 3;
            this.ctx.strokeStyle = '#F05837';
            this.ctx.moveTo(this.inputPoint[0].x, this.inputPoint[0].y);
            for (var i = 1 ; i < this.inputPoint.length ; i++) {
                this.ctx.lineTo(this.inputPoint[i].x, this.inputPoint[i].y);
            }
            this.ctx.stroke();
            this.ctx.closePath();
        };
        GesturePwd.prototype.initDom = function () {
            var html = '<div style="position:relative;'
                    +'width:'+this.width + 'px;height:'+this.height+'px">'
                    +'<div style="background-color: rgba(7, 17, 27, 0.6);position:absolute;left:0;right:0;filter:blur(25px);z-index:-1;'
                    +'width:'+this.width + 'px;height:'+this.height+'px"></div>'
                    +'<canvas id="canvas" style="position:relative;z-index:22"'
                    +' width='+this.width + ' height='+this.width+'></canvas>'
                    +'<div class="text" style="margin-top:5px;text-align:center;font-size: 35px;height:40px;color:white"></div>'
                    +'<div class="button" style="margin-top:30px;text-align:center;font-size: 40px;color:white;letter-spacing: 5px"><label style="display: block"><input type="radio" name="password" style="vertical-align: middle">设置密码</label>'
                    +'<label style="display: block"><input type="radio" name="password" checked="true" style="vertical-align: middle">验证密码</label></div></div>';
            this.container.innerHTML = html;
        };

        GesturePwd.prototype.storePwd = function () {
            localStorage.setItem('GesturePwd',JSON.stringify(this.inputPoint));
        };
        GesturePwd.prototype.verifyPwd = function (inputPwd) {
            var pwd = localStorage.getItem('GesturePwd');
            pwd || (this.text.innerHTML='请先设置密码');
            pwd=JSON.parse(pwd);
            if(pwd.length != inputPwd.length) {
                return false;
            }
            for(var i=0;i<inputPwd.length;i++){
                if(pwd[i].index != inputPwd[i].index){
                   return false;
                }
            }
            return true;
        };
        GesturePwd.prototype.toustError = function (str1,str2) {
            this.text.innerHTML = str1;
            var self = this;
            setTimeout(function () {
                self.createCircle();
                self.text.innerHTML = str2;
                self.firstPass = null;
            },1500);
        };
        GesturePwd.prototype.bindEvent = function () {
            var self = this;
            var button = document.getElementsByClassName('button')[0].getElementsByTagName('input');
            for(var i=0;i<button.length;i++){
                button[i].onchange = function (e) {
                    button[0].checked ? (self.setOrVer = 1) : (self.setOrVer = 0);
                    self.createCircle();
                }
            }
            this.canvas.addEventListener('touchstart', function (e) {
                e.preventDefault();
                var position = self.getPosition(e);
                for(var i=0; i < self.arr.length;i++) {

                    if ((Math.abs(position.x - self.arr[i].x)<self.r)
                        &&(Math.abs(position.y - self.arr[i].y)<self.r)) {
                        self.touchFlag = true;
                        self.inputPoint.push(self.arr[i]);
                        self.restPoint.splice(i, 1);
                        console.log(self.inputPoint);
                        break;
                    }
                }
            });
            this.canvas.addEventListener("touchmove",function(e){
                if(self.touchFlag) {
                    self.update(self.getPosition(e));
                }
            });
            this.canvas.addEventListener("touchend",function(e){
                if(self.touchFlag) {
                    self.touchFlag = false;
                }
                if(self.setOrVer) {
                    if(!self.firstPass){
                        self.firstPass = [];
                        if(self.inputPoint.length < 5){
                            self.toustError('密码太短，至少需要5个点','请输入密码');
                            return
                        }
                        for(var i=0;i<self.inputPoint.length;i++) {
                            self.firstPass[i] = self.inputPoint[i];
                        }
                        self.text.innerHTML = '请再次输入手势密码';
                        self.createCircle();

                    }else {
                        if(self.firstPass.length != self.inputPoint.length) {
                            self.toustError('两次输入不一致','请重新设置密码');
                            return
                        }
                        for(var i=0;i<self.inputPoint.length;i++){
                            if(self.firstPass[i].index != self.inputPoint[i].index){
                                self.toustError('两次输入不一致','请重新设置密码');
                                break;
                            }
                        }
                        if(i == self.inputPoint.length){
                            self.text.innerHTML = '设置密码成功';
                            self.firstPass = null;
                            self.storePwd();
                        }

                    }
                }else{
                    if(self.verifyPwd(self.inputPoint)){
                        self.text.innerHTML = '密码正确!';
                    }else {
                        self.toustError('密码错误','请输入密码')
                    }

                }

            })
        };
         GesturePwd.prototype.init = function () {
                this.initDom();
                this.canvas = document.getElementById('canvas');
                this.width = this.canvas.width;
                this.height = this.canvas.height;
                this.ctx = this.canvas.getContext('2d');
                this.text = document.getElementsByClassName('text')[0];
                this.createCircle();
                this.bindEvent();
            };
    })();