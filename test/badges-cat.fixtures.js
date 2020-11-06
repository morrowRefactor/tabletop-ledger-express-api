function makeCatBadgesArray() {
    return [
        {
            id: 1,
            name: 'Adventure beginner'
        },
        {
            id: 2,
            name: 'Adventure intermediate'
        },
        {
            id: 3,
            name: 'Adventure expert'
        },
        {
            id: 4,
            name: 'City building beginner'
        },
        {
            id: 5,
            name: 'City building intermediate'
        },
        {
            id: 6,
            name: 'City building expert'
        },
        {
            id: 7,
            name: 'Deduction beginner'
        },
        {
            id: 8,
            name: 'Deduction intermediate'
        },
        {
            id: 9,
            name: 'Deduction expert'
        }
    ];
};

function makeMaliciousCatBadges() {
    const maliciousCatBadge = {
        id: 911,
        name: 'Naughty naughty very naughty <script>alert("xss");</script>'
    };
    const expectedCatBadge = {
        ...maliciousCatBadge,
        uid: 1,
        name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;'
    };
    return {
        maliciousCatBadge,
        expectedCatBadge
    };
};

module.exports = {
    makeCatBadgesArray,
    makeMaliciousCatBadges
};