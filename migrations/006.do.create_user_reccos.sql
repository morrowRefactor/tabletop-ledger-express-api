CREATE TABLE user_reccos (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    uid INTEGER
        REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    game_id INTEGER
        REFERENCES games(id) ON DELETE CASCADE NOT NULL,
    recco_game_id INTEGER
        REFERENCES games(id) ON DELETE CASCADE NOT NULL,
    note TEXT
);