const bcrypt = require('bcryptjs');

function makeUsersArray() {
    return [
        {
            id: 1,
            name: 'John Doe',
            about: 'I am a gaming enthusiast',
            password: 'Something12!',
            joined_date: '2020-01-22'
        },
        {
            id: 2,
            name: 'Jane Doe',
            about: 'I am a gaming enthusiast',
            password: 'Something12!',
            joined_date: '2020-03-02'
        },
        {
            id: 3,
            name: 'Joe Thornton',
            about: 'I am a gaming enthusiast',
            password: 'Something12!',
            joined_date: '2020-09-24'
        },
        {
            id: 4,
            name: 'Brent Burns',
            about: 'I am a gaming enthusiast',
            password: 'Something12!',
            joined_date: '2020-04-07'
        },
        {
            id: 5,
            name: 'Patrick Marleau',
            about: 'I am a gaming enthusiast',
            password: 'Something12!',
            joined_date: '2020-06-11'
        }
    ];
};

function makeUsersSansPassArray() {
    return [
        {
            id: 1,
            name: 'John Doe',
            about: 'I am a gaming enthusiast',
            joined_date: '2020-01-22'
        },
        {
            id: 2,
            name: 'Jane Doe',
            about: 'I am a gaming enthusiast',
            joined_date: '2020-03-02'
        },
        {
            id: 3,
            name: 'Joe Thornton',
            about: 'I am a gaming enthusiast',
            joined_date: '2020-09-24'
        },
        {
            id: 4,
            name: 'Brent Burns',
            about: 'I am a gaming enthusiast',
            joined_date: '2020-04-07'
        },
        {
            id: 5,
            name: 'Patrick Marleau',
            about: 'I am a gaming enthusiast',
            joined_date: '2020-06-11'
        }
    ];
};

function makeMaliciousUser() {
    const maliciousUser = {
        id: 911,
        name: 'Naughty naughty very naughty <script>alert("xss");</script>',
        about: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
        password: 'Something12!',
        joined_date: '2020-04-22'
    };
    const expectedUser = {
        ...maliciousUser,
        name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        about: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
        joined_date: '2020-04-22'
    };
    return {
        maliciousUser,
        expectedUser
    };
};

function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
      ...user,
      password: bcrypt.hashSync(user.password, 1)
    }))
    return db.into('users').insert(preppedUsers)
      .then(() =>
        // update the auto sequence to stay in sync
        db.raw(
          `SELECT setval('users_id_seq', ?)`,
          [users[users.length - 1].id],
        )
      )
};

module.exports = {
    makeUsersArray,
    makeUsersSansPassArray,
    makeMaliciousUser,
    seedUsers
};