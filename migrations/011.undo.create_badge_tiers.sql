ALTER TABLE user_badges_mech
    DROP COLUMN tier_id;

ALTER TABLE user_badges_cat
    DROP COLUMN tier_id;

DROP TABLE IF EXISTS badge_tiers;