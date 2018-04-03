# An implementation of the card game concentration.

[Play the game here](https://hexaglot.github.io/pairs/)
This is a simple game of concentration using jquery and css grid.

Using grid wasn't really needed in this case as a table would be just as good. I
wanted to try using it though and eneded up keeping it in. I took a bit of care
to add a few touches such as the (rather goofy) animations and stopping the user
clicking whilst the cards were flippping.

The CSS could be cleaned up slightly - grid could be exploited better now I know
a bit more about it, particularly by paying more attention to sizes. Using
javascript for the animations would have been better - CSS can only get you so
far. A bit more polish could be done on the intro and celebration screen - most
of the groundwork is there but the actual font choices, colors and animations
are actually quite dull and don't encourage the user to press start game.

JQuery probably isnt needed - its only used to get element refeernces and add
click handlers.

The graphics were taken from "http://www.freepik.com" and given the attribution
as asked for on that site.

Useful resources in implementing the card flip, and the ice cream animations at
the end. - https://desandro.github.io/3dtransforms/ https://estelle.github.io/cssmastery/

