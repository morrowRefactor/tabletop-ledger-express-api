CREATE TABLE sessions (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    game_id INTEGER 
        REFERENCES games(id) ON DELETE CASCADE NOT NULL,
    uid INTEGER 
        REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    date DATE DEFAULT CURRENT_DATE NOT NULL,
    name TEXT
);