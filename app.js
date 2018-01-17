$(document).ready(function () {
    //on load 
    const width = 4;
    const images = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    const grid = $('#game-grid');

    var init_game = function () {

        let state = {
            // first : {card : undefined, value : undefined},
            first: undefined,
            tiles: images.concat(images),
            move_tally: 0,
            pairs_found: 0,
            time: 0,
            stars: 0
        };

        function shuffle(a) {
            for (let i = a.length - 1; i > 0; i -= 1) {
                const j = Math.floor(Math.random() * (i + 1));
                const temp = a[i];
                a[i] = a[j];
                a[j] = temp;
            }
        }

        //shuffle(state.tiles);


        grid.find('*').remove();
        $('#score').text(state.move_tally);
        $('#timer').text(state.time);

        function render_stars(stars) {
            const star_hollow = '\u2606';
            const star_filled = '\u2605';
            $('.stars').text(star_filled.repeat(state.stars) + star_hollow.repeat(3 - state.stars));
        }

        function update_stars() {
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
        }

        update_stars();
        render_stars(state.stars);

        function card_click(e) {
            const current = e.data;
            //don't do anything if card already flipped
            if (current.card.hasClass('flip')) {
                return;
            }

            current.card.addClass('flip');
            state.move_tally += 1;
            $('#score').text(state.move_tally);
            update_stars();
            render_stars(state.stars);

            if (state.first === undefined) {
                //first choice
                state.first = current;
            } else if (state.first != undefined) {
                //second choice
                if (state.tiles[current.value] === state.tiles[state.first.value]) {
                    //match found
                    state.pairs_found += 1;
                    //check if we have won
                    if (state.pairs_found === 8) {
                        $('#final-score').text(state.move_tally);
                        //stop the timer
                        clearInterval(timer_id);
                        $('#final-time').text(state.time);
                        $('.game-screen').hide();
                        $('.win-screen').show();
                    }
                } else {
                    //no match found
                    setTimeout(function (f) {
                        current.card.removeClass('flip');
                        f.removeClass('flip');

                    }, 1000, state.first.card);
                }
                state.first = undefined;
            }
        };

        let cell = 0;
        for (let row = 0; row < width; row += 1) {
            const tr = $('<tr></tr>');

            for (let col = 0; col < width; col += 1) {
                const src = "img/" + state.tiles[cell] + ".svg";
                const td = $('<td></td>');

                const flipper_container = $('<div class="flip-container">\
                    <div class="flipper">\
                    <div class="front"><img src="img/star.svg" alt=""></div>\
                        <div class="back"><img src="' + src + '" alt=""></div>\
                        </div>\
                    </div>');

                td.append(flipper_container);
                td.on('click', { card: flipper_container, value: cell }, card_click);
                tr.append(td);
                cell += 1;
            }
            grid.append(tr);
        }

        const timer_id = window.setInterval(function () {
            state.time += 1;
            $('#timer').text(state.time);
        }, 1000);
    };

    init_game();

    $('#restart-btn').on('click', function () {
        init_game();
        $('.win-screen').hide();
        $('.game-screen').show();

    });
});