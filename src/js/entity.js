/*global
* Const*/




    Entity = function(opt){
        var that = this;



        if(!opt){
            opt = {
                radius: 10,
                gravity: 0,
                type: 'generic',
                frictX: 0.92,
                frictY: 0.94

            }
        }
        that.type = opt.type;
        that.cx = 0;
        that.cy = 0;
        that.xr = 0;
        that.yr = 0;

        that.xx = 0;
        that.yy = 0;

        that.dx = 0;
        that.dy = 0;


        that.collided = false;
        that.ox = 0; //previous frame x
        that.oy = 0; //previous frame y -

        that.radius = opt.radius || 10;
        that.gravity = opt.gravity || 0;
        that.bounce = opt.bounce || 0;

        that.frictX = opt.frictX || 0.92;
        that.frictY = opt.frictY || 0.94;
        that.dead = false;
        that.collides = opt.collides || 0;
        that.mapcollide = opt.mapcollide || 0;

        that.id = Math.random();

    };


    Entity.prototype.die = function() {
        var that = this;

        that.dead = true;
        delete ALL.indexOf(that);
    };

    Entity.prototype.setCoords = function(x,y) {
        var that = this;

        that.xx = x;
        that.yy = y;
        that.cx = Math.floor(that.xx/Const.GRID);
        that.cy = Math.floor(that.yy/Const.GRID);
        that.xr = (that.xx - that.cx*Const.GRID) / Const.GRID;
        that.yr = (that.yy - that.cy*Const.GRID) / Const.GRID;
    };

    Entity.prototype.hasCollision = function(cx, cy) {
        var that = this;

        if(that.mapcollide){
            //if( (that.cx<1 && that.xr < .5) || cx >= Const.WIDTH)
            //    return true;
            //else if(that.cy<1 && that.yr < .5 || cy>=Const.HEIGHT ){
            //    return true;
            //}
            if( (Assets.map[cy]) == undefined  || Assets.map[cy][cx] == undefined ) {
                return false;
            }
            else return Assets.map[cy][cx] || false; //eventually return map coordinates.
        }

    };

    Entity.prototype.overlaps = function(e) { //e is another Entity
        var that = this;

        var maxDist = that.radius + e.radius;
        var distSqr = (e.xx - that.xx)*(e.xx-that.xx) + (e.yy - that.yy)*(e.yy-that.yy);
        if(distSqr <= maxDist*maxDist )
            return true;
        else
            return false;
    };

    Entity.prototype.onGround = function() {
        var that = this;

        return that.hasCollision(that.cx, that.cy+1) && that.yr>=0.5;
    };

    Entity.prototype.onCeiling = function() {
        var that = this;

        return that.hasCollision(that.cx, that.cy-1) && that.yr<=0.5;
    };

    Entity.prototype.onWallLeft = function() {
        var that = this;

        return that.hasCollision(that.cx-1, that.cy) && that.xr<=0.5;
    };
    Entity.prototype.onWallRight = function() {
        var that = this;

        return that.hasCollision(that.cx+1, that.cy) && that.xr>=0.5;
    };

    Entity.prototype.update = function(pool) {
        var that = this;

        //if(this.type == 'particle')console.log('particle entity update');


        //console.log(that.type);

        if(that.dead == false){


            var gravity = that.gravity;

            //map collison

            //X component
            that.xr += that.dx;
            that.dx *= that.frictX;
            if( that.hasCollision(that.cx-1, that.cy) && that.xr <= 0.3 ) { // if there's something to the left AND we're near the left edge of the current cell
                that.dx = 0;
                that.xr = 0.3;
            }
            if( that.hasCollision(that.cx+1, that.cy) && that.xr >= 0.7 ) { // ditto right
                that.dx = 0;
                that.xr = 0.7;
            }
            while(that.xr < 0) { //update the cell and fractional movement
                that.cx--;
                that.xr++;
            }
            while(that.xr > 1) { //update the cell and fractional movement
                that.cx++;
                that.xr--;
            }

            //Y component
            that.dy += gravity;
            that.yr += that.dy;
            that.dy *= that.frictY;

            if( that.hasCollision(that.cx, that.cy-1) && that.yr <= 0.4 ) { // if there's something above...
                that.dy = 0;
                that.yr = 0.4;
            }
            if( that.hasCollision(that.cx, that.cy+1) && that.yr >= 0.7 ) { // ditto below
                that.dy = that.bounce ? -that.dy : 0;
                if(!that.bounce) that.yr = 0.7;
            }
            while(that.yr < 0) { //update the cell and fractional movement up
                that.cy--;
                that.yr++;
            }
            while(that.yr > 1) { //update the cell and fractional movement down
                that.cy++;
                that.yr--;
            }

            //object collision handling--------------------

            for(var i = 0; i < pool.length; i++) {
                //console.log('in collision check loop');
                var e = pool[i].body;
                if(e.dead == false){
                    if(e.collides && this.collides){
                        //broad phase collision detection
                        if(e != that && Math.abs(that.cx-e.cx) <= 1 && Math.abs(that.cy-e.cy) <= 1 ){

                            //if the cells are close enough, then we break out the actual distance check
                            var dist = Math.sqrt( (e.xx-that.xx) * (e.xx-that.xx) + (e.yy-that.yy)*(e.yy-that.yy) );
                            if(dist <= that.radius + e.radius) {
                                //console.log('collision resolution!')
                                that.collided = true;
                                var ang = Math.atan2(e.yy-that.yy, e.xx-that.xx);
                                var force = 0.03;
                                var repelPower = (that.radius + e.radius - dist) / (that.radius + e.radius);
                                that.dx -= Math.cos(ang) * repelPower * force;
                                that.dy -= Math.sin(ang) * repelPower * force;
                                e.dx += Math.cos(ang) * repelPower * force;
                                e.dy += Math.sin(ang) * repelPower * force;
                            }

                        }
                    }

                }

            }
            //----------------------------------------------

            //update actual pixel coordinates:

            that.xx = Math.floor((that.cx + that.xr)*Const.GRID);
            that.yy = Math.floor((that.cy + that.yr)*Const.GRID);
            that.ddx = (that.cx + that.xr)* Const.GRID - that.ox;
            that.ddy = (that.cy + that.yr)* Const.GRID - that.oy;
            that.ox = (that.cx + that.xr)* Const.GRID;
            that.oy = (that.cy + that.yr)* Const.GRID;


        }

    };
