Memory.js is the class creating chatBubbles

The memory web component starts of by checking local storage if there is a username set, if there isn't it will prompt you with a window asking
you to set a username, no more than one window is allowed to be opened during this time to prevent bugs
when a username is set it is added to local storage to be used later.

The web component connects to the webSocket, it then sets messages up accourding to this object:

const message = {
      type: 'message',
      data: 'The message text is sent using the data property',
      username: 'MyFancyUsername',
      channel: 'my, not so secret, channel',
      key: 'no lookie :<'
    }

where data is the message, username the username etc

data is collected from the input of type text, when the submit button is pressed
channel is collected when the message is sent, but also each time you do a input to it
username is gathered from local storage

when a message is recieved (also when its sent since it detects your own messages as a recived message)
the component will do the following checks:

check if the recieved message is the same as the clients channel, or if the clients channel is set to "all"
make sure the message isn't a heartbeat

when this is done, the component will create a new element of the type chatBubble, which is a component of it own,
then setting the attributes data and username, that will be turnt into strings in the message bubble before its appended inside the chat area

I was thinking about adding a encyption method, to encrypt the messages and only have them be decrypted by checking if the channel is the same,
encrypting and decrypting with the channel name as a sort of key, but i didnt have the time.