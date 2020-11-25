ALTER TABLE games_cat_matches
    DROP COLUMN cat_id;

ALTER TABLE user_game_cat_logs
    DROP COLUMN cat_id;

DROP TABLE IF EXISTS games_cat;