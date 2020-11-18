ALTER TABLE sessions
    DROP COLUMN game_id;

ALTER TABLE session_scores
    DROP COLUMN game_id;

ALTER TABLE user_reccos
    DROP COLUMN game_id;

ALTER TABLE user_reccos
    DROP COLUMN recco_game_id;

ALTER TABLE user_games
    DROP COLUMN game_id;

ALTER TABLE game_tips
    DROP COLUMN game_id;

ALTER TABLE games_cat_matches
    DROP COLUMN game_id;

ALTER TABLE games_mech_matches
    DROP COLUMN game_id;

DROP TABLE IF EXISTS games; 