function makeGameTipsArray() {
    return [
        {
            id: 1,
            uid: 1,
            game_id: 1,
            tip: 'Always do X before Y'
        },
        {
            id: 2,
            uid: 3,
            game_id: 1,
            tip: 'Never do X. Bad idea'
        },
        {
            id: 3,
            uid: 5,
            game_id: 3,
            tip: `Sometimes it's best to do X`
        },
        {
            id: 4,
            uid: 5,
            game_id: 10,
            tip: 'Always do X before Y'
        }
    ];
};

function makeMaliciousGameTips() {
    const maliciousGameTip = {
        id: 911,
        uid: 1,
        game_id: 1,
        tip: 'Naughty naughty very naughty <script>alert("xss");</script>'
    };
    const expectedGameTip = {
        ...maliciousGameTip,
        uid: 1,
        game_id: 1,
        tip: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;'
    };
    return {
        maliciousGameTip,
        expectedGameTip
    };
};

module.exports = {
    makeGameTipsArray,
    makeMaliciousGameTips
};