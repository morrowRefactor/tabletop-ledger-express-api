function makeUserGameCatLogsArray() {
    return [
        {
            id: 1,
            uid: 1,
            cat_id: 123,
            sessions: 5
        },
        {
            id: 2,
            uid: 1,
            cat_id: 234,
            sessions: 3
        },
        {
            id: 3,
            uid: 2,
            cat_id: 123,
            sessions: 10
        },
        {
            id: 4,
            uid: 3,
            cat_id: 345,
            sessions: 3
        },
        {
            id: 5,
            uid: 5,
            cat_id: 234,
            sessions: 9
        }
    ];
};

module.exports = {
    makeUserGameCatLogsArray
};