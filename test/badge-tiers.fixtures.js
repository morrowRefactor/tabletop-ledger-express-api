function makeBadgeTiersArray() {
    return [
        {
            id: 1,
            name: 'Beginner'
        },
        {
            id: 2,
            name: 'Intermediate'
        },
        {
            id: 3,
            name: 'Expert'
        }
    ];
};

function makeMaliciousBadgeTiers() {
    const maliciousBadgeTier = {
        id: 911,
        name: 'Naughty naughty very naughty <script>alert("xss");</script>'
    };
    const expectedBadgeTier = {
        ...maliciousBadgeTier,
        uid: 1,
        name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;'
    };
    return {
        maliciousBadgeTier,
        expectedBadgeTier
    };
};

module.exports = {
    makeBadgeTiersArray,
    makeMaliciousBadgeTiers
};