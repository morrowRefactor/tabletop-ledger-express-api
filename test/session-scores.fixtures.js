function makeSessionScoresArray() {
    return [
        {
            id: 1,
            session_id: 1,
            game_id: 1,
            uid: 2,
            score: '100',
            name: 'Jane Doe',
            winner: true
        },
        {
            id: 2,
            session_id: 1,
            game_id: 1,
            uid: null,
            score: '85',
            name: 'Some Guy',
            winner: false
        },
        {
            id: 3,
            session_id: 1,
            game_id: 1,
            uid: 3,
            score: '91',
            name: 'Joe Thornton',
            winner: false
        },
        {
            id: 4,
            session_id: 2,
            game_id: 1,
            uid: 2,
            score: '77',
            name: 'Jane Doe',
            winner: false
        },
        {
            id: 5,
            session_id: 2,
            game_id: 1,
            uid: null,
            score: '88',
            name: 'Steve Smith',
            winner: true
        },
        {
            id: 6,
            session_id: 4,
            game_id: 3,
            uid: 1,
            score: '97',
            name: 'John Doe',
            winner: true
        },
        {
            id: 7,
            session_id: 4,
            game_id: 3,
            uid: 5,
            score: '67',
            name: 'Patrick Marleau',
            winner: false
        },
        {
            id: 8,
            session_id: 4,
            game_id: 3,
            uid: null,
            score: '77',
            name: 'Some Lady',
            winner: false
        },
        {
            id: 9,
            session_id: 10,
            game_id: 10,
            uid: 1,
            score: '47',
            name: 'John Doe',
            winner: false
        },
        {
            id: 10,
            session_id: 10,
            game_id: 10,
            uid: null,
            score: '97',
            name: 'Some Guy',
            winner: true
        },
        {
            id: 11,
            session_id: 10,
            game_id: 10,
            uid: null,
            score: '84',
            name: 'Some Lady',
            winner: false
        }
    ];
};

function makeMaliciousSessionScores() {
    const maliciousSessionScore = [{
        id: 911,
        session_id: 1,
        game_id: 1,
        uid: null,
        score: '11',
        name: 'Naughty naughty very naughty <script>alert("xss");</script>',
        winner: true
    }];
    const expectedSessionScore = [{
        ...maliciousSessionScore,
        session_id: 1,
        game_id: 1,
        uid: null,
        score: '11',
        name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        winner: true
    }];
    return {
        maliciousSessionScore,
        expectedSessionScore
    };
};

module.exports = {
    makeSessionScoresArray,
    makeMaliciousSessionScores
};