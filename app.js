function shuffle(a) {
    for (let i = a.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = a[i];
        a[i] = a[j];
        a[j] = temp;
    }
}

//cards can be in two states - flpped not flipped
//they can also be in two other states in-play or complete
//user interacts in two ways - picking either first card, or second card

$(document).ready(function () {
    //on load 
    const width = 4;
    const cells = width * width;
    const images = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    let tiles = images.concat(images);

    const grid = $('#game-grid');

    let first;
    let first_cell;

    var init_game = function () {

        //shuffle(tiles);

        let move_tally = 0;
        let pairs_found = 0;
        let time = 0;
        let stars = 0;

        grid.find('*').remove();
        $('#score').text(move_tally);
        $('#timer').text(time);

        function render_stars(stars) {
            const star_hollow = '\u2606';
            const star_filled = '\u2605';
            $('.stars').text(star_filled.repeat(stars) + star_hollow.repeat(3 - stars));
        }

        function update_stars() {
            //to get three stars you need a score of 16 - perfect
            //to get two stars you need to complete it in 24 moves,
            //anything else is one star
            if (move_tally <= 16) {
                stars = 3;
            } else if (move_tally <= 24) {
                stars = 2;
            } else {
                stars = 1;
            }
        }

        update_stars();
        render_stars(stars);

        let cell = 0;
        for (let row = 0; row < width; row += 1) {
            const tr = $('<tr></tr>');

            for (let col = 0; col < width; col += 1) {
                const src = "img/" + tiles[cell] + ".svg";
                const td = $('<td></td>');

                const flipper_container = $('<div class="flip-container">\
                    <div class="flipper">\
                    <div class="front"><img src="img/star.svg" alt=""></div>\
                        <div class="back"><img src="' + src + '" alt=""></div>\
                        </div>\
                    </div>');

                td.append(flipper_container);

                td.on('click', { cell: cell }, function (e) {

                    const this_cell = e.data.cell;
                    //don't do anything if card already flipped
                    if (flipper_container.hasClass('flip')) {
                        return;
                    }

                    flipper_container.addClass('flip');
                    if (first === undefined) {
                        //first choice
                        first = flipper_container;
                        first_cell = this_cell;
                    } else if (first != undefined) {
                        //second choice
                        if (tiles[this_cell] === tiles[first_cell]) {
                            //match found
                            //                        first = undefined;
                            //                      first_cell = undefined;
                            pairs_found += 1;
                            //check if we have won
                            if (pairs_found === 8) {
                                console.log("You win!");
                                $('#final-score').text(move_tally);
                                //stop the timer
                                clearInterval(timer_id);
                                $('#final-time').text(time);
                                $('.game-screen').hide();
                                $('.win-screen').show();
                            }
                        } else {
                            //no match found
                            setTimeout(function (f) {
                                flipper_container.removeClass('flip');
                                f.removeClass('flip');

                            }, 1000, first);
                        }
                        first = undefined;
                        first_cell = undefined;

                    }
                    move_tally += 1;
                    $('#score').text(move_tally);
                    update_stars();
                    render_stars(stars);
                });

                tr.append(td);
                cell += 1;

            }
            grid.append(tr);
        }

        const timer_id = window.setInterval(function () {
            time += 1;
            $('#timer').text(time);
        }, 1000);
    };


    init_game();

    $('#restart-btn').on('click', function () {
        init_game();
        $('.win-screen').hide();
        $('.game-screen').show();

    });
});