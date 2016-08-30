/*global GAME */

(function(g) {


    g.Entity = function(opt){



        if(!opt){
            opt = {
                radius: 10,
                gravity: 0,
                type: 'generic',
                frictX: 0.92,
                frictY: 0.94

            }
        }
        this.type = opt.type;
        this.cx = 0;
        this.cy = 0;
        this.xr = 0;
        this.yr = 0;

        this.xx = 0;
        this.yy = 0;

        this.dx = 0;
        this.dy = 0;

        this.ddx = 0; //difference between last frame and this frame
        this.ddy = 0;

        this.ox = 0; //previous frame x
        this.oy = 0; //previous frame y -

        this.radius = opt.radius || 10;
        this.gravity = opt.gravity || 0;

        this.frictX = opt.frictX || 0.92;
        this.frictY = opt.frictY || 0.94;
        this.dead = false;
        this.collides = opt.collides || 0;

        this.id = Math.random();

    };


    g.Entity.prototype.die = function() {
        this.dead = true;
        GAME.ALL.splice(GAME.ALL.indexOf(this), 1);
    }

    g.Entity.prototype.setCoords = function(x,y) {
        this.xx = x;
        this.yy = y;
        this.cx = Math.floor(this.xx/GAME.const.GRID);
        this.cy = Math.floor(this.yy/GAME.const.GRID);
        this.xr = (this.xx - this.cx*GAME.const.GRID) / GAME.const.GRID;
        this.yr = (this.yy - this.cy*GAME.const.GRID) / GAME.const.GRID;
    };

    g.Entity.prototype.hasCollision = function(cx, cy) {
        if(this.collides){
            if( (this.cx<1 && this.xr < .5) || cx >= GAME.const.WIDTH)
                return true;
            else if(this.cy<1 && this.yr < .5 || cy>=GAME.const.HEIGHT ){
                return true;
            }
            else if( (GAME.Assets.map[cy]) == undefined  || GAME.Assets.map[cy][cx] == undefined ) {
                return true;
            }
            else return GAME.Assets.map[cy][cx]; //eventually return map coordinates.
        }

    };

    g.Entity.prototype.overlaps = function(e) { //e is another g.Entity
        var maxDist = this.radius + e.radius;
        var distSqr = (e.xx - this.xx)*(e.xx-this.xx) + (e.yy - this.yy)*(e.yy-this.yy);
        if(distSqr <= maxDist*maxDist )
            return true;
        else
            return false;
    };

    g.Entity.prototype.onGround = function() {
        return this.hasCollision(this.cx, this.cy+1) && this.yr>=0.5;
    };

    g.Entity.prototype.onCeiling = function() {
        return this.hasCollision(this.cx, this.cy-1) && this.yr<=0.5;
    };

    g.Entity.prototype.onWallLeft = function() {
        return this.hasCollision(this.cx-1, this.cy) && this.xr<=0.5;
    }
    g.Entity.prototype.onWallRight = function() {
        return this.hasCollision(this.cx+1, this.cy) && this.xr>=0.5;
    }

    g.Entity.prototype.update = function() {

        //console.log(this.type);

        if(this.dead == false){


            var gravity = this.gravity;

            //map collison

            //X component
            this.xr += this.dx;
            this.dx *= this.frictX;
            if( this.hasCollision(this.cx-1, this.cy) && this.xr <= 0.3 ) { // if there's something to the left AND we're near the left edge of the current cell
                this.dx = 0;
                this.xr = 0.3;
            }
            if( this.hasCollision(this.cx+1, this.cy) && this.xr >= 0.7 ) { // ditto right
                this.dx = 0;
                this.xr = 0.7;
            }
            while(this.xr < 0) { //update the cell and fractional movement
                this.cx--;
                this.xr++;
            }
            while(this.xr > 1) { //update the cell and fractional movement
                this.cx++;
                this.xr--;
            }

            //Y component
            this.dy += gravity;
            this.yr += this.dy;
            this.dy *= this.frictY;

            if( this.hasCollision(this.cx, this.cy-1) && this.yr <= 0.4 ) { // if there's something above...
                this.dy = 0;
                this.yr = 0.4;
            }
            if( this.hasCollision(this.cx, this.cy+1) && this.yr >= 0.7 ) { // ditto below
                this.dy = 0;
                this.yr = 0.7;
            }
            while(this.yr < 0) { //update the cell and fractional movement up
                this.cy--;
                this.yr++;
            }
            while(this.yr > 1) { //update the cell and fractional movement down
                this.cy++;
                this.yr--;
            }

            //object collision handling--------------------

            for(var i = 0; i < GAME.ALL.length; i++) {
                //console.log('in collision check loop');
                var e = GAME.ALL[i].body;
                if(e.dead == false){
                    if(e.collides){
                        //broad phase collision detection
                        if(e != this && Math.abs(this.cx-e.cx) <= 1 && Math.abs(this.cy-e.cy) <= 1 ){

                            //if the cells are close enough, then we break out the actual distance check
                            var dist = Math.sqrt( (e.xx-this.xx) * (e.xx-this.xx) + (e.yy-this.yy)*(e.yy-this.yy) );
                            if(dist <= this.radius + e.radius) {
                                //console.log('collision resolution!')
                                var ang = Math.atan2(e.yy-this.yy, e.xx-this.xx);
                                var force = 0.03;
                                var repelPower = (this.radius + e.radius - dist) / (this.radius + e.radius);
                                this.dx -= Math.cos(ang) * repelPower * force;
                                this.dy -= Math.sin(ang) * repelPower * force;
                                e.dx += Math.cos(ang) * repelPower * force;
                                e.dy += Math.sin(ang) * repelPower * force;
                            }

                        }
                    }

                }

            }
            //----------------------------------------------

            //update actual pixel coordinates:

            this.xx = Math.floor((this.cx + this.xr)*GAME.const.GRID);
            this.yy = Math.floor((this.cy + this.yr)*GAME.const.GRID);
            this.ddx = (this.cx + this.xr)*GAME.const.GRID - this.ox;
            this.ddy = (this.cy + this.yr)*GAME.const.GRID - this.oy;
            this.ox = (this.cx + this.xr)*GAME.const.GRID;
            this.oy = (this.cy + this.yr)*GAME.const.GRID;


        }


    };

    return g


}(GAME));