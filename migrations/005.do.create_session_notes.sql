CREATE TABLE session_notes (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    session_id INTEGER 
        REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
    uid INTEGER
        REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    note TEXT NOT NULL
);