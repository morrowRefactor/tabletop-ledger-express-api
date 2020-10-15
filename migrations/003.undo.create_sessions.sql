ALTER TABLE session_scores
    DROP COLUMN session_id
;

ALTER TABLE session_notes
    DROP COLUMN session_id
;

DROP TABLE IF EXISTS sessions;
