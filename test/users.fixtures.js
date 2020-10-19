function makeUsersArray() {
    return [
        {
            id: 1,
            name: 'John Doe',
            about: 'I am a gaming enthusiast',
            password: 'something',
            joined_date: new Date('2020-01-22T16:28:32.615Z').toISOString('en', { timeZone: 'UTC' })
        },
        {
            id: 2,
            name: 'Jane Doe',
            about: 'I am a gaming enthusiast',
            password: 'something',
            joined_date: new Date('2020-03-02T16:28:32.615Z').toISOString('en', { timeZone: 'UTC' })
        },
        {
            id: 3,
            name: 'Joe Thornton',
            about: 'I am a gaming enthusiast',
            password: 'something',
            joined_date: new Date('2020-09-24T16:28:32.615Z').toISOString('en', { timeZone: 'UTC' })
        },
        {
            id: 4,
            name: 'Brent Burns',
            about: 'I am a gaming enthusiast',
            password: 'something',
            joined_date: new Date('2020-04-07T16:28:32.615Z').toISOString('en', { timeZone: 'UTC' })
        },
        {
            id: 5,
            name: 'Patrick Marleau',
            about: 'I am a gaming enthusiast',
            password: 'something',
            joined_date: new Date('2020-06-11T16:28:32.615Z').toISOString('en', { timeZone: 'UTC' })
        }
    ];
};

function makeMaliciousUser() {
    const maliciousUser = {
        id: 911,
        name: 'Naughty naughty very naughty <script>alert("xss");</script>',
        about: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
        password: 'Naughty naughty very naughty <script>alert("xss");</script>',
        joined_date: new Date('2020-04-22T16:28:32.615Z').toISOString('en', { timeZone: 'UTC' })
    };
    const expectedUser = {
        ...maliciousUser,
        name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        about: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
        password: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        joined_date: new Date('2020-04-22T16:28:32.615Z').toISOString('en', { timeZone: 'UTC' })
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