function makeUserStandingsArray() {
    return [
        {
            id: 1,
            uid: 1,
            wins: 3,
            losses: 1,
            sessions: 4
        },
        {
            id: 2,
            uid: 2,
            wins: 1,
            losses: 3,
            sessions: 4
        },
        {
            id: 3,
            uid: 3,
            wins: 0,
            losses: 1,
            sessions: 1
        },
        {
            id: 4,
            uid: 4,
            wins: 0,
            losses: 2,
            sessions: 2
        },
        {
            id: 5,
            uid: 5,
            wins: 0,
            losses: 1,
            sessions: 1
        }
    ]
};

module.exports = {
    makeUserStandingsArray
};