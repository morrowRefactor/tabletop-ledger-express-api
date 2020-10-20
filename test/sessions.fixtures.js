function makeSessionsArray() {
    return [
        {
            id: 1,
            game_id: 1,
            uid: 2,
            date: new Date('2020-08-25T16:28:32.615Z').toISOString('en', { timeZone: 'UTC' })
        },
        {
            id: 2,
            game_id: 1,
            uid: 2,
            date: new Date('2020-08-04T16:28:32.615Z').toISOString('en', { timeZone: 'UTC' })
        },
        {
            id: 3,
            game_id: 1,
            uid: 2,
            date: new Date('2020-07-29T16:28:32.615Z').toISOString('en', { timeZone: 'UTC' })
        },
        {
            id: 4,
            game_id: 3,
            uid: 1,
            date: new Date('2020-07-29T16:28:32.615Z').toISOString('en', { timeZone: 'UTC' })
        },
        {
            id: 5,
            game_id: 3,
            uid: 4,
            date: new Date('2020-09-02T16:28:32.615Z').toISOString('en', { timeZone: 'UTC' })
        },
        {
            id: 6,
            game_id: 1,
            uid: 2,
            date: new Date('2020-06-29T16:28:32.615Z').toISOString('en', { timeZone: 'UTC' })
        },
        {
            id: 7,
            game_id: 1,
            uid: 4,
            date: new Date('2020-06-30T16:28:32.615Z').toISOString('en', { timeZone: 'UTC' })
        },
        {
            id: 8,
            game_id: 4,
            uid: 3,
            date: new Date('2020-04-23T16:28:32.615Z').toISOString('en', { timeZone: 'UTC' })
        },
        {
            id: 9,
            game_id: 7,
            uid: 5,
            date: new Date('2020-06-01T16:28:32.615Z').toISOString('en', { timeZone: 'UTC' })
        },
        {
            id: 10,
            game_id: 10,
            uid: 1,
            date: new Date('2020-03-02T16:28:32.615Z').toISOString('en', { timeZone: 'UTC' })
        }
    ];
};

module.exports = {
    makeSessionsArray
};