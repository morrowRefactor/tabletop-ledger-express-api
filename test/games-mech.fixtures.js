function makeMechGamesArray() {
    return [
        {
            id: 1,
            mech_id: 123,
            name: 'Cooperative'
        },
        {
            id: 2,
            mech_id: 234,
            name: 'Dungeon Crawler'
        },
        {
            id: 3,
            mech_id: 345,
            name: 'Worker Placement'
        }
    ];
};

function makeMaliciousMechGames() {
    const maliciousMechGame = {
        id: 911,
        mech_id: 123,
        name: 'Naughty naughty very naughty <script>alert("xss");</script>'
    };
    const expectedMechGame = {
        ...maliciousMechGame,
        uid: 1,
        mech_id: 123,
        name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;'
    };
    return {
        maliciousMechGame,
        expectedMechGame
    };
};

module.exports = {
    makeMechGamesArray,
    makeMaliciousMechGames
};