const bcrypt = require('bcryptjs');

function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 6)
    }));

    return db.into('users').insert(preppedUsers)
        .then(() =>
        // update the auto sequence to stay in sync
            db.raw(
                `SELECT setval('users_id_seq', ?)`,
                [users[users.length - 1].id],
            )
    );
};

module.exports = {
    seedUsers
};