CREATE TABLE user_badges_cat (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    uid INTEGER
        REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    badge_id INTEGER
        REFERENCES badges_cat(id) ON DELETE CASCADE NOT NULL
);