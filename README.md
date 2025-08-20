# Chess

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.1.6.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## To Do:

1. castling
2. promotion
-- draw, win, history etc
3. server (all)
4. modal users/chat - the diff is logged in users - same background component
5. modal chat - do modal and connect
6. light/dark ui
7. themes


linear-gradient( 140deg, oklch(69.02% .277 332.77) 0%, oklch(69.02% .277 332.77) 15%, color-mix(in srgb, oklch(69.02% .277 332.77), oklch(53.18% .28 296.97) 50%) 25%, color-mix(in srgb, oklch(69.02% .277 332.77), oklch(53.18% .28 296.97) 10%) 35%, color-mix(in srgb, oklch(69.02% .277 332.77), oklch(63.32% .24 31.68) 50%) 42%, color-mix(in srgb, oklch(69.02% .277 332.77), oklch(63.32% .24 31.68) 50%) 44%, color-mix(in srgb, oklch(69.02% .277 332.77), white 70%) 47%, oklch(53.18% .28 296.97) 48%, oklch(51.01% .274 263.83) 60% )

how long: user control. also 50% time for first 10 (20) moves with warning,
also x for first (40) moves and y for rest with user control.
warning can be client and server/ client shut down the websocket afterwards.

server user:
refresh token - (1 day) (1 or 2?)
active token (15 min)
logged token (15 min)
user info (logged User): name, picture, score, date joined.
user info (guest): token of joined (name and picture can be both at the client and the server)
other stuff:  at entering the website we send a token and wait to game requests (active user)
at logging we wait to chat requests (logged user), get prev messages. if we recieve game request user must answer within a minute (yes/no)
else active token & logged token to trash
at server if user is (handling request) then return handeling request, automaticly resend wakeup if short lived token is more then halfway through 
use websockets - http requests are not proper here
RxJS WebSocketSubject or ng-websocket. For basic usage, the built-in WebSocket

main, board handles websocket recieved messages. 

chat, confirmaton request, board send messages.
schema: 
main
    navbar -
            request game 
                        player details
                        confirmation (move?)
            login
            signup
            social (chat and see other users)
                chat
    if (game)
    board - game tracker
            player details
            ++ game? chat (for opponent)
    else 
        request game
TODO:
light/dark ui
search (all)
signup google/facebook
chat during game
rest of chess rules
themes

server:
-active user:Active UserModel 
-logged in user - logged in user model
tokens active + refresh
themes - for logged in users

active game
-users white, black, board etc.

game history
: players + score + time?

-messages: 
to, from, date, message id