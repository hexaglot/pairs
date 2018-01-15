$(document).ready(function () {
    //on load 
    const width = 4;
    const cells = width * width;
    const images = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const shuffled = images.concat(images);
    const grid = $('#game-grid');
    let first;
    let first_cell;
    let move_tally = 0;
    let pairs_found = 0;

    grid.find('*').remove();

    let cell = 0;
    for (let row = 0; row < width; row += 1) {
        const tr = $('<tr></tr>');

        for (let col = 0; col < width; col += 1) {
            const src = "img/" + shuffled[cell] + ".svg";
            const img = $('<img class="" src="' + src + '" alt="g">');
            const td = $('<td></td>');
            img.hide()
            td.append(img);

            td.on('click', {cell : cell}, function (e) {
                const this_cell = e.data.cell;
                console.log(move_tally);
                if (first === undefined) {
                    img.show();
                    first = img;
                    first_cell = this_cell;
                    move_tally += 1;
                } else {
                    if (img !== first) {
                        img.show();
                        move_tally += 1;
                        if (shuffled[this_cell] === shuffled[first_cell]) {
                            console.log('pair found!');
                            console.log(shuffled[this_cell] + "=" + shuffled[first_cell]);
                            pairs_found += 1;
                            first = undefined;
                            first_cell = undefined;
                            if(pairs_found === width * 2) {
                                console.log('game over!');
                            }
                        } else {
                            window.setTimeout(function () {
                                first.hide();
                                first = undefined;
                                first_cell = undefined;
                                img.hide();
                            }, 1000);
                        }

                    }

                }
            })
            tr.append(td);
            cell += 1;
        }
        grid.append(tr);
    }

})