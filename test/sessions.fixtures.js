function makeSessionsArray() {
    return [
        {
            game_id: 1,
            uid: 2,
            date: '2020-08-25'
        },
        {
            game_id: 1,
            uid: 2,
            date: '2020-08-04'
        },
        {
            game_id: 1,
            uid: 2,
            date: '2020-07-29'
        },
        {
            game_id: 3,
            uid: 1,
            date: '2020-07-29'
        },
        {
            game_id: 3,
            uid: 4,
            date: '2020-09-02'
        },
        {
            game_id: 1,
            uid: 2,
            date: '2020-06-29'
        },
        {
            game_id: 1,
            uid: 4,
            date: '2020-06-30'
        },
        {
            game_id: 4,
            uid: 3,
            date: '2020-04-23'
        },
        {
            game_id: 7,
            uid: 5,
            date: '2020-06-01'
        },
        {
            game_id: 10,
            uid: 1,
            date: '2020-03-02'
        }
    ];
};

function makeSessionsWIDArray() {
    return [
        {
            id: 1,
            game_id: 1,
            uid: 2,
            date: '2020-08-25'
        },
        {
            id: 2,
            game_id: 1,
            uid: 2,
            date: '2020-08-04'
        },
        {
            id: 3,
            game_id: 1,
            uid: 2,
            date: '2020-07-29'
        },
        {
            id: 4,
            game_id: 3,
            uid: 1,
            date: '2020-07-29'
        },
        {
            id: 5,
            game_id: 3,
            uid: 4,
            date: '2020-09-02'
        },
        {
            id: 6,
            game_id: 1,
            uid: 2,
            date: '2020-06-29'
        },
        {
            id: 7,
            game_id: 1,
            uid: 4,
            date: '2020-06-30'
        },
        {
            id: 8,
            game_id: 4,
            uid: 3,
            date: '2020-04-23'
        },
        {
            id: 9,
            game_id: 7,
            uid: 5,
            date: '2020-06-01'
        },
        {
            id: 10,
            game_id: 10,
            uid: 1,
            date: '2020-03-02'
        }
    ]
};

module.exports = {
    makeSessionsArray,
    makeSessionsWIDArray
};