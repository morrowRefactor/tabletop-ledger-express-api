function makeCatBadgesArray() {
    return [
        {
            id: 1,
            cat_id: 1234,
            name: 'Adventure beginner'
        },
        {
            id: 2,
            cat_id: 1234,
            name: 'Adventure intermediate'
        },
        {
            id: 3,
            cat_id: 1234,
            name: 'Adventure expert'
        },
        {
            id: 4,
            cat_id: 1234,
            name: 'City building beginner'
        },
        {
            id: 5,
            cat_id: 1234,
            name: 'City building intermediate'
        },
        {
            id: 6,
            cat_id: 1234,
            name: 'City building expert'
        },
        {
            id: 7,
            cat_id: 1234,
            name: 'Deduction beginner'
        },
        {
            id: 8,
            cat_id: 1234,
            name: 'Deduction intermediate'
        },
        {
            id: 9,
            cat_id: 1234,
            name: 'Deduction expert'
        }
    ];
};

function makeMaliciousCatBadges() {
    const maliciousCatBadge = {
        id: 911,
        cat_id: 1234,
        name: 'Naughty naughty very naughty <script>alert("xss");</script>'
    };
    const expectedCatBadge = {
        ...maliciousCatBadge,
        uid: 1,
        cat_id: 1234,
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