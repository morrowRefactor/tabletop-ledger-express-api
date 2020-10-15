CREATE TABLE session_scores (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    session_id INTEGER 
        REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
    game_id INTEGER
        REFERENCES games(id) ON DELETE CASCADE NOT NULL,
    uid INTEGER
        REFERENCES users(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    name TEXT NOT NULL,
    winner BOOLEAN NOT NULL
);