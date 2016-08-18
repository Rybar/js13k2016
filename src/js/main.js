Game = function() {
    canvas = document.querySelector('#game');
    ctx = canvas.getContext('2d');

    ctx.fillStyle = "#ff00ff";
    ctx.fillRect(64,64,64,64);
    var cnt = 0;

    var Game = {
        //input
        Key: {

            _pressed: {},
            _released: {},

            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40,
            SPACE: 32,
            a: 65,
            w: 87,
            s: 83,
            d: 68,
            z: 90,
            x: 88,
            f: 70,
            p: 80,

            isDown: function(keyCode) {
                return this._pressed[keyCode];
            },

            justReleased: function(keyCode) {
                return this._released[keyCode];
            },

            onKeydown: function(event) {
                this._pressed[event.keyCode] = true;
            },

            onKeyup: function(event) {
                this._released[event.keyCode] = true;
                delete this._pressed[event.keyCode];

            },

            update: function(){
                this._released = {};
            }
        },

        //Text and graphics render functions
        Txt: {
            textLine: function (opt) {
                if (!opt.glitchFactor) opt.glitchFactor = 0;
                if (!opt.glitchChance) opt.glitchChance = 0;

                var textLength = opt.text.length,
                    size = 5;
                for (var i = 0; i < textLength; i++) {
                    var letter = Game.Assets.letters[( opt.text.charAt(i) )] || G.assets.letters['unknown'];
                    for (var y = 0; y < size; y++) {
                        //var g = (Math.random() > opt.glitchChance) * opt.glitchFactor;
                        for (var x = 0; x < size; x++) {
                            if (letter[y][x] === 1) {
                                g = (Math.random() > opt.glitchChance) * opt.glitchFactor;
                                //if(g)
                                opt.ctx.fillRect(opt.x + ( x * opt.scale ) + ( ( size * opt.scale ) + opt.hspacing ) * i, opt.y + y * opt.scale + g, opt.scale, opt.scale);
                            }
                        }
                    }
                }
            },


            text :function (opt) {
                var size = 5,
                    letterSize = size * opt.scale,
                    lines = opt.text.split('\n'),
                    linesCopy = lines.slice(0),
                    lineCount = lines.length,
                    longestLine = linesCopy.sort(function (a, b) {
                        return b.length - a.length;
                    })[0],
                    textWidth = ( longestLine.length * letterSize ) + ( ( longestLine.length - 1 ) * opt.hspacing ),
                    textHeight = ( lineCount * letterSize ) + ( ( lineCount - 1 ) * opt.vspacing );

                var sx = opt.x,
                    sy = opt.y,
                    ex = opt.x + textWidth,
                    ey = opt.y + textHeight;

                if (opt.halign == 'center') {
                    sx = opt.x - textWidth / 2;
                    ex = opt.x + textWidth / 2;
                } else if (opt.halign == 'right') {
                    sx = opt.x - textWidth;
                    ex = opt.x;
                }

                if (opt.valign == 'center') {
                    sy = opt.y - textHeight / 2;
                    ey = opt.y + textHeight / 2;
                } else if (opt.valign == 'bottom') {
                    sy = opt.y - textHeight;
                    ey = opt.y;
                }

                var cx = sx + textWidth / 2,
                    cy = sy + textHeight / 2;

                if (opt.render) {
                    for (var i = 0; i < lineCount; i++) {
                        var line = lines[i],
                            lineWidth = ( line.length * letterSize ) + ( ( line.length - 1 ) * opt.hspacing ),
                            x = opt.x,
                            y = opt.y + ( letterSize + opt.vspacing ) * i;

                        if (opt.halign == 'center') {
                            x = opt.x - lineWidth / 2;
                        } else if (opt.halign == 'right') {
                            x = opt.x - lineWidth;
                        }

                        if (opt.valign == 'center') {
                            y = y - textHeight / 2;
                        } else if (opt.valign == 'bottom') {
                            y = y - textHeight;
                        }

                        if (opt.snap) {
                            x = Math.floor(x);
                            y = Math.floor(y);
                        }

                        this.textLine({
                            ctx: opt.ctx,
                            x: x,
                            y: y,
                            text: line,
                            hspacing: opt.hspacing,
                            scale: opt.scale,
                            glitchChance: opt.glitchChance,
                            glitchFactor: opt.glitchFactor
                        });
                    }
                }

                return {
                    sx: sx,
                    sy: sy,
                    cx: cx,
                    cy: cy,
                    ex: ex,
                    ey: ey,
                    width: textWidth,
                    height: textHeight
                }
            }
        },

        //sound, song, and character definitions
        Assets: {

        song: {
            "songLen": 123,
            "songData": [
                {
                    "osc1_oct": 9,
                    "osc1_det": 0,
                    "osc1_detune": 0,
                    "osc1_xenv": 0,
                    "osc1_vol": 161,
                    "osc1_waveform": 0,
                    "osc2_oct": 9,
                    "osc2_det": 0,
                    "osc2_detune": 4,
                    "osc2_xenv": 0,
                    "osc2_vol": 182,
                    "osc2_waveform": 0,
                    "noise_fader": 0,
                    "env_attack": 100,
                    "env_sustain": 1818,
                    "env_release": 18181,
                    "env_master": 192,
                    "fx_filter": 0,
                    "fx_freq": 0,
                    "fx_resonance": 254,
                    "fx_delay_time": 6,
                    "fx_delay_amt": 108,
                    "fx_pan_freq": 3,
                    "fx_pan_amt": 61,
                    "lfo_osc1_freq": 0,
                    "lfo_fx_freq": 0,
                    "lfo_freq": 3,
                    "lfo_amt": 94,
                    "lfo_waveform": 2,
                    "p": [
                        1,
                        2,
                        1,
                        2,
                        1,
                        2,
                        1,
                        2,
                        1,
                        2,
                        1,
                        2,
                        1,
                        2,
                        1,
                        2,
                        0,
                        2,
                        3,
                        4,
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8,
                        5
                    ],
                    "c": [
                        {
                            "n": [
                                142,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                140,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                138,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ]
                        },
                        {
                            "n": [
                                135,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                135,
                                0,
                                0,
                                0,
                                138,
                                0,
                                0,
                                0
                            ]
                        },
                        {
                            "n": [
                                140,
                                0,
                                138,
                                0,
                                135,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                130,
                                0,
                                142,
                                0,
                                140,
                                0,
                                135,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                138,
                                0,
                                0,
                                0
                            ]
                        },
                        {
                            "n": [
                                135,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                130,
                                0,
                                142,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                135,
                                0,
                                0,
                                0,
                                138,
                                0,
                                0,
                                0
                            ]
                        },
                        {
                            "n": [
                                123,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ]
                        },
                        {
                            "n": [
                                130,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ]
                        },
                        {
                            "n": [
                                128,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ]
                        },
                        {
                            "n": [
                                119,
                                131,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                126,
                                114,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ]
                        }
                    ]
                },
                {
                    "osc1_oct": 8,
                    "osc1_det": 0,
                    "osc1_detune": 0,
                    "osc1_xenv": 0,
                    "osc1_vol": 0,
                    "osc1_waveform": 0,
                    "osc2_oct": 8,
                    "osc2_det": 0,
                    "osc2_detune": 0,
                    "osc2_xenv": 0,
                    "osc2_vol": 0,
                    "osc2_waveform": 0,
                    "noise_fader": 19,
                    "env_attack": 100,
                    "env_sustain": 0,
                    "env_release": 3636,
                    "env_master": 192,
                    "fx_filter": 1,
                    "fx_freq": 8100,
                    "fx_resonance": 156,
                    "fx_delay_time": 2,
                    "fx_delay_amt": 22,
                    "fx_pan_freq": 3,
                    "fx_pan_amt": 43,
                    "lfo_osc1_freq": 0,
                    "lfo_fx_freq": 0,
                    "lfo_freq": 0,
                    "lfo_amt": 0,
                    "lfo_waveform": 0,
                    "p": [
                        0,
                        0,
                        1,
                        2,
                        1,
                        2,
                        1,
                        2,
                        1,
                        2,
                        1,
                        2,
                        1,
                        2,
                        1,
                        2,
                        1,
                        2,
                        1,
                        2,
                        1,
                        2,
                        1,
                        2,
                        1,
                        2,
                        1,
                        2
                    ],
                    "c": [
                        {
                            "n": [
                                135,
                                0,
                                135,
                                0,
                                0,
                                135,
                                0,
                                135,
                                135,
                                0,
                                135,
                                0,
                                0,
                                135,
                                0,
                                135,
                                135,
                                0,
                                135,
                                0,
                                0,
                                135,
                                0,
                                135,
                                135,
                                0,
                                135,
                                0,
                                0,
                                135,
                                0,
                                135
                            ]
                        },
                        {
                            "n": [
                                135,
                                0,
                                135,
                                0,
                                0,
                                135,
                                0,
                                135,
                                135,
                                0,
                                135,
                                0,
                                0,
                                135,
                                0,
                                135,
                                135,
                                0,
                                135,
                                0,
                                0,
                                135,
                                0,
                                135,
                                135,
                                0,
                                135,
                                0,
                                135,
                                0,
                                135,
                                135
                            ]
                        }
                    ]
                },
                {
                    "osc1_oct": 6,
                    "osc1_det": 0,
                    "osc1_detune": 0,
                    "osc1_xenv": 0,
                    "osc1_vol": 192,
                    "osc1_waveform": 1,
                    "osc2_oct": 8,
                    "osc2_det": 0,
                    "osc2_detune": 8,
                    "osc2_xenv": 0,
                    "osc2_vol": 82,
                    "osc2_waveform": 2,
                    "noise_fader": 0,
                    "env_attack": 100,
                    "env_sustain": 4545,
                    "env_release": 2727,
                    "env_master": 192,
                    "fx_filter": 3,
                    "fx_freq": 2700,
                    "fx_resonance": 85,
                    "fx_delay_time": 6,
                    "fx_delay_amt": 60,
                    "fx_pan_freq": 6,
                    "fx_pan_amt": 86,
                    "lfo_osc1_freq": 0,
                    "lfo_fx_freq": 1,
                    "lfo_freq": 7,
                    "lfo_amt": 106,
                    "lfo_waveform": 0,
                    "p": [
                        0,
                        0,
                        0,
                        0,
                        1,
                        1,
                        2,
                        3,
                        1,
                        1,
                        2,
                        3,
                        1,
                        1,
                        2,
                        3,
                        1,
                        1,
                        2,
                        3,
                        1,
                        1,
                        2,
                        3
                    ],
                    "c": [
                        {
                            "n": [
                                135,
                                135,
                                147,
                                135,
                                0,
                                135,
                                147,
                                135,
                                135,
                                135,
                                147,
                                135,
                                0,
                                135,
                                147,
                                135,
                                135,
                                135,
                                147,
                                135,
                                0,
                                135,
                                147,
                                135,
                                135,
                                135,
                                147,
                                135,
                                0,
                                135,
                                147,
                                135
                            ]
                        },
                        {
                            "n": [
                                140,
                                140,
                                152,
                                140,
                                0,
                                140,
                                152,
                                140,
                                140,
                                140,
                                152,
                                140,
                                0,
                                140,
                                152,
                                140,
                                140,
                                140,
                                152,
                                140,
                                0,
                                140,
                                152,
                                140,
                                140,
                                140,
                                152,
                                140,
                                0,
                                140,
                                152,
                                142
                            ]
                        },
                        {
                            "n": [
                                131,
                                131,
                                143,
                                131,
                                0,
                                131,
                                143,
                                131,
                                131,
                                131,
                                143,
                                131,
                                0,
                                131,
                                143,
                                131,
                                138,
                                138,
                                150,
                                138,
                                0,
                                138,
                                150,
                                138,
                                138,
                                138,
                                150,
                                138,
                                0,
                                138,
                                150,
                                137
                            ]
                        }
                    ]
                },
                {
                    "osc1_oct": 7,
                    "osc1_det": 0,
                    "osc1_detune": 0,
                    "osc1_xenv": 0,
                    "osc1_vol": 187,
                    "osc1_waveform": 2,
                    "osc2_oct": 5,
                    "osc2_det": 0,
                    "osc2_detune": 2,
                    "osc2_xenv": 1,
                    "osc2_vol": 161,
                    "osc2_waveform": 2,
                    "noise_fader": 0,
                    "env_attack": 100,
                    "env_sustain": 1818,
                    "env_release": 2727,
                    "env_master": 123,
                    "fx_filter": 1,
                    "fx_freq": 1900,
                    "fx_resonance": 162,
                    "fx_delay_time": 2,
                    "fx_delay_amt": 153,
                    "fx_pan_freq": 6,
                    "fx_pan_amt": 61,
                    "lfo_osc1_freq": 0,
                    "lfo_fx_freq": 1,
                    "lfo_freq": 2,
                    "lfo_amt": 196,
                    "lfo_waveform": 3,
                    "p": [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        1,
                        1,
                        1,
                        2,
                        1,
                        1,
                        1,
                        2,
                        1,
                        1,
                        1,
                        2,
                        1,
                        1,
                        1,
                        2,
                        1,
                        1,
                        1,
                        2,
                        3
                    ],
                    "c": [
                        {
                            "n": [
                                135,
                                135,
                                138,
                                135,
                                142,
                                135,
                                140,
                                138,
                                135,
                                135,
                                138,
                                135,
                                142,
                                135,
                                140,
                                138,
                                135,
                                135,
                                138,
                                135,
                                142,
                                135,
                                140,
                                138,
                                135,
                                135,
                                138,
                                135,
                                142,
                                135,
                                140,
                                138
                            ]
                        },
                        {
                            "n": [
                                143,
                                143,
                                155,
                                143,
                                0,
                                143,
                                155,
                                143,
                                143,
                                143,
                                150,
                                143,
                                147,
                                143,
                                140,
                                143,
                                138,
                                138,
                                143,
                                138,
                                143,
                                140,
                                138,
                                140,
                                138,
                                138,
                                143,
                                138,
                                142,
                                140,
                                138,
                                140
                            ]
                        },
                        {
                            "n": [
                                135,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ]
                        }
                    ]
                },
                {
                    "osc1_oct": 8,
                    "osc1_det": 0,
                    "osc1_detune": 0,
                    "osc1_xenv": 1,
                    "osc1_vol": 192,
                    "osc1_waveform": 0,
                    "osc2_oct": 7,
                    "osc2_det": 0,
                    "osc2_detune": 0,
                    "osc2_xenv": 1,
                    "osc2_vol": 70,
                    "osc2_waveform": 2,
                    "noise_fader": 8,
                    "env_attack": 100,
                    "env_sustain": 0,
                    "env_release": 9090,
                    "env_master": 164,
                    "fx_filter": 2,
                    "fx_freq": 5500,
                    "fx_resonance": 240,
                    "fx_delay_time": 6,
                    "fx_delay_amt": 51,
                    "fx_pan_freq": 3,
                    "fx_pan_amt": 66,
                    "lfo_osc1_freq": 0,
                    "lfo_fx_freq": 0,
                    "lfo_freq": 0,
                    "lfo_amt": 0,
                    "lfo_waveform": 0,
                    "p": [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        1,
                        1,
                        1,
                        1,
                        1,
                        1,
                        1,
                        1,
                        1,
                        1,
                        1,
                        1
                    ],
                    "c": [
                        {
                            "n": [
                                135,
                                0,
                                0,
                                0,
                                0,
                                0,
                                135,
                                0,
                                0,
                                0,
                                135,
                                0,
                                0,
                                0,
                                0,
                                0,
                                135,
                                0,
                                0,
                                0,
                                0,
                                0,
                                135,
                                0,
                                0,
                                0,
                                135,
                                0,
                                0,
                                0,
                                0,
                                0
                            ]
                        }
                    ]
                },
                {
                    "osc1_oct": 7,
                    "osc1_det": 0,
                    "osc1_detune": 0,
                    "osc1_xenv": 0,
                    "osc1_vol": 192,
                    "osc1_waveform": 2,
                    "osc2_oct": 8,
                    "osc2_det": 0,
                    "osc2_detune": 6,
                    "osc2_xenv": 0,
                    "osc2_vol": 184,
                    "osc2_waveform": 2,
                    "noise_fader": 21,
                    "env_attack": 40000,
                    "env_sustain": 25454,
                    "env_release": 90909,
                    "env_master": 77,
                    "fx_filter": 2,
                    "fx_freq": 7100,
                    "fx_resonance": 188,
                    "fx_delay_time": 8,
                    "fx_delay_amt": 147,
                    "fx_pan_freq": 4,
                    "fx_pan_amt": 69,
                    "lfo_osc1_freq": 0,
                    "lfo_fx_freq": 1,
                    "lfo_freq": 7,
                    "lfo_amt": 176,
                    "lfo_waveform": 1,
                    "p": [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        1,
                        2,
                        3,
                        4,
                        1,
                        2,
                        3,
                        4,
                        1,
                        2,
                        3,
                        4,
                        1,
                        2,
                        3,
                        4,
                        5
                    ],
                    "c": [
                        {
                            "n": [
                                135,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ]
                        },
                        {
                            "n": [
                                142,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ]
                        },
                        {
                            "n": [
                                128,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ]
                        },
                        {
                            "n": [
                                143,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                138,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ]
                        },
                        {
                            "n": [
                                135,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ]
                        }
                    ]
                },
                {
                    "osc1_oct": 8,
                    "osc1_det": 0,
                    "osc1_detune": 0,
                    "osc1_xenv": 0,
                    "osc1_vol": 0,
                    "osc1_waveform": 0,
                    "osc2_oct": 8,
                    "osc2_det": 0,
                    "osc2_detune": 0,
                    "osc2_xenv": 0,
                    "osc2_vol": 0,
                    "osc2_waveform": 0,
                    "noise_fader": 148,
                    "env_attack": 3636,
                    "env_sustain": 4545,
                    "env_release": 39090,
                    "env_master": 136,
                    "fx_filter": 2,
                    "fx_freq": 3100,
                    "fx_resonance": 122,
                    "fx_delay_time": 5,
                    "fx_delay_amt": 132,
                    "fx_pan_freq": 0,
                    "fx_pan_amt": 0,
                    "lfo_osc1_freq": 0,
                    "lfo_fx_freq": 1,
                    "lfo_freq": 5,
                    "lfo_amt": 147,
                    "lfo_waveform": 0,
                    "p": [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        1,
                        2,
                        1,
                        3,
                        1,
                        2,
                        1,
                        3,
                        4
                    ],
                    "c": [
                        {
                            "n": [
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                135,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                135,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ]
                        },
                        {
                            "n": [
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                135,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                162,
                                0,
                                135,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ]
                        },
                        {
                            "n": [
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                135,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                151,
                                0,
                                0,
                                0,
                                0,
                                0,
                                135,
                                0,
                                135,
                                0,
                                0,
                                0,
                                0,
                                0
                            ]
                        },
                        {
                            "n": [
                                135,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ]
                        }
                    ]
                }
            ],
            "rowLen": 5606,
            "endPattern": 30
        },

        letters: {
            '1': [
                [, , 1, , 0],
                [, 1, 1, , 0],
                [, , 1, , 0],
                [, , 1, , 0],
                [1, 1, 1, 1, 1]
            ],
            '2': [
                [1, 1, 1, 1, 0],
                [, , , , 1],
                [, 1, 1, 1, 0],
                [1, , , , 0],
                [1, 1, 1, 1, 1]
            ],
            '3': [
                [1, 1, 1, 1, 0],
                [, , , , 1],
                [, 1, 1, 1, 1],
                [, , , , 1],
                [1, 1, 1, 1, 0]
            ],
            '4': [
                [1, , , 1, 0],
                [1, , , 1, 0],
                [1, 1, 1, 1, 1],
                [, , , 1, 0],
                [, , , 1, 0]
            ],
            '5': [
                [1, 1, 1, 1, 1],
                [1, , , , 0],
                [1, 1, 1, 1, 0],
                [, , , , 1],
                [1, 1, 1, 1, 0]
            ],
            '6': [
                [, 1, 1, 1, 0],
                [1, , , , 0],
                [1, 1, 1, 1, 0],
                [1, , , , 1],
                [, 1, 1, 1, 0]
            ],
            '7': [
                [1, 1, 1, 1, 1],
                [, , , , 1],
                [, , , 1, 0],
                [, , 1, , 0],
                [, , 1, , 0]
            ],
            '8': [
                [, 1, 1, 1, 0],
                [1, , , , 1],
                [, 1, 1, 1, 0],
                [1, , , , 1],
                [, 1, 1, 1, 0]
            ],
            '9': [
                [, 1, 1, 1, 0],
                [1, , , , 1],
                [, 1, 1, 1, 1],
                [, , , , 1],
                [, 1, 1, 1, 0]
            ],
            '0': [
                [, 1, 1, 1, 0],
                [1, , , , 1],
                [1, , , , 1],
                [1, , , , 1],
                [, 1, 1, 1, 0]
            ],
            'A': [
                [1, 1, 1, 1, 1],
                [1, , , , 1],
                [1, 1, 1, 1, 1],
                [1, , , , 1],
                [1, , , , 1]
            ],
            'B': [
                [1, 1, 1, 1, 0],
                [1, , , 1, 0],
                [1, 1, 1, 1, 1],
                [1, , , , 1],
                [1, 1, 1, 1, 1]
            ],
            'C': [
                [1, 1, 1, 1, 1],
                [1, , , , 0],
                [1, , , , 0],
                [1, , , , 0],
                [1, 1, 1, 1, 1]
            ],
            'D': [
                [1, 1, 1, , 0],
                [1, , , 1, 0],
                [1, , , , 1],
                [1, , , , 1],
                [1, 1, 1, 1, 1]
            ],
            'E': [
                [1, 1, 1, 1, 1],
                [1, , , , 0],
                [1, 1, 1, , 0],
                [1, , , , 0],
                [1, 1, 1, 1, 1]
            ],
            'F': [
                [1, 1, 1, 1, 1],
                [1, , , , 0],
                [1, 1, 1, , 0],
                [1, , , , 0],
                [1, , , , 0]
            ],
            'G': [
                [1, 1, 1, 1, 1],
                [1, , , , 0],
                [1, , 1, 1, 1],
                [1, , , , 1],
                [1, 1, 1, 1, 1]
            ],
            'H': [
                [1, , , , 1],
                [1, , , , 1],
                [1, 1, 1, 1, 1],
                [1, , , , 1],
                [1, , , , 1]
            ],
            'I': [
                [1, 1, 1, 1, 1],
                [, , 1, , 0],
                [, , 1, , 0],
                [, , 1, , 0],
                [1, 1, 1, 1, 1]
            ],
            'J': [
                [, , , , 1],
                [, , , , 1],
                [, , , , 1],
                [1, , , , 1],
                [1, 1, 1, 1, 1]
            ],
            'K': [
                [1, , , 1, 0],
                [1, , 1, , 0],
                [1, 1, 1, , 0],
                [1, , , 1, 0],
                [1, , , , 1]
            ],
            'L': [
                [1, , , , 0],
                [1, , , , 0],
                [1, , , , 0],
                [1, , , , 0],
                [1, 1, 1, 1, 1]
            ],
            'M': [
                [1, , , , 1],
                [1, 1, , 1, 1],
                [1, , 1, , 1],
                [1, , , , 1],
                [1, , , , 1]
            ],
            'N': [
                [1, , , , 1],
                [1, 1, , , 1],
                [1, , 1, , 1],
                [1, , , 1, 1],
                [1, , , , 1]
            ],
            'O': [
                [1, 1, 1, 1, 1],
                [1, , , , 1],
                [1, , , , 1],
                [1, , , , 1],
                [1, 1, 1, 1, 1]
            ],
            'P': [
                [1, 1, 1, 1, 1],
                [1, , , , 1],
                [1, 1, 1, 1, 1],
                [1, , , , 0],
                [1, , , , 0]
            ],
            'Q': [
                [1, 1, 1, 1, 0],
                [1, , , 1, 0],
                [1, , , 1, 0],
                [1, , , 1, 0],
                [1, 1, 1, 1, 1]
            ],
            'R': [
                [1, 1, 1, 1, 1],
                [1, , , , 1],
                [1, 1, 1, 1, 1],
                [1, , , 1, 0],
                [1, , , , 1]
            ],
            'S': [
                [1, 1, 1, 1, 1],
                [1, , , , 0],
                [1, 1, 1, 1, 1],
                [, , , , 1],
                [1, 1, 1, 1, 1]
            ],
            'T': [
                [1, 1, 1, 1, 1],
                [, , 1, , 0],
                [, , 1, , 0],
                [, , 1, , 0],
                [, , 1, , 0]
            ],
            'U': [
                [1, , , , 1],
                [1, , , , 1],
                [1, , , , 1],
                [1, , , , 1],
                [1, 1, 1, 1, 1]
            ],
            'V': [
                [1, , , , 1],
                [1, , , , 1],
                [1, , , , 1],
                [, 1, , 1, 0],
                [, , 1, , 0]
            ],
            'W': [
                [1, , , , 1],
                [1, , , , 1],
                [1, , 1, , 1],
                [1, 1, , 1, 1],
                [1, , , , 1]
            ],
            'X': [
                [1, , , , 1],
                [, 1, , 1, 0],
                [, , 1, , 0],
                [, 1, , 1, 0],
                [1, , , , 1]
            ],
            'Y': [
                [1, , , , 1],
                [1, , , , 1],
                [1, 1, 1, 1, 1],
                [, , 1, , 0],
                [, , 1, , 0]
            ],
            'Z': [
                [1, 1, 1, 1, 1],
                [, , , 1, 0],
                [, , 1, , 0],
                [, 1, , , 0],
                [1, 1, 1, 1, 1]
            ],
            ' ': [
                [, , , , 0],
                [, , , , 0],
                [, , , , 0],
                [, , , , 0],
                [, , , , 0]
            ],
            ',': [
                [, , , , 0],
                [, , , , 0],
                [, , , , 0],
                [, , 1, , 0],
                [, , 1, , 0]
            ],
            '+': [
                [, , , , 0],
                [, , 1, , 0],
                [, 1, 1, 1, 0],
                [, , 1, , 0],
                [, , , , 0]
            ],
            '/': [
                [, , , , 1],
                [, , , 1, 0],
                [, , 1, , 0],
                [, 1, , , 0],
                [1, , , , 0]
            ],
            ':': [
                [, , , , 0],
                [, , 1, , 0],
                [, , , , 0],
                [, , 1, , 0],
                [, , , , 0]
            ],
            '@': [
                [1, 1, 1, 1, 1],
                [, , , , 1],
                [1, 1, 1, , 1],
                [1, , 1, , 1],
                [1, 1, 1, 1, 1]
            ],
            'x': [ //solid first checkers
                [1,,1,,1],
                [,1,,1,0],
                [1,,1,,1],
                [,1,,1,0],
                [1,,1,,1]
            ],
            'z': [
                //empty first checkers
                [,1,,1,0],
                [1,,1,,1],
                [,1,,1,0],
                [1,,1,,1],
                [,1,,1,0]
            ],
            'o': [
                //box with dot
                [1,1,1,1,1],
                [1, , , ,1],
                [1, ,1, ,1],
                [1, , , ,1],
                [1,1,1,1,1]
            ],
            'e': [
                //down-right slope
                [1,0,0,0,0],
                [1,1,0,0,0],
                [1,1,1,0,0],
                [1,1,1,1,0],
                [1,1,1,1,1]
            ],
            'w': [
                //right triangle
                [0,0,0,0,1],
                [0,0,0,1,1],
                [0,0,1,1,1],
                [0,1,1,1,1],
                [1,1,1,1,1]
            ],

        }

    },

    fsm: StateMachine.create({
        initial: "init",

        events: [
            {name: 'boot', from: 'init', to: 'boot'},
            {name: 'ready', from: 'boot', to: 'menu' },
            {name: 'play', from: 'menu', to: 'game' },
            {name: 'lose', from: 'game', to: 'gameover' },
            {name: 'reset', from: ['init','boot','menu','gameover'], to: 'boot'},
        ],

        callbacks: {
            onbeforeboot: function(event, from, to) {
                console.log('booting up');
            },

            onboot: function(event, from, to) {
                console.log('booted!');
            },

            onready: function(event, from, to) {

            },

            ongame: function(event, from, to) {

            }
        }
    }, this),

    loop: function() {


        //console.log('in frame');
        cnt += .1;
        ctx.clearRect(0,0,512,512);
        ctx.fillRect(256+Math.sin(cnt) * 100,256,32,32)


        Game.Txt.text({
            ctx: ctx,
            x: 64,
            y: 128,
            text: Game.fsm.current.toUpperCase() + " STATE",
            hspacing: 5,
            vspacing: 1,
            halign: 'top',
            valign: 'left',
            scale: 4,
            snap: 1,
            render: 1,
            glitchChance: .05,
            glitchFactor: 5
        });

        if(Game.Key.isDown(Game.Key.a)) {
            ctx.fillStyle = "#0000ff";
            if(Game.fsm.current == 'boot') Game.fsm.ready();
        }
        if(Game.Key.isDown(Game.Key.s)) {
            ctx.fillStyle = "#00ff00";
            if(Game.fsm.current == 'menu') Game.fsm.play();
        }
        if(Game.Key.isDown(Game.Key.d)) {
            ctx.fillStyle = "#ff0000";
            if(Game.fsm.current == 'game') Game.fsm.lose();
        }
        if(Game.Key.isDown(Game.Key.w)) {
            ctx.fillStyle = "#f0f";
            if(Game.fsm.current == 'gameover')Game.fsm.reset();
        }

        requestAnimationFrame(Game.loop);

    }



};

    Game.fsm.boot();

    //define our key event handlers
    (function(){
        window.addEventListener('keyup', function(event) {
            Game.Key.onKeyup(event);
        }, false);
    window.addEventListener('keydown', function(event) {
        Game.Key.onKeydown(event);
    }, false);
    })();

    return Game;

}();

Game.loop();




