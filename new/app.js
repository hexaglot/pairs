(function () {
    //the DOM elements we need
    //game screen
    const $grid = $('#game-grid');
    const $stars = $('.stars');
    const $score = $('.score');
    const $timer = $('.time');
    //win screen
    const $final_score = $('.final-score');
    const $final_time = $('.final-time');
    const $final_stars = $('.final-stars');
    //both
    const $pairs_container = $('.pairs-container');
    //there are two restart buttons
    const $restart_buttons = $('.restart');
    //pages
    const $all_pages = $('.page');
    const $win_screen = $('.win-screen.page');
    const $game_screen = $('.game-screen.page');


    //this will hold all game state, initialised later
    let state = {};

    function shuffle(a) {
        for (let i = a.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = a[i];
            a[i] = a[j];
            a[j] = temp;
        }
    }

    function render_game() {
        //update the game hud. Timer is updated here and in the timeout function for simplicity
        $score.text(state.move_tally);
        $timer.text(state.timer.time);

        //to get three stars you need a score of 16 - perfect
        //to get two stars you need to complete it in 24 moves,
        //anything else is one star
        if (state.move_tally <= 16) {
            state.stars = 3;
        } else if (state.move_tally <= 24) {
            state.stars = 2;
        } else {
            state.stars = 1;
        }

        const star_hollow = '\u2606';
        const star_filled = '\u2605';

        state.stars_string = star_filled.repeat(state.stars) + star_hollow.repeat(3 - state.stars);

        $stars.text(state.stars_string);
    }

    function card_click(event) {
        const current = event.data;
        //don't do anything if card already flipped or if
        //cards are still shown which can be confusing to player
        if (!state.clicks_allowed || current.$card.hasClass('flipped')) {
            return;
        }

        current.$card.addClass('flipped');
        state.move_tally += 1;
        render_game();

        if (!state.first) {
            //first choice
            state.first = current;
        } else {
            //second choice
            if (current.value === state.first.value) {
                //match found
                state.pairs_found_tally += 1;
                current.$card.addClass('correct');
                state.first.$card.addClass('correct');
                //check if we have won
                if (state.pairs_found_tally === state.total_pairs) {
                    $final_score.text(state.move_tally);
                    //stop the timer
                    state.timer.running = false;
                    $final_time.text(state.timer.time);
                    $final_stars.text(state.stars_string);
                    $all_pages.addClass('hidden');
                    $win_screen.removeClass('hidden')
                }
            } else {
                //no match found
                state.clicks_allowed = false;
                $pairs_container.removeClass('clicks-allowed');
                setTimeout(function ($first_card) {
                    current.$card.removeClass('flipped');
                    $first_card.removeClass('flipped');
                    state.clicks_allowed = true;
                    $pairs_container.addClass('clicks-allowed');
                }, 1000, state.first.$card);
            }
            state.first = null;
        }
    };

    var init_game = function () {

        state = {
            first: null, //{$card : , value : }
            move_tally: 0,
            pairs_found_tally: 0,
            total_pairs: null,
            timer: { time: 0, running: true },
            stars: 0,
            stars_string: "",
            clicks_allowed: true
        };

        const card_values = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        let deck = card_values.concat(card_values);
        state.total_pairs = deck.length / 2;
        shuffle(deck);

        //clear the game grid and refill
        $grid.find('*').remove();
        deck.forEach(function (value) {
            const $card_container = $('<div class="card-container"></div>');
            const $card = $('<div class="card"></div>');
            const $front = $('<div class="front"></div>');
            const $back = $('<div class="back card-' + value + '"></div>');

            $card.on('click', { $card: $card, value: value }, card_click);
            $grid.append($card_container.append($card.append($front, $back)));
        })

        render_game();
    };

    $(document).ready(function () {
        //on load
        init_game();

        //install the resart button handler
        $restart_buttons.on('click', function () {
            init_game();
            $all_pages.addClass('hidden');
            $game_screen.removeClass('hidden');
        });
        
        //install the flip function for the sample cards in the intro-screen
        $('.sample-card .card').on('click', function () {
            $(this).toggleClass('flipped');
        });

        //install the timer function
        window.setInterval(function () {
            //only update if the timer is set to running
            if (state.timer.running) {
                state.timer.time += 1;
            }
            $timer.text(state.timer.time);
        }, 1000);
    });

}());


