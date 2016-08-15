/**
 * Created by ryan on 8/14/16.
 */

G.init = function() {
    G.canvas = document.querySelector('#game');
    G.ctx = G.canvas.getContext('2d');
    G.ctx.fillStyle = "#ff0000";
    G.ctx.fillRect(64,64,64,64);

    G.EVENT = {
        playerHurt: 0,
        playerHit: 1

    }
    //todo:setup state machine

    G.cfg = {

        state: {
            initial: 'boot',
            events: [
            { name: 'ready',  from: 'boot',          to: 'menu' },
            { name: 'play',   from: 'menu',          to: 'game' },
            ]
        },

        pubsub: [

            { event: G.EVENT.playerHurt, action: function(player, by, nuke)     {this.onPlayerHurt(player, by, nuke); } },
            {},
       ]

    }

    //todo: finish analyzing jake's gauntlet setup
    G.PubSub.enable(cfg.pubsub, G);


    console.log('initialized');

};
window.onload=G.init;