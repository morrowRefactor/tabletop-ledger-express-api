function makeMechBadgesArray() {
    return [
        {
            id: 1,
            name: 'Co-op beginner'
        },
        {
            id: 2,
            name: 'Co-op intermediate'
        },
        {
            id: 3,
            name: 'Co-op expert'
        },
        {
            id: 4,
            name: 'Dungeon Crawl beginner'
        },
        {
            id: 5,
            name: 'Dungeon Crawl intermediate'
        },
        {
            id: 6,
            name: 'Dungeon Crawl expert'
        },
        {
            id: 7,
            name: 'Worker placement beginner'
        },
        {
            id: 8,
            name: 'Worker placement intermediate'
        },
        {
            id: 9,
            name: 'Worker placement expert'
        }
    ];
};

function makeMaliciousMechBadges() {
    const maliciousMechBadge = {
        id: 911,
        name: 'Naughty naughty very naughty <script>alert("xss");</script>'
    };
    const expectedMechBadge = {
        ...maliciousMechBadge,
        uid: 1,
        name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;'
    };
    return {
        maliciousMechBadge,
        expectedMechBadge
    };
};

module.exports = {
    makeMechBadgesArray,
    makeMaliciousMechBadges
};