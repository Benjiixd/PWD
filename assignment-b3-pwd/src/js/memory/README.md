Memory is the biggest garbage i have ever created
I hate it with my entire soul.
It barely makes sense to me at this point, so it's understandable if it doesnt make sense to the reviewer

The memory component works like this:

Since the shadow DOMS of the custom element cards dont want to communicate with neither the board or the other cards, i used global variables
for them to communicate.

since i want to have multiple sub apps be abled to be played, i couldn't use simple ex booleans, since they would communicate with other windows.
This is done by when a memory sub app is opened, it's given a parent attribute, the parent attribute is a value, so that when i want to assign a global variable, it is stored in a array with the same index as the parent value, so the board also gives it's parent value to the cards, so all cards have the same parent value as the board so they can communicate. When custom events are sent out, they always include the parent, to make sure that the board doesn't respond if it recieves an event from another memory sub-app.

Through this way the cards can communicate with each other and the board.

When the cards are created, they are created with a color, and a id, the id makes sure that the two cards can match, by comparing their id.
I could probably have used the color, but oh well.

And yeah thats the main point, the rest is pretty well explained in the code comments