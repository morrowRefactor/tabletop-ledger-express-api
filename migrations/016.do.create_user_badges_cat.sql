CREATE TABLE user_badges_cat (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    uid INTEGER
        REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    badge_id INTEGER
        REFERENCES games_cat(cat_id) ON DELETE CASCADE NOT NULL,
    tier_id INTEGER
        REFERENCES badge_tiers(id) ON DELETE CASCADE NOT NULL
);