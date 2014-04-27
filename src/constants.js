define(['jquery'], function($) {
    var constants = {
        tile_size: 32
        , exile_x: -100
        , exile_y: -100

        , win_score: 500000

        , top_pipe: 1
        , right_pipe: 2
        , bottom_pipe: 4
        , left_pipe: 8

        , layer_1_min: 100
        , layer_1_max: 150

        , layer_2_min: 200
        , layer_2_max: 300

        , mineral_rand: 0.1
        , layer_1_cutoff: 4
        , layer_2_cutoff: 8

        , lightblue_50_score: 0.50
        , lightblue_25_score: 0.25
        , magenta_50_score: 0.50
        , magenta_25_score: 0.25

        , cost_rig: 6000
        , cost_refinery: 20000
        , cost_pipe_per_level2: 100

        , store_start_y: 100

        , rate_$_per_second_lb: 81
        , rate_$_per_second_ma: 47
    };

    // 33% of screen width, divided by tile_size (drop remainder)
    constants['game_size_x'] = Math.floor($(window).width() / constants.tile_size) - 1;
    constants['game_size_y'] = Math.floor($(window).height() / constants.tile_size);

    constants['dirt_size_x'] = constants['game_size_x'];
    constants['dirt_size_y'] = 30;

    constants['dirt_start'] = Math.floor(constants['game_size_y'] * (0.5));

    constants['score_y'] = 0;
    constants['score_height'] = 30;

    return constants;
})