CREATE TABLE games_cat (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    cat_id INTEGER UNIQUE NOT NULL,
    name TEXT NOT NULL
);