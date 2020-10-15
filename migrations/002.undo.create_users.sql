ALTER TABLE sessions
    DROP COLUMN uid;

ALTER TABLE session_scores
    DROP COLUMN uid;

ALTER TABLE session_notes
    DROP COLUMN uid;

ALTER TABLE user_reccos
    DROP COLUMN uid;

ALTER TABLE user_games
    DROP COLUMN uid;

ALTER TABLE game_tips
    DROP COLUMN uid;

ALTER TABLE user_badges_mech
    DROP COLUMN uid;

ALTER TABLE user_badges_cat
    DROP COLUMN uid;

ALTER TABLE user_standings
    DROP COLUMN uid;

DROP TABLE IF EXISTS users; 