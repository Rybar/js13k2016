var G = function(){};
G.Entity = function(){
    this.cx = 0;
    this.cy = 0;
    this.xr = 0;
    this.yr = 0;
    
    this.xx = 0;
    this.yy = 0;
    
    this.dx = 0;
    this.dy = 0;
    
    this.radius = 0;
    this.gravity = 0;
};

G.Entity.prototype.setCoords = function(x,y) {
        this.xx = x;
        this.yy = y;
        this.cx = Math.floor(this.xx/G.const.GRID);
        this.cy = Math.floor(this.yy/G.const.GRID);
        this.xr = (this.xx - this.cx*G.const.GRID) / G.const.GRID;
        this.xy = (this.yy - this.cy*G.const.GRID) / G.const.GRID;
    };
    
//Other prototype methods....

// Now I'd like to create new objects using Entity's prototype. 
// but I'm doing something wrong;

G.Enemy = function(){} //so far so good...
G.Enemy.prototype = G.Entity();  // no errors
G.Enemy.prototype.update = function() {}  //

G.Enemy.update()  //throws undefined error.  

