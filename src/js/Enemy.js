function Enemy() {
    this.inUse = false;

    this.init = function () {

        this.body = new Entity({
            dead: true,

            gravity: 0,

        });
        this.body.setCoords(-1000, -1000);
    };

    Enemy.prototype.spawn = function (opt) {
        this.inUse = true;
        this.body.radius = Math.floor(rnd(3,9));

        this.body.dead = false;
        this.dead = false;
        this.body.mapcollide = true;
        this.onFire = false;
        this.fireSpeed = 0;
        this.bump = 0;

        this.body.gravity = .06;
        this.movingLeft = Math.random() > .5;
        this.stridetick = 0;
        this.antennae = Math.random() > 0.5;

        this.fill = "#3" + rndTxt('4567789abcd', 1) + "0", //random shade of green

        this.stroke = "#3" + rndTxt('4567789abcd', 1) + rndTxt('123', 1), //random shade of green

        this.angryFill = "#" +  rndTxt('4567789abcd', 1) + "00", //random shade of red

        this.angryStroke = "#" + rndTxt('4567789abcd', 1) + "00", //random shade of red

            this.body.setCoords(opt.x, opt.y);

    };

    Enemy.prototype.use = function (step) {

        if(this.dead){
            Asplode('enemy', this.body);
            Asplode('smoke', this.body);


            playSound(sounds.boom, rnd(.98, 1.05), norm(this.body.xx, 0, Const.GAMEWIDTH), false);

            return true;

        } else {

            this.render(ctxfg);
            this.update(step);
            this.body.update(step);

            return false;
        }

    }


    Enemy.prototype.update = function (step) {

        if(this.bump > 0)this.bump -= .01;
        Const.GLITCH.ych = this.bump;

        if(this.onFire){

            particlePool.get({
                x: this.body.xx + this.body.radius - (Math.random() * this.body.radius * 2 ),
                y: this.body.yy - this.body.radius - 2,
                mapcollide: true,
                gravity: -.04,
                //dy: -this.body.dy,
                //dx: //-this.body.dx * 0.5,
                radius: 4,
                color: "#a00",
                life:.4
            });

        } else {
            particlePool.get({
                x: this.body.xx + this.body.radius - (Math.random() * this.body.radius * 2 ),
                y: this.body.yy - this.body.radius - 2,
                mapcollide: true,
                gravity: -.03,
                //dy: -this.body.dy,
                //dx: //-this.body.dx * 0.5,
                radius: 2,
                color: "#080",
                life:.4
            });
        }



        //console.log(this.body);
        this.stridetick += .3;
        this.stride = Math.sin(this.stridetick) * 2;
        this.stride2 = Math.sin(this.stridetick - .8) * 1.3;
        this.fireSpeed = this.onFire ? 2 : 1;

        //patrol logic ----------------
        if (this.movingLeft) {
            this.body.dx -= Const.E_SPEED * this.fireSpeed * step;
        }
        else this.body.dx += Const.E_SPEED * this.fireSpeed * step;

        if (this.body.onWallLeft()) {
            this.movingLeft = false;
        }
        if (this.body.onWallRight()) {
            this.movingLeft = true;
        }
        if (this.body.collided) {
            this.movingLeft = !this.movingLeft;
            this.body.collided = false;
        }

        //world wrap + anger stuff? crate-box style
        if (this.body.yy > Const.GAMEHEIGHT && !this.dead) {
            this.body.setCoords(Const.GAMEWIDTH/2, -5);
            this.bump = .9;
            this.onFire = true;
        }


    },

        /*
         * Resets the object values to default
         */
        Enemy.prototype.clear = function () {
            this.inUse = false;
            this.body.xx = -1000;
            this.body.xx = -1000;
            this.body.dead = true;
            this.body.collides = false;
            this.body.mapcollide = false;
            this.onFire = false;
            this.bump = 0;
        };


    Enemy.prototype.render = function (ctx) {

        ctx.fillStyle = this.onFire ? this.angryFill : this.fill;
        ctx.strokeStyle = this.onFire ? this.angryStroke : this.fill;
        ctx.save();
        ctx.translate(0.5, -3.5); // for crispy stroke rendering, and pulling them out of the floor

        ctx.fillRect(
            this.body.xx - this.body.radius,
            this.body.yy - this.body.radius - this.stride,
            (this.body.radius * 2),
            (this.body.radius * 2) + this.stride);
        ctx.strokeRect(
            this.body.xx - this.body.radius,
            this.body.yy - this.body.radius - this.stride,
            this.body.radius * 2,
            this.body.radius * 2) + this.stride;

        ctx.restore();//post stroke, put back the .5 translation so future rendering isnt on subpixels

        ctx.fillStyle = "#FFF";  //eyes
        ctx.fillRect(
            this.body.xx - 2,
            this.body.yy - 4 - this.stride2,
            this.onFire ? 2 : 1, 2);
        ctx.fillRect(
            this.body.xx + 2,
            this.body.yy - 4 - this.stride2,
            this.onFire ? 2 : 1, 2);
        ctx.fillStyle = "#Fa0";

        if (this.antennae) {
            ctx.fillRect(
                this.body.xx - 3,
                this.body.yy - 11 - this.stride2,
                1,
                5);
            ctx.fillRect(
                this.body.xx + 3,
                this.body.yy - 11 - this.stride2,
                1,
                5);
        }
        //debug render---------------
        //ctx.save();
        //ctx.lineWidth = '1px';
        //ctx.strokeStyle = '#f0f';
        //ctx.beginPath();
        //ctx.arc(this.body.xx, this.body.yy, this.body.radius, 0, 2 * Math.PI, false);
        //ctx.stroke();
        //ctx.restore();

    }


};
