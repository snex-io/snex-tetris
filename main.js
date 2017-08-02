const manager = new TetrisManager(document);

snex.createSession()
.then(session => {
    session.on('connection', function(conn) {
        const tetris = manager.createPlayer();
        const player = tetris.player;

        conn.on('data', function(event) {
            if (event.state === 1) {
                if (event.key === 'LEFT') {
                    player.move(-1);
                } else if (event.key === 'RIGHT') {
                    player.move(1);
                } else if (event.key === 'B') {
                    player.rotate(-1);
                } else if (event.key === 'A') {
                    player.rotate(1);
                }
            }

            if (event.key === 'DOWN') {
                if (event.state === 1) {
                    if (player.dropInterval !== player.DROP_FAST) {
                        player.drop();
                        player.dropInterval = player.DROP_FAST;
                    }
                } else {
                    player.dropInterval = player.DROP_SLOW;
                }
            }
        });

        conn.on('close', function() {
            manager.removePlayer(tetris);
        });
    });

    return session.createURL('nes');
})
.then(({url}) => {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.textContent = url;
    window.url.innerHTML = '';
    window.url.appendChild(anchor);
});
