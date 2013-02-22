#ninja-pong

Ninja Pong Code Camp

# UDP Server Demo

```
+-----------------------------------+=~
| Player console                    | Server console
+-----------------------------------+=~
|                                   | jeff:ninja-pong $ node example
|                                   | Starting game...
|                                   | Starting UDP server...
|                                   | Server listening on 127.0.0.1:8001
|                                   | UDP server started.
| jeff:~ $ nc -u4 localhost 8001    | Game started!
| 1                                 | Client Manager: handling new message from 127.0.0.1:64645, Message length: 2 bytes
|                                   | Client Manager: adding new client: 127.0.0.1:64645
|                                   | New player: 127001:64645
|                                   | Client[127.0.0.1:64645] Message: 2 bytes
|                                   | Action from player: 127001:64645: 1
| 0.74635                           | Client Manager: handling new message from 127.0.0.1:64645, Message length: 8 bytes
|                                   | Client[127.0.0.1:64645] Message: 8 bytes
|                                   | Action from player: 127001:64645: 0.74635
| 0.6122                            | Client Manager: handling new message from 127.0.0.1:64645, Message length: 7 bytes
|                                   | Client[127.0.0.1:64645] Message: 7 bytes
|                                   | Action from player: 127001:64645: 0.6122
| -0.81662387                       | Client Manager: handling new message from 127.0.0.1:64645, Message length: 12 bytes
|                                   | Client[127.0.0.1:64645] Message: 12 bytes
|                                   | Action from player: 127001:64645: -0.81662387
| kill                              | Client Manager: handling new message from 127.0.0.1:64645, Message length: 5 bytes
|                                   | Client[127.0.0.1:64645] Message: 5 bytes
|                                   | Action from player: 127001:64645: kill
|                                   | Stopping game...
|                                   | Client Manager: removing client: 127.0.0.1:64645                                    
|                                   | Client[127.0.0.1:64645] connection closed.                                          
|                                   | Player left: 127001:64645                                                           
|                                   | Game end :(                                                                         
|                                   | jeff:ninja-pong $ _
+-----------------------------------+=~
```