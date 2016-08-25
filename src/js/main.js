//todo: find some button render-logic code to steal.
//todo: profit




Game = function() {
    canvas = document.querySelector('#game');
    ctx = canvas.getContext('2d');
    ctx.fillStyle = "#0f0";

    var cnt = 0;

    var Game = {

        timestamp: function() {
            return new Date().getTime();
        },
        const: {
            GRID: 20,
            WIDTH: 30,
            HEIGHT: 30,
            P_SPEED: .01

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
                '.' : [
                    [0,0,0,0,0],
                    [0,0,0,0,0],
                    [0,0,0,0,0],
                    [0,0,0,0,0],
                    [0,0,1,0,0]

                ],
                '1': [
                    [0,1,1,0,0],
                    [0,0,1,0,0],
                    [0,0,1,0,0],
                    [0,0,1,0,0],
                    [1,1,1,1,1]

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
                    [1, , 1, , 1],
                    [, 1, , 1, 0],
                    [1, , 1, , 1],
                    [, 1, , 1, 0],
                    [1, , 1, , 1]
                ],
                'z': [
                    //empty first checkers
                    [, 1, , 1, 0],
                    [1, , 1, , 1],
                    [, 1, , 1, 0],
                    [1, , 1, , 1],
                    [, 1, , 1, 0]
                ],
                'o': [
                    //box with dot
                    [1, 1, 1, 1, 1],
                    [1, , , , 1],
                    [1, , 1, , 1],
                    [1, , , , 1],
                    [1, 1, 1, 1, 1]
                ],
                'e': [
                    //down-right slope
                    [1, 0, 0, 0, 0],
                    [1, 1, 0, 0, 0],
                    [1, 1, 1, 0, 0],
                    [1, 1, 1, 1, 0],
                    [1, 1, 1, 1, 1]
                ],
                'w': [
                    //right triangle
                    [0, 0, 0, 0, 1],
                    [0, 0, 0, 1, 1],
                    [0, 0, 1, 1, 1],
                    [0, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1]
                ],

            }

        },

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
            r: 82,

            isDown: function (keyCode) {
                return this._pressed[keyCode];
            },

            justReleased: function (keyCode) {
                return this._released[keyCode];
            },

            onKeydown: function (event) {
                this._pressed[event.keyCode] = true;
            },

            onKeyup: function (event) {
                this._released[event.keyCode] = true;
                delete this._pressed[event.keyCode];

            },

            update: function () {
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
                    var letter = Game.Assets.letters[( opt.text.charAt(i) )] || Game.assets.letters['unknown'];
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


            text: function (opt) {
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

        //sound remdering

        initAudio: function(){
        Game.sounds = {};
        Game.sounds.loaded = 0;
        Game.sounds.total = 1;
        window.AudioContext = window.AudioContext||window.webkitAudioContext;
        Game.audioCtx = new AudioContext;

        //G.soundGen = new G.Game.sonantx.SoundGenerator(G.audio.JUMP);
        //G.soundGen.createAudioBuffer(147+24, function(buffer) {
        //    G.sounds.loaded++;
        //    G.sounds.jump = buffer;
        //});
        console.log('rendering music');
        Game.song = new sonantx.MusicGenerator(Game.Assets.song);
        Game.song.createAudioBuffer(function(buffer) {
            var source = Game.audioCtx.createBufferSource();
            source.buffer = buffer;
            source.connect(Game.audioCtx.destination);
            source.start();
        });

    },



    fsm: StateMachine.create({
        initial: "init",

        events: [
            {name: 'load', from: 'init', to: 'boot'},
            {name: 'ready', from: 'boot', to: 'menu' },
            {name: 'play', from: 'menu', to: 'game' },
            {name: 'lose', from: 'game', to: 'gameover' },
            {name: 'reset', from: ['init','boot','menu','gameover','game'], to: 'boot'},
        ],

        callbacks: {
            onenterboot: function(event, from, to) { Game.states.boot.onenter(event, from, to) },
            onentergame: function(event, from, to) { Game.states.game.onenter(event, from, to) }
        }
    }, this),

    init: function(){
        Game.ALL= [];
        Game.fps = 60;
        Game.step = 1 / Game.fps;
        Game.dt = 0;
        Game.now = Game.timestamp();
        Game.last = Game.timestamp();
        console.log(Game.last);
        Game.loadProgress = 0;

        Game.fsm.load(); //dev skip load/menu state
        //Game.fsm.load();
        Game.loop();
    },



    loop: function() {

        Game.now = Game.timestamp();

        Game.dt = Game.dt + Math.min(1, (Game.now - Game.last) / 1000);
        //console.log(Game.dt + ' '+ Game.step);
        while (Game.dt > Game.step) {

            Game.dt = Game.dt - Game.step;
            Game.states[Game.fsm.current].update(Game.step);

        }
        Game.states[Game.fsm.current].render(Game.dt);
        G.last = G.now;

    requestAnimationFrame(Game.loop);

},

    Player: function() {

        body = new Game.Entity({
            radius: 10
        });
        body.setCoords(256,256);
        return {
            x: body.xx,
            y: body.yy,
            cooldown: 0,
            body: body,
            update: function(){
                body.update();
            }
        };
    },

    Enemy: function() {

    },

    states: {

        boot: {

            onenter: function() {
                if(!Game.sounds)Game.initAudio();
            },

            render: function(){
                ctx.clearRect(0,0,512,512);
                Game.Txt.text({
                    ctx: ctx,
                    x: 64,
                    y: 128,
                    text: "LOADING...",
                    hspacing: 5,
                    vspacing: 1,
                    halign: 'top',
                    valign: 'left',
                    scale: 2,
                    snap: 1,
                    render: 1,
                    glitchChance: .0,
                    glitchFactor: 0
                });

            },
            update: function(){

                if(Game.Key.isDown(Game.Key.r)) {
                    if(Game.fsm.current)Game.fsm.reset();
                }
                if(Game.Key.isDown(Game.Key.a)) {
                    if(Game.fsm.current == 'boot') Game.fsm.ready();
                }

            }

        },

        menu: {
            render: function(){

                ctx.clearRect(0,0,512,512);

                Game.Txt.text({
                    ctx: ctx,
                    x: 64,
                    y: 128,
                    text: "SUPER GLITCH BOX\nPRESS X TO CONTINUE",
                    hspacing: 5,
                    vspacing: 1,
                    halign: 'top',
                    valign: 'left',
                    scale: 4,
                    snap: 1,
                    render: 1,
                    glitchChance: .01,
                    glitchFactor: 2
                });
            },

            update: function(){
                if(Game.Key.isDown(Game.Key.r)) {
                    if(Game.fsm.current)Game.fsm.reset();
                }

                if(Game.Key.isDown(Game.Key.s)) {
                    ctx.fillStyle = "#00ff00";
                    if(Game.fsm.current == 'menu') Game.fsm.play();
                }
            }

        },

        game: {

            onenter: function(){

                if(!Game.player) {
                    Game.player = Game.Player();
                    Game.ALL.push(Game.player.body);
                }
            },

            render: function(){

                ctx.clearRect(0,0,512,512);

                Game.Txt.text({
                    ctx: ctx,
                    x: 64,
                    y: 64,
                    text: "GAMEY GAME GOES HERE",
                    hspacing: 5,
                    vspacing: 1,
                    halign: 'top',
                    valign: 'left',
                    scale: 4,
                    snap: 1,
                    render: 1,
                    glitchChance: .1,
                    glitchFactor: 3
                });

                //player render
                ctx.fillRect(
                    Game.player.body.xx-Game.player.body.radius,
                    Game.player.body.yy-Game.player.body.radius,
                    20,
                    20);



            },

            update: function(step){
                //reset from any state
                if(Game.Key.isDown(Game.Key.r)) {
                    if(Game.fsm.current)Game.fsm.reset();
                }
                //player movement
                if(Game.Key.isDown(Game.Key.LEFT) || Game.Key.isDown(Game.Key.a))
                {
                    Game.player.body.dx -= Game.const.P_SPEED * step;
                }
                else if(Game.Key.isDown(Game.Key.RIGHT) || Game.Key.isDown(Game.Key.d))
                {
                    Game.player.body.dx += Game.const.P_SPEED * step;
                }

                if(Game.Key.isDown(Game.Key.UP) || Game.Key.isDown(Game.Key.w))
                {
                    Game.player.body.dy -= Game.const.P_SPEED * step;
                }
                else if(Game.Key.isDown(Game.Key.DOWN) || Game.Key.isDown(Game.Key.s))
                {
                    Game.player.body.dy += Game.const.P_SPEED * step;
                }


                Game.player.update();

            }

        },

        gameover: {
            render: function(){

                ctx.clearRect(0,0,512,512);

                Game.Txt.text({
                    ctx: ctx,
                    x: 64,
                    y: 128,
                    text: "GAME OVER\nPRESS X TO PLAY AGAIN\nPRESS Z FOR MENU",
                    hspacing: 5,
                    vspacing: 5,
                    halign: 'top',
                    valign: 'left',
                    scale: 4,
                    snap: 1,
                    render: 1,
                    glitchChance: .01,
                    glitchFactor: 2
                });

            },
            update: function(){

                if(Game.Key.isDown(Game.Key.r)) {

                    if(Game.fsm.current)Game.fsm.reset();

                }
                if(Game.Key.isDown(Game.Key.w)){

                    if(Game.fsm.current == 'gameover')Game.fsm.play();

                }

            }

        },

    }

};

    //define our key event handlers
    (function(){
        window.addEventListener('keyup', function(event) {
            Game.Key.onKeyup(event);
        }, false);
    window.addEventListener('keydown', function(event) {
        Game.Key.onKeydown(event);
    }, false);
    })();


//Entity module
Entity:    (function() {


        Game.Entity = function(opt){

            if(!opt){
                opt = {
                    radius: 10,
                    gravity: 0,

                }
            }
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
            this.dead = opt.dead || 0;
            this.collides = opt.collides || 0;

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


    })();

    return Game;

}();

//SONANT-X sound and music synth
var sonantx;
(function() {
    //---------SONANT-X---------
    /*
     // Sonant-X
     //
     // Copyright (c) 2014 Nicolas Vanhoren
     //
     // Sonant-X is a fork of js-sonant by Marcus Geelnard and Jake Taylor. It is
     // still published using the same license (zlib license, see below).
     //
     // Copyright (c) 2011 Marcus Geelnard
     // Copyright (c) 2008-2009 Jake Taylor
     //
     // This software is provided 'as-is', without any express or implied
     // warranty. In no event will the authors be held liable for any damages
     // arising from the use of this software.
     //
     // Permission is granted to anyone to use this software for any purpose,
     // including commercial applications, and to alter it and redistribute it
     // freely, subject to the following restrictions:
     //
     // 1. The origin of this software must not be misrepresented; you must not
     //    claim that you wrote the original software. If you use this software
     //    in a product, an acknowledgment in the product documentation would be
     //    appreciated but is not required.
     //
     // 2. Altered source versions must be plainly marked as such, and must not be
     //    misrepresented as being the original software.
     //
     // 3. This notice may not be removed or altered from any source
     //    distribution.
     */

    "use strict";
    sonantx = {};

    var WAVE_SPS = 44100;                    // Samples per second
    var WAVE_CHAN = 2;                       // Channels
    var MAX_TIME = 33; // maximum time, in millis, that the generator can use consecutively

    var audioCtx = null;

// Oscillators
    function osc_sin(value)
    {
        return Math.sin(value * 6.283184);
    }

    function osc_square(value)
    {
        if(osc_sin(value) < 0) return -1;
        return 1;
    }

    function osc_saw(value)
    {
        return (value % 1) - 0.5;
    }

    function osc_tri(value)
    {
        var v2 = (value % 1) * 4;
        if(v2 < 2) return v2 - 1;
        return 3 - v2;
    }

// Array of oscillator functions
    var oscillators =
        [
            osc_sin,
            osc_square,
            osc_saw,
            osc_tri
        ];

    function getnotefreq(n)
    {
        return 0.00390625 * Math.pow(1.059463094, n - 128);
    }

    function genBuffer(waveSize, callBack) {
        setTimeout(function() {
            // Create the channel work buffer
            var buf = new Uint8Array(waveSize * WAVE_CHAN * 2);
            var b = buf.length - 2;
            var iterate = function() {
                var begin = new Date();
                var count = 0;
                while(b >= 0)
                {
                    buf[b] = 0;
                    buf[b + 1] = 128;
                    b -= 2;
                    count += 1;
                    if (count % 1000 === 0 && (new Date() - begin) > MAX_TIME) {
                        setTimeout(iterate, 0);
                        return;
                    }
                }
                setTimeout(function() {callBack(buf);}, 0);
            };
            setTimeout(iterate, 0);
        }, 0);
    }

    function applyDelay(chnBuf, waveSamples, instr, rowLen, callBack) {
        var p1 = (instr.fx_delay_time * rowLen) >> 1;
        var t1 = instr.fx_delay_amt / 255;

        var n1 = 0;
        var iterate = function() {
            var beginning = new Date();
            var count = 0;
            while(n1 < waveSamples - p1)
            {
                var b1 = 4 * n1;
                var l = 4 * (n1 + p1);

                // Left channel = left + right[-p1] * t1
                var x1 = chnBuf[l] + (chnBuf[l+1] << 8) +
                    (chnBuf[b1+2] + (chnBuf[b1+3] << 8) - 32768) * t1;
                chnBuf[l] = x1 & 255;
                chnBuf[l+1] = (x1 >> 8) & 255;

                // Right channel = right + left[-p1] * t1
                x1 = chnBuf[l+2] + (chnBuf[l+3] << 8) +
                    (chnBuf[b1] + (chnBuf[b1+1] << 8) - 32768) * t1;
                chnBuf[l+2] = x1 & 255;
                chnBuf[l+3] = (x1 >> 8) & 255;
                ++n1;
                count += 1;
                if (count % 1000 === 0 && (new Date() - beginning) > MAX_TIME) {
                    setTimeout(iterate, 0);
                    return;
                }
            }
            setTimeout(callBack, 0);
        };
        setTimeout(iterate, 0);
    }

    sonantx.AudioGenerator = function(mixBuf) {
        this.mixBuf = mixBuf;
        this.waveSize = mixBuf.length / WAVE_CHAN / 2;
    };
    sonantx.AudioGenerator.prototype.getWave = function() {
        var mixBuf = this.mixBuf;
        var waveSize = this.waveSize;
        // Local variables
        var b, k, x, wave, l1, l2, s, y;

        // Turn critical object properties into local variables (performance)
        var waveBytes = waveSize * WAVE_CHAN * 2;

        // Convert to a WAVE file (in a binary string)
        l1 = waveBytes - 8;
        l2 = l1 - 36;
        wave = String.fromCharCode(82,73,70,70,
            l1 & 255,(l1 >> 8) & 255,(l1 >> 16) & 255,(l1 >> 24) & 255,
            87,65,86,69,102,109,116,32,16,0,0,0,1,0,2,0,
            68,172,0,0,16,177,2,0,4,0,16,0,100,97,116,97,
            l2 & 255,(l2 >> 8) & 255,(l2 >> 16) & 255,(l2 >> 24) & 255);
        b = 0;
        while(b < waveBytes)
        {
            // This is a GC & speed trick: don't add one char at a time - batch up
            // larger partial strings
            x = "";
            for (k = 0; k < 256 && b < waveBytes; ++k, b += 2)
            {
                // Note: We amplify and clamp here
                y = 4 * (mixBuf[b] + (mixBuf[b+1] << 8) - 32768);
                y = y < -32768 ? -32768 : (y > 32767 ? 32767 : y);
                x += String.fromCharCode(y & 255, (y >> 8) & 255);
            }
            wave += x;
        }
        return wave;
    };
    sonantx.AudioGenerator.prototype.getAudio = function() {
        var wave = this.getWave();
        var a = new Audio("data:audio/wav;base64," + btoa(wave));
        a.preload = "none";
        a.load();
        return a;
    };
    sonantx.AudioGenerator.prototype.getAudioBuffer = function(callBack) {
        if (audioCtx === null)
            audioCtx = new AudioContext();
        var mixBuf = this.mixBuf;
        var waveSize = this.waveSize;

        var waveBytes = waveSize * WAVE_CHAN * 2;
        var buffer = audioCtx.createBuffer(WAVE_CHAN, this.waveSize, WAVE_SPS); // Create Mono Source Buffer from Raw Binary
        var lchan = buffer.getChannelData(0);
        var rchan = buffer.getChannelData(1);
        var b = 0;
        var iterate = function() {
            var beginning = new Date();
            var count = 0;
            while (b < (waveBytes / 2)) {
                var y = 4 * (mixBuf[b * 4] + (mixBuf[(b * 4) + 1] << 8) - 32768);
                y = y < -32768 ? -32768 : (y > 32767 ? 32767 : y);
                lchan[b] = y / 32768;
                y = 4 * (mixBuf[(b * 4) + 2] + (mixBuf[(b * 4) + 3] << 8) - 32768);
                y = y < -32768 ? -32768 : (y > 32767 ? 32767 : y);
                rchan[b] = y / 32768;
                b += 1;
                count += 1;
                if (count % 1000 === 0 && new Date() - beginning > MAX_TIME) {
                    setTimeout(iterate, 0);
                    return;
                }
            }
            setTimeout(function() {callBack(buffer);}, 0);
        };
        setTimeout(iterate, 0);
    };

    sonantx.SoundGenerator = function(instr, rowLen) {
        this.instr = instr;
        this.rowLen = rowLen || 5605;

        this.osc_lfo = oscillators[instr.lfo_waveform];
        this.osc1 = oscillators[instr.osc1_waveform];
        this.osc2 = oscillators[instr.osc2_waveform];
        this.attack = instr.env_attack;
        this.sustain = instr.env_sustain;
        this.release = instr.env_release;
        this.panFreq = Math.pow(2, instr.fx_pan_freq - 8) / this.rowLen;
        this.lfoFreq = Math.pow(2, instr.lfo_freq - 8) / this.rowLen;
    };
    sonantx.SoundGenerator.prototype.genSound = function(n, chnBuf, currentpos) {
        var marker = new Date();
        var c1 = 0;
        var c2 = 0;

        // Precalculate frequencues
        var o1t = getnotefreq(n + (this.instr.osc1_oct - 8) * 12 + this.instr.osc1_det) * (1 + 0.0008 * this.instr.osc1_detune);
        var o2t = getnotefreq(n + (this.instr.osc2_oct - 8) * 12 + this.instr.osc2_det) * (1 + 0.0008 * this.instr.osc2_detune);

        // State variable init
        var q = this.instr.fx_resonance / 255;
        var low = 0;
        var band = 0;
        for (var j = this.attack + this.sustain + this.release - 1; j >= 0; --j)
        {
            var k = j + currentpos;

            // LFO
            var lfor = this.osc_lfo(k * this.lfoFreq) * this.instr.lfo_amt / 512 + 0.5;

            // Envelope
            var e = 1;
            if(j < this.attack)
                e = j / this.attack;
            else if(j >= this.attack + this.sustain)
                e -= (j - this.attack - this.sustain) / this.release;

            // Oscillator 1
            var t = o1t;
            if(this.instr.lfo_osc1_freq) t += lfor;
            if(this.instr.osc1_xenv) t *= e * e;
            c1 += t;
            var rsample = this.osc1(c1) * this.instr.osc1_vol;

            // Oscillator 2
            t = o2t;
            if(this.instr.osc2_xenv) t *= e * e;
            c2 += t;
            rsample += this.osc2(c2) * this.instr.osc2_vol;

            // Noise oscillator
            if(this.instr.noise_fader) rsample += (2*Math.random()-1) * this.instr.noise_fader * e;

            rsample *= e / 255;

            // State variable filter
            var f = this.instr.fx_freq;
            if(this.instr.lfo_fx_freq) f *= lfor;
            f = 1.5 * Math.sin(f * 3.141592 / WAVE_SPS);
            low += f * band;
            var high = q * (rsample - band) - low;
            band += f * high;
            switch(this.instr.fx_filter)
            {
                case 1: // Hipass
                    rsample = high;
                    break;
                case 2: // Lopass
                    rsample = low;
                    break;
                case 3: // Bandpass
                    rsample = band;
                    break;
                case 4: // Notch
                    rsample = low + high;
                    break;
                default:
            }

            // Panning & master volume
            t = osc_sin(k * this.panFreq) * this.instr.fx_pan_amt / 512 + 0.5;
            rsample *= 39 * this.instr.env_master;

            // Add to 16-bit channel buffer
            k = k * 4;
            if (k + 3 < chnBuf.length) {
                var x = chnBuf[k] + (chnBuf[k+1] << 8) + rsample * (1 - t);
                chnBuf[k] = x & 255;
                chnBuf[k+1] = (x >> 8) & 255;
                x = chnBuf[k+2] + (chnBuf[k+3] << 8) + rsample * t;
                chnBuf[k+2] = x & 255;
                chnBuf[k+3] = (x >> 8) & 255;
            }
        }
    };
    sonantx.SoundGenerator.prototype.getAudioGenerator = function(n, callBack) {
        var bufferSize = (this.attack + this.sustain + this.release - 1) + (32 * this.rowLen);
        var self = this;
        genBuffer(bufferSize, function(buffer) {
            self.genSound(n, buffer, 0);
            applyDelay(buffer, bufferSize, self.instr, self.rowLen, function() {
                callBack(new sonantx.AudioGenerator(buffer));
            });
        });
    };
    sonantx.SoundGenerator.prototype.createAudio = function(n, callBack) {
        this.getAudioGenerator(n, function(ag) {
            callBack(ag.getAudio());
        });
    };
    sonantx.SoundGenerator.prototype.createAudioBuffer = function(n, callBack) {
        this.getAudioGenerator(n, function(ag) {
            ag.getAudioBuffer(callBack);
        });
    };

    sonantx.MusicGenerator = function(song) {
        this.song = song;
        // Wave data configuration
        this.waveSize = WAVE_SPS * song.songLen; // Total song size (in samples)
    };
    sonantx.MusicGenerator.prototype.generateTrack = function (instr, mixBuf, callBack) {
        var self = this;
        genBuffer(this.waveSize, function(chnBuf) {
            // Preload/precalc some properties/expressions (for improved performance)
            var waveSamples = self.waveSize,
                waveBytes = self.waveSize * WAVE_CHAN * 2,
                rowLen = self.song.rowLen,
                endPattern = self.song.endPattern,
                soundGen = new sonantx.SoundGenerator(instr, rowLen);

            var currentpos = 0;
            var p = 0;
            var row = 0;
            var recordSounds = function() {
                var beginning = new Date();
                while (true) {
                    if (row === 32) {
                        row = 0;
                        p += 1;
                        continue;
                    }
                    if (p === endPattern - 1) {
                        setTimeout(delay, 0);
                        return;
                    }
                    var cp = instr.p[p];
                    if (cp) {
                        var n = instr.c[cp - 1].n[row];
                        if (n) {
                            soundGen.genSound(n, chnBuf, currentpos);
                        }
                    }
                    currentpos += rowLen;
                    row += 1;
                    if (new Date() - beginning > MAX_TIME) {
                        setTimeout(recordSounds, 0);
                        return;
                    }
                }
            };

            var delay = function() {
                applyDelay(chnBuf, waveSamples, instr, rowLen, finalize);
            };

            var b2 = 0;
            var finalize = function() {
                var beginning = new Date();
                var count = 0;
                // Add to mix buffer
                while(b2 < waveBytes)
                {
                    var x2 = mixBuf[b2] + (mixBuf[b2+1] << 8) + chnBuf[b2] + (chnBuf[b2+1] << 8) - 32768;
                    mixBuf[b2] = x2 & 255;
                    mixBuf[b2+1] = (x2 >> 8) & 255;
                    b2 += 2;
                    count += 1;
                    if (count % 1000 === 0 && (new Date() - beginning) > MAX_TIME) {
                        setTimeout(finalize, 0);
                        return;
                    }
                }
                setTimeout(callBack, 0);
            };
            setTimeout(recordSounds, 0);
        });
    };
    sonantx.MusicGenerator.prototype.getAudioGenerator = function(callBack) {
        var self = this;
        genBuffer(this.waveSize, function(mixBuf) {
            var t = 0;
            var recu = function() {
                if (t < self.song.songData.length) {
                    t += 1;
                    self.generateTrack(self.song.songData[t - 1], mixBuf, recu);
                } else {
                    callBack(new sonantx.AudioGenerator(mixBuf));
                }
            };
            recu();
        });
    };
    sonantx.MusicGenerator.prototype.createAudio = function(callBack) {
        this.getAudioGenerator(function(ag) {
            callBack(ag.getAudio());
        });
    };
    sonantx.MusicGenerator.prototype.createAudioBuffer = function(callBack) {
        this.getAudioGenerator(function(ag) {
            ag.getAudioBuffer(callBack);
        });
    };
})();
//---------END SONANT-X-----






Game.init();




