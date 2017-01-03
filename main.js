const PEER_KEY = '5m8blh25pbzc9pb9';

const manager = new TetrisManager(document);


const peer = new Peer({key: PEER_KEY});
peer.on('open', function(id) {
    let _url = 'http://snex.pomle.com/nes/'
        + '?key=' + PEER_KEY
        + '&id=' + id;

    fetch('/api/v1/link?url=' + encodeURIComponent(_url))
    .then(res => res.json())
    .then(payload => {
        if (payload.status_code === 200) {
            _url = payload.data.url;
        }
        const anchor = document.createElement('a');
        anchor.href = _url;
        anchor.textContent = _url;
        window.url.innerHTML = '';
        window.url.appendChild(anchor);
    });
});

peer.on('connection', function(conn) {
    const tetris = manager.createPlayer();
    const player = tetris.player;

    conn.on('open', function() {

    });

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
