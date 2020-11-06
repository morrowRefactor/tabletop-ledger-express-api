function makeSessionsArray() {
    return [
        {
            game_id: 1,
            uid: 2,
            date: '2020-08-25',
            name: ''
        },
        {
            game_id: 1,
            uid: 2,
            date: '2020-08-04',
            name: 'Big game time!'
        },
        {
            game_id: 1,
            uid: 2,
            date: '2020-07-29',
            name: ''
        },
        {
            game_id: 3,
            uid: 1,
            date: '2020-07-29',
            name: 'The Punishment'
        },
        {
            game_id: 3,
            uid: 4,
            date: '2020-09-02',
            name: ''
        },
        {
            game_id: 1,
            uid: 2,
            date: '2020-06-29',
            name: ''
        },
        {
            game_id: 1,
            uid: 4,
            date: '2020-06-30',
            name: 'Super fun time'
        },
        {
            game_id: 4,
            uid: 3,
            date: '2020-04-23',
            name: ''
        },
        {
            game_id: 7,
            uid: 5,
            date: '2020-06-01',
            name: ''
        },
        {
            game_id: 10,
            uid: 1,
            date: '2020-03-02',
            name: ''
        }
    ];
};

function makeSessionsWIDArray() {
    return [
        {
            id: 1,
            game_id: 1,
            uid: 2,
            date: '2020-08-25',
            name: ''
        },
        {
            id: 2,
            game_id: 1,
            uid: 2,
            date: '2020-08-04',
            name: 'Big game time!'
        },
        {
            id: 3,
            game_id: 1,
            uid: 2,
            date: '2020-07-29',
            name: ''
        },
        {
            id: 4,
            game_id: 3,
            uid: 1,
            date: '2020-07-29',
            name: 'The Punishment'
        },
        {
            id: 5,
            game_id: 3,
            uid: 4,
            date: '2020-09-02',
            name: ''
        },
        {
            id: 6,
            game_id: 1,
            uid: 2,
            date: '2020-06-29',
            name: ''
        },
        {
            id: 7,
            game_id: 1,
            uid: 4,
            date: '2020-06-30',
            name: 'Super fun time'
        },
        {
            id: 8,
            game_id: 4,
            uid: 3,
            date: '2020-04-23',
            name: ''
        },
        {
            id: 9,
            game_id: 7,
            uid: 5,
            date: '2020-06-01',
            name: ''
        },
        {
            id: 10,
            game_id: 10,
            uid: 1,
            date: '2020-03-02',
            name: ''
        }
    ]
};

function makeMaliciousSession() {
    const maliciousSession = {
        game_id: 1,
        uid: 1,
        name: 'Naughty naughty very naughty <script>alert("xss");</script>',
        
    };
    const expectedSession = {
        ...maliciousSession,
        game_id: 1,
        uid: 1,
        name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    };
    return {
        maliciousSession,
        expectedSession
    };
};

module.exports = {
    makeSessionsArray,
    makeSessionsWIDArray,
    makeMaliciousSession
};