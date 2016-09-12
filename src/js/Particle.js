function Particle() {
    this.inUse = false; // Is true if the object is currently in use
    /*
     * Sets an object not in use to default values
     */
    this.init = function () {
        this.body = new Entity({
            dead: true,
            gravity: 0,
        });
        this.body.setCoords(-1000, -1000);

    };


    Particle.prototype.spawn = function (opt) {
        /*code to set values if any*/
        //console.log('particle spawned');
        this.inUse = true;
        this.type = opt.type;
        this.text = opt.text;
        this.ctx = opt.ctx;

        this.life = opt.life || 1;
        this.remaining = opt.life || 1;
        this.body.radius = opt.radius || 1;
        this.body.collides = opt.collides || false;
        this.body.mapcollide = opt.mapcollide || false;


        this.color = opt.color || '#fff';
        this.asplode = opt.asplode;
        this.body.dead = false;
        this.dead = false;

        this.body.setCoords(opt.x, opt.y);
        this.body.dx = opt.dx || 0;
        this.body.dy = opt.dy || 0;
        this.body.gravity = opt.gravity || 0;
        this.body.type = opt.type || 'particle';


    }
    /*
     * Use the object. Return true if the object is ready to be
     * cleared (such as a bullet going of the screen or hitting
     * an enemy), otherwise return false.
     */
    Particle.prototype.use = function (step) {
        if (this.dead) {
            Asplode('default', this.body);
            Asplode('smoke', this.body);
            return true;
        } else {
            //watch.remaining = this.remaining + ' particle: ' + this.body.id ;
            this.remaining -= step;
            if (this.remaining <= 0) {
                this.dead = true;
                return true;
            }

            this.render(ctxfg);
            this.body.dx += Math.random() * Const.GLITCH.xch - Const.GLITCH.xch/2;
            this.body.dy += Math.random() * Const.GLITCH.xch - Const.GLITCH.xch/2;
            this.body.update();


            return false;

        }
    };
    /*
     * Resets the object values to default
     */
    Particle.prototype.clear = function () {
        this.inUse = false;
        this.body.xx = -1000;
        this.body.xx = -1000;
        this.body.dead = true;
        this.body.collides = false;
        this.body.mapcollide = false;
    };


    Particle.prototype.render = function (ctx) {
        var b = this.body;
        if(this.ctx) ctx = this.ctx;
        switch(this.type) {

            case 'glitch':
                ctx.save();
                if(!isFirefox)ctx.globalCompositeOperation = 'screen';
                ctx.fillStyle = '#' + rndTxt('5678890ABCDE',3);
                ctx.strokeStyle = this.stroke;
                var rad = this.body.radius * (this.remaining / this.life);
                ctx.fillRect(
                    b.xx, b.yy - rad, rad * 2, rad * 2
                );
                ctx.restore();
                break;

            case 'text':
                ctx.fillStyle = this.color;
                Txt.text({
                    ctx: ctxui,
                    x: b.xx,
                    y: b.yy,
                    text: "o",
                    hspacing: 2,
                    vspacing: 5,
                    halign: 'center',
                    valign: 'top',
                    scale: 1,
                    snap: 1,
                    render: 1,
                });
                break;

            case 'smoke':
                var alpha = this.remaining / this.life;

                ctx.fillStyle = 'rgba(200,200,200,' + alpha + ')';
                ctx.fillRect(
                    b.xx-this.body.radius, b.yy-this.body.radius, this.body.radius * 2, this.body.radius * 2
                );

                break;

            default:
                ctx.save();
                if(!isFirefox)ctx.globalCompositeOperation = 'screen';
                ctx.fillStyle = this.color || '#fff'
                ctx.strokeStyle = this.stroke;
                var rad = this.body.radius * (this.remaining / this.life);
                ctx.fillRect(
                    b.xx, b.yy - rad, rad * 2, rad * 2
                );
                ctx.globalCompositeOperation = 'source-over';

                ctx.restore();
                break;





        }

    };

}


//---------stashing this here, particle related

function Asplode(type, B) {

            switch(type) {

                default:
                    var p = 20;
                    while(p--){
                        particlePool.get({

                            x: B.xx || 100,
                            y: B.yy || 100,
                            mapcollide: false,

                            dy: Math.random() * 2 - 1,
                            dx: Math.random() * 2 - 1,
                            radius: 3,
                            color: "#e80",
                            life: .25
                        });
                    }
                    break;

                case 'enemy':

                var p = 10;
                    while(p--){
                        particlePool.get({

                            x: B.xx || 100,
                            y: B.yy || 100,
                            mapcollide: false,
                            gravity: .03,

                            dy: Math.random() * 2 - 1,
                            dx: Math.random() * 2 - 1,
                            radius: 3,
                            color: "#800",
                            life: .2
                        });
                    }
                break;

                case 'smoke':
                    var p = 10;
                    while(p--){
                        particlePool.get({

                            x: B.xx + Math.random() * 6 - 3 || 100,
                            y: B.yy + Math.random() * 6 - 3 || 100,
                            mapcollide: false,
                            type: 'smoke',
                            gravity: -.003,
                            dy: Math.random() * -.1,
                            dx: Math.random() * .1 - .05,
                            radius: 5,
                            life:.75,

                        });
                    }
                    break;
            }

}