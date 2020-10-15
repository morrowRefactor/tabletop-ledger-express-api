CREATE TABLE user_standings (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    uid INTEGER
        REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    wins INTEGER,
    losses INTEGER,
    sessions INTEGER
);