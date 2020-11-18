ALTER TABLE games_mech_matches
    DROP COLUMN mech_id;

ALTER TABLE user_game_mech_logs
    DROP COLUMN mech_id;

DROP TABLE IF EXISTS games_mech; 