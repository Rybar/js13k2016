Game = function() {
    canvas = document.querySelector('#game');
    ctx = canvas.getContext('2d');

    ctx.fillStyle = "#ff0000";
    ctx.fillRect(64,64,64,64);

   var g = StateMachine.create({
            initial: "init",

            events: [
                {name: 'boot', from: 'init', to: 'boot'},
                {name: 'ready', from: 'boot', to: 'menu' },
                {name: 'play', from: 'menu', to: 'game' },
                {name: 'lose', from: 'game', to: 'gameover' },
            ],

            callbacks: {
                onbeforeboot: function(event, from, to) {
                    console.log('booting up');
                },

                onboot: function(event, from, to) {
                    console.log('booted!');
                },

                onready: function(event, from, to) {
                    ctx.fillStyle = "#ffff00";
                    ctx.fillRect(128,64,64,64);
                },
                ongame: function(event, from, to) {
                    ctx.fillStyle = "#00ff00";
                    ctx.fillRect(128+64,64,64,64);
                }
            }
        });
    console.log(g);

    g.boot();
    return g;
}();

