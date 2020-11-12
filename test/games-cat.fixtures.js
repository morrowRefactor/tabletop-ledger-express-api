function makeCatGamesArray() {
    return [
        {
            id: 1,
            cat_id: 123,
            name: 'Adventure'
        },
        {
            id: 2,
            cat_id: 234,
            name: 'City Building'
        },
        {
            id: 3,
            cat_id: 345,
            name: 'Deduction'
        }
    ];
};

function makeMaliciousCatGames() {
    const maliciousCatGame = [{
        id: 911,
        cat_id: 123,
        name: 'Naughty naughty very naughty <script>alert("xss");</script>'
    }];
    const expectedCatGame = [{
        ...maliciousCatGame,
        uid: 1,
        cat_id: 123,
        name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;'
    }];
    return {
        maliciousCatGame,
        expectedCatGame
    };
};

module.exports = {
    makeCatGamesArray,
    makeMaliciousCatGames
};