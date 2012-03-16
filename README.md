Node cluster.fork process manager prototype
-------------------------------------------

This is a sample of using Node.js's `cluster.fork()` function to spawn workers based on several processes, rather than the simple example of spawning one identical worker per CPU thread.

Before using `fork` in this way, you should consider if it's actually superior. For example, suppose you have an app which should listen for two different unrelated types of messages, so clearly you can process the messages simultaneously. You could certainly use this example for it. Or, you could write a server that listens for either type of message, and launch two instances of it with `cluster.fork()`.

Now suppose you run this app on a dual core server, so each fork can take full advantage of its own core. Then the server is flooded with one type of message. If you fork once per type of message (as this example app does), one core will have to process all of those messages by itself - the other core will be specialized to its own type of message and will be idling. On the other hand, if you write it according to example (where both forks have identical logic, listening for either type of message and handling it), the load will be evenly distributed between the two cores.

One exception involves the data sharing between these instances of node. If you have services which are not, for example, sharing data via a database, then that might be a good use for this example code. In the simple case of a dumb server that receives a request, responds to it, and closes the connection, there is no state between requests and they can be handled by any instance of node interchangeably. But if there is any state among connections, clearly this state must be shared among all the connections, therefore they must all be handled by one instance of node. This may be a case where this example comes in handy; you should decide this on a case to case basis.

In conclusion, depending on your app you might find this example useful. However, for most node apps I've seen, **I don't recommend actually following this example**. Instead, just write one set of logic that handles all the different things you want your server to do, and then fork it once per CPU thread. This would appear to take optimal advantage of the server hardware.
