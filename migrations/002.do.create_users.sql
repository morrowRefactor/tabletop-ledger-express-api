CREATE TABLE users (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name TEXT NOT NULL,
    about TEXT,
    joined_date DATE DEFAULT CURRENT_DATE NOT NULL,
    password TEXT NOT NULL
);