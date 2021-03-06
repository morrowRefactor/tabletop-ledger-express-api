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

ALTER TABLE user_game_cat_logs
    DROP COLUMN uid;

ALTER TABLE user_game_mech_logs
    DROP COLUMN uid;

DROP TABLE IF EXISTS users; 

ALTER TABLE session_scores
    DROP COLUMN session_id
;

ALTER TABLE session_notes
    DROP COLUMN session_id
;

DROP TABLE IF EXISTS sessions;

DROP TABLE IF EXISTS session_scores;

DROP TABLE IF EXISTS session_notes;

DROP TABLE IF EXISTS user_reccos;

DROP TABLE IF EXISTS user_games;

DROP TABLE IF EXISTS game_tips;

ALTER TABLE user_badges_mech
    DROP COLUMN badge_id;

DROP TABLE IF EXISTS badges_mech;

ALTER TABLE user_badges_cat
    DROP COLUMN badge_id;

DROP TABLE IF EXISTS badges_cat;

ALTER TABLE user_badges_mech
    DROP COLUMN tier_id;

ALTER TABLE user_badges_cat
    DROP COLUMN tier_id;

DROP TABLE IF EXISTS badge_tiers;

DROP TABLE IF EXISTS user_badges_mech;

DROP TABLE IF EXISTS user_badges_cat;

DROP TABLE IF EXISTS user_standings;

ALTER TABLE games_cat_matches
    DROP COLUMN cat_id;

ALTER TABLE user_game_cat_logs
    DROP COLUMN cat_id;

DROP TABLE IF EXISTS games_cat; 

ALTER TABLE games_mech_matches
    DROP COLUMN mech_id;

ALTER TABLE user_game_mech_logs
    DROP COLUMN mech_id;

DROP TABLE IF EXISTS games_mech; 

DROP TABLE IF EXISTS games_cat_matches;

DROP TABLE IF EXISTS games_mech_matches;

DROP TABLE IF EXISTS user_game_cat_logs;

DROP TABLE IF EXISTS user_game_mech_logs;

DROP TABLE IF EXISTS schemaversion;