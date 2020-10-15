CREATE TABLE game_tips (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    uid INTEGER
        REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    game_id INTEGER
        REFERENCES games(id) ON DELETE CASCADE NOT NULL,
    tip TEXT NOT NULL
);