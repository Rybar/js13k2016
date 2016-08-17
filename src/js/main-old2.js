window.g = {


defaults: {
    GRID: 20,
    WIDTH: 50,
    HEIGHT: 40,
    VIEW_X: 512,
    VIEW_Y: 512,
},

cfg: {

    state: {
        initial: 'boot',
        events: [
            { name: 'ready',  from: 'boot',          to: 'menu' },
            { name: 'play',   from: 'menu',          to: 'game' },
        ]
    },

    pubsub: [

        { event: G.EVENT.playerHurt, action: function(player, by, nuke)     {this.onPlayerHurt(player, by, nuke); } },

    ]

}

}


G.init = function() {
    G.canvas = document.querySelector('#game');
    G.ctx = G.canvas.getContext('2d');
    G.ctx.fillStyle = "#ffff00";
    G.ctx.fillRect(64,64,64,64);

    G.EVENT = {
        playerHurt: 0,
        playerHit: 1

    }
    //todo:setup state machine

    G.cfg = {



    }

    var fsm = new StateMachine.create(G.cfg.state);

    //todo: finish analyzing jake's gauntlet setup
    G.PubSub.enable(G.cfg.pubsub, G);


    console.log('initialized');

    fsm.onready = function() {
        console.log('transitioning to menu state...');
    }

    fsm.onmenu = function() {
        console.log(G.fsm.current);

    }

};



window.onload=G.init;