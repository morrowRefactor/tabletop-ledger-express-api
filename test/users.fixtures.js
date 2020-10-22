function makeUsersArray() {
    return [
        {
            id: 1,
            name: 'John Doe',
            about: 'I am a gaming enthusiast',
            password: 'something',
            joined_date: '2020-01-22'
        },
        {
            id: 2,
            name: 'Jane Doe',
            about: 'I am a gaming enthusiast',
            password: 'something',
            joined_date: '2020-03-02'
        },
        {
            id: 3,
            name: 'Joe Thornton',
            about: 'I am a gaming enthusiast',
            password: 'something',
            joined_date: '2020-09-24'
        },
        {
            id: 4,
            name: 'Brent Burns',
            about: 'I am a gaming enthusiast',
            password: 'something',
            joined_date: '2020-04-07'
        },
        {
            id: 5,
            name: 'Patrick Marleau',
            about: 'I am a gaming enthusiast',
            password: 'something',
            joined_date: '2020-06-11'
        }
    ];
};

function makeMaliciousUser() {
    const maliciousUser = {
        id: 911,
        name: 'Naughty naughty very naughty <script>alert("xss");</script>',
        about: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
        password: 'Naughty naughty very naughty <script>alert("xss");</script>',
        joined_date: '2020-04-22'
    };
    const expectedUser = {
        ...maliciousUser,
        name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        about: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
        password: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        joined_date: '2020-04-22'
    };
    return {
        maliciousUser,
        expectedUser
    };
};

module.exports = {
    makeUsersArray,
    makeMaliciousUser
};