function makeUserGamesArray() {
    return [
        {
            id: 1,
            uid: 1,
            game_id: 1,
            own: true,
            favorite: 1,
            rating: '9.0',
            notes: 'My favorite game of all time'
        },
        {
            id: 2,
            uid: 1,
            game_id: 3,
            own: true,
            favorite: 2,
            rating: '8.6',
            notes: ''
        },
        {
            id: 3,
            uid: 1,
            game_id: 6,
            own: false,
            favorite: 3,
            rating: '8.5',
            notes: `Don't own this one yet, but its on my list`
        },
        {
            id: 4,
            uid: 2,
            game_id: 8,
            own: true,
            favorite: 1,
            rating: '9.0',
            notes: 'great game'
        },
        {
            id: 5,
            uid: 2,
            game_id: 9,
            own: true,
            favorite: 2,
            rating: '8.0',
            notes: 'All time great'
        },
        {
            id: 6,
            uid: 2,
            game_id: 1,
            own: true,
            favorite: 3,
            rating: '9.0',
            notes: 'All time great'
        },
        {
            id: 7,
            uid: 2,
            game_id: 2,
            own: true,
            favorite: 4,
            rating: '8.0',
            notes: 'good stuff'
        },
        {
            id: 8,
            uid: 2,
            game_id: 5,
            own: true,
            favorite: 5,
            rating: '8.0',
            notes: 'so much fun'
        }
    ];
};

function makeMaliciousUserGames() {
    const maliciousUserGame = {
        id: 911,
        uid: 1,
        game_id: 1,
        own: true,
        favorite: 1,
        rating: '9.0',
        notes: 'Naughty naughty very naughty <script>alert("xss");</script>'
    };
    const expectedUserGame = {
        ...maliciousUserGame,
        uid: 1,
        game_id: 1,
        own: true,
        favorite: 1,
        rating: '9.0',
        notes: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;'
    };
    return {
        maliciousUserGame,
        expectedUserGame
    };
};

module.exports = {
    makeUserGamesArray,
    makeMaliciousUserGames
};