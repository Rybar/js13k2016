//Camera
(function(g){



    // possibles axis to move the camera
    var AXIS = {
        NONE: "none",
        HORIZONTAL: "horizontal",
        VERTICAL: "vertical",
        BOTH: "both"
    };

    // Camera constructor
    function Camera(xView, yView, canvasWidth, canvasHeight, worldWidth, worldHeight)
    {
        var that = this;
        // position of camera (left-top coordinate)
        that.xView = xView || 0;
        that.yView = yView || 0;

        // distance from followed object to border before camera starts move
        that.xDeadZone = 0; // min distance to horizontal borders
        that.yDeadZone = 0; // min distance to vertical borders

        // viewport dimensions
        that.wView = canvasWidth;
        that.hView = canvasHeight;

        // allow camera to move in vertical and horizontal axis
        that.axis = AXIS.BOTH;

        // object that should be followed
        that.followed = null;

        // rectangle that represents the viewport
        that.viewportRect = new g.Rectangle(that.xView, that.yView, that.wView, that.hView);

        // rectangle that represents the world's boundary (room's boundary)
        that.worldRect = new g.Rectangle(0, 0, worldWidth, worldHeight);
    }

    // gameObject needs to have "x" and "y" properties (as world(or room) position)
    Camera.prototype.follow = function(gameObject, xDeadZone, yDeadZone)
    {
        that.followed = gameObject;
        that.xDeadZone = xDeadZone;
        that.yDeadZone = yDeadZone;
    }

    Camera.prototype.update = function()
    {
        // keep following the player (or other desired object)
        if(that.followed != null)
        {
            if(that.axis == AXIS.HORIZONTAL || that.axis == AXIS.BOTH)
            {
                // moves camera on horizontal axis based on followed object position
                if(that.followed.xx - that.xView  + that.xDeadZone > that.wView)
                    that.xView = that.followed.xx - (that.wView - that.xDeadZone);
                else if(that.followed.xx  - that.xDeadZone < that.xView)
                    that.xView = that.followed.xx  - that.xDeadZone;

            }
            if(that.axis == AXIS.VERTICAL || that.axis == AXIS.BOTH)
            {
                // moves camera on vertical axis based on followed object position
                if(that.followed.yy - that.yView + that.yDeadZone > that.hView)
                    that.yView = that.followed.yy - (that.hView - that.yDeadZone);
                else if(that.followed.yy - that.yDeadZone < that.yView)
                    that.yView = that.followed.yy - that.yDeadZone;
            }

        }

        // update viewportRect
        that.viewportRect.set(that.xView, that.yView);

        // don't let camera leaves the world's boundary
        if(!that.viewportRect.within(that.worldRect))
        {
            if(that.viewportRect.left < that.worldRect.left)
                that.xView = that.worldRect.left;
            if(that.viewportRect.top < that.worldRect.top)
                that.yView = that.worldRect.top;
            if(that.viewportRect.right > that.worldRect.right)
                that.xView = that.worldRect.right - that.wView;
            if(that.viewportRect.bottom > that.worldRect.bottom)
                that.yView = that.worldRect.bottom - that.hView;
        }

    };

    // add "class" Camera to our Game object
    g.Camera = Camera;

    return g;

})(GAME);