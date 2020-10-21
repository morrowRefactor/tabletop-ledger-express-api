function makeUserReccosArray() {
    return [
        {
            id: 1,
            uid: 1,
            game_id: 1,
            recco_game_id: 7,
            note: 'If you love Gloomhaven, I highly recommend Mechs vs Minions.'
        },
        {
            id: 2,
            uid: 3,
            game_id: 3,
            recco_game_id: 4,
            note: 'If you love Nemesis, I highly recommend Carcassonne.'
        },
        {
            id: 3,
            uid: 4,
            game_id: 8,
            recco_game_id: 9,
            note: 'If you love Spirit Island, I highly recommend Cthulhu: Death May Die.'
        },
        {
            id: 4,
            uid: 5,
            game_id: 2,
            recco_game_id: 7,
            note: 'If you love Last Bastion, I highly recommend Mechs vs Minions.'
        }
    ];
};

function makeMaliciousUserReccos() {
    const maliciousUserRecco = {
        id: 911,
        uid: 1,
        game_id: 1,
        recco_game_id: 1,
        note: 'Naughty naughty very naughty <script>alert("xss");</script>'
    };
    const expectedUserRecco = {
        ...maliciousUserRecco,
        uid: 1,
        game_id: 1,
        recco_game_id: 1,
        note: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;'
    };
    return {
        maliciousUserRecco,
        expectedUserRecco
    };
};

module.exports = {
    makeUserReccosArray,
    makeMaliciousUserReccos
};