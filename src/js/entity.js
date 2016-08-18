/*global G */
Game.Entity = function(opt){
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
    
    this.radius = 0;
    this.gravity = 0;
    
    this.frictX = 0.92;
    this.frictY = 0.94;
    this.dead = false;
    this.collides = 1;
    
    this.id = Math.random();
    
};

Game.Entity.prototype.die = function(e) {
    e.dead = true;
    Game.ALL.splice(Game.ALL.indexOf(e), 1);
}

Game.Entity.prototype.setCoords = function(x,y) {
        this.xx = x;
        this.yy = y;
        this.cx = Math.floor(this.xx/Game.const.GRID);
        this.cy = Math.floor(this.yy/Game.const.GRID);
        this.xr = (this.xx - this.cx*Game.const.GRID) / Game.const.GRID;
        this.xy = (this.yy - this.cy*Game.const.GRID) / Game.const.GRID;
    };

Game.Entity.prototype.hasCollision = function(cx,cy) {
        if( (this.cx<1 && this.xr < .5) || this.cx>=Game.const.WIDTH)
            return true;
        else if(this.cy<1 && this.yr < .5 || this.cy>=Game.const.HEIGHT ){
            return true;
        }
        else return (0); //eventually return map coordinates.
};

Game.Entity.prototype.overlaps = function(e) { //e is another entity
    var maxDist = this.radius + e.radius;
    var distSqr = (e.xx - this.xx)*(e.xx-this.xx) + (e.yy - this.yy)*(e.yy-this.yy);
    if(distSqr <= maxDist*maxDist )
        return true;
    else
        return false;
};
    
Game.Entity.prototype.onGround = function() {
    return this.hasCollision(this.cx, this.cy+1) && this.yr>=0.5;
};

Game.Entity.prototype.onCeiling = function() {
    return this.hasCollision(this.cx, this.cy-1) && this.yr<=0.5;
};

Game.Entity.prototype.onWallLeft = function() {
    return this.hasCollision(this.cx-1, this.cy) && this.xr<=0.5;
}
Game.Entity.prototype.onWallRight = function() {
    return this.hasCollision(this.cx+1, this.cy) && this.xr>=0.5;
}
    
Game.Entity.prototype.update = function() {
    
    if(!this.dead){
        
        
        var gravity = this.gravity;

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

        for(var i = 0; i < Game.ALL.length; i++) {
            //console.log('in collision check loop');
            var e = Game.ALL[i];
            if(!e.dead){
                if(e.collides){
                //broad phase collision detection
                if(e != this && Math.abs(this.cx-e.cx) <= 1 && Math.abs(this.cy-e.cy) <= 1 ){

                    //if the cells are close enough, then we break out the actual distance check
                    if(this.overlaps(e)) {
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

        this.xx = Math.floor((this.cx + this.xr)*Game.const.GRID);
        this.yy = Math.floor((this.cy + this.yr)*Game.const.GRID);
        this.ddx = (this.cx + this.xr)*Game.const.GRID - this.ox;
        this.ddy = (this.cy + this.yr)*Game.const.GRID - this.oy;
        this.ox = (this.cx + this.xr)*Game.const.GRID;
        this.oy = (this.cy + this.yr)*Game.const.GRID;
        
            
    }
    
    
};
    
    