INSERT INTO games (title, bgg_id, bgg_rating, description, image)
  VALUES
    ('Gloomhaven', 174430, 8.2, 'Gloomhaven  is a game of Euro-inspired tactical combat in a persistent world of shifting motives. Players will take on the role of a wandering adventurer with their own special set of skills and their own reasons for traveling to this dark corner of the world.', 'https://cf.geekdo-images.com/original/img/lDN358RgcYvQfYYN6Oy2TXpifyM=/0x0/pic2437871.jpg'),
    ('Last Bastion', 285984, 8.1, 'A handful of heroes have just stolen the powerful relics of the Baleful Queen. Without them, the immortal sovereign is weakened; recovering them is now her sole purpose.', 'https://cf.geekdo-images.com/original/img/JKYwSt8a2tcBYG20Oom7Rebth_Y=/0x0/pic4882123.png'),
    ('Nemesis', 167355, 7.8, 'Playing Nemesis will take you into the heart of sci-fi survival horror in all its terror. A soldier fires blindly down a corridor, trying to stop the alien advance. A scientist races to find a solution in his makeshift lab. A traitor steals the last escape pod in the very last moment.', 'https://cf.geekdo-images.com/original/img/fOgLH666aTUqwnhtZjSGH4-XJ8U=/0x0/pic5073276.jpg'),
    ('Carcassonne', 822, 7.7, 'Carcassonne is a tile-placement game in which the players draw and place a tile with a piece of southern French landscape on it. The tile might feature a city, a road, a cloister, grassland or some combination thereof, and it must be placed adjacent to tiles that have already been played, in such a way that cities are connected to cities, roads to roads, etcetera.', 'https://cf.geekdo-images.com/original/img/o4p6f88SGE899BTNMzTvERVWZ-M=/0x0/pic2337577.jpg'),
    ('Atlantis Rising', 248490, 7.5, 'Atlantis Rising is a co-operative worker placement game in which you must work together with up to five other players to deploy citizens across your homeland, gathering resources in order to build a cosmic gate that can save your people.', 'https://cf.geekdo-images.com/original/img/L9MTX-jaDgKZ-0Ml8xZG4pHicWU=/0x0/pic4895878.jpg'),
    ('Zombicide: Black Plague', 176189, 8.2, 'Zombicide: Black Plague takes the zombie apocalypse into a fantastical medieval setting! The arcane powers of the Necromancers have unleashed a zombie invasion in the age of swords and sorcery, and it''s up to your group of straggling survivors to not only stay alive during these dark times', 'https://cf.geekdo-images.com/original/img/WhHdMb8GiMY-RhHddEByDyPkrWo=/0x0/pic3184103.jpg'),
    ('Mechs vs Minions', 209010, 8.2, 'Mechs vs. Minions is a cooperative tabletop campaign for 2-4 players. Set in the world of Runeterra, players take on the roles of four intrepid Yordles: Corki, Tristana, Heimerdinger, and Ziggs, who must join forces and pilot their newly-crafted mechs against an army of marauding minions.', 'https://cf.geekdo-images.com/original/img/L9MTX-jaDgKZ-0Ml8xZG4pHicWU=/0x0/pic4895878.jpg'),
    ('Spirit Island', 162886, 8.2, 'In the most distant reaches of the world, magic still exists, embodied by spirits of the land, of the sky, and of every natural thing. As the great powers of Europe stretch their colonial empires further and further, they will inevitably lay claim to a place where spirits still hold power - and when they do, the land itself will fight back alongside the islanders who live there.', 'https://cf.geekdo-images.com/original/img/RmP2yBDA0LE-ZFWrEXAkgRuYjn0=/0x0/pic3615739.png'),
    ('Cthulhu: Death May Die', 253344, 8.0, 'In Cthulhu: Death May Die, inspired by the writings of H.P. Lovecraft, you and your fellow players represent investigators in the 1920s who instead of trying to stop the coming of Elder Gods, want to summon those otherworldly beings so that you can put a stop to them permanently.', 'https://cf.geekdo-images.com/original/img/tVhbvCp1Vlqi6zy4uR_-Z1NIVfg=/0x0/pic4705171.jpg'),
    ('Dominion', 142131, 8.1, 'Dominion, the popular strategy card game now comes to you in this massive combination pack jammed full of the best boxed sets, additional cards and extras.', 'https://cf.geekdo-images.com/original/img/KJ90XVwavBtGvNdptuETteLeNbI=/0x0/pic874537.jpg')
;

INSERT INTO users (name, about, joined_date, password) 
    VALUES
        ('John Doe', 'I am a gaming enthusiast', '2020-05-05', 'something'),
        ('Jane Doe', 'I am a gaming enthusiast', '2020-01-04', 'something'),
        ('Joe Thornton', 'I am a gaming enthusiast', '2020-06-11', 'something'),
        ('Brent Burns', 'I am a gaming enthusiast', '2020-10-10', 'something'),
        ('Patrick Marleau', 'I am a gaming enthusiast', '2020-07-30', 'something')
;

INSERT INTO sessions (game_id, uid, date, name)
    VALUES
        (1, 2, '2020-08-25', ''),
        (1, 2, '2020-08-04', 'That game'),
        (1, 2, '2020-07-29', ''),
        (3, 1, '2020-07-29', 'Great game today'),
        (3, 4, '2020-09-02', ''),
        (1, 2, '2020-06-29', ''),
        (1, 4, '2020-06-30', ''),
        (4, 3, '2020-04-23', 'Redemption'),
        (7, 5, '2020-06-01', ''),
        (10, 1, '2020-03-02', '')
;

INSERT INTO session_scores (session_id, game_id, uid, score, name, winner)
    VALUES
        (1, 1, 2, 100, 'Jane Doe', true),
        (1, 1, null, 85, 'Some Guy', false),
        (1, 1, 3, 91, 'Joe Thornton', false),
        (2, 1, 2, 77, 'Jane Doe', false),
        (2, 1, null, 88, 'Steve Smith', true),
        (4, 3, 1, 97, 'John Doe', true),
        (4, 3, 5, 67, 'Patrick Marleau', false),
        (4, 3, null, 77, 'Some Lady', false),
        (10, 10, 1, 47, 'John Doe', false),
        (10, 10, null, 97, 'Some Guy', true),
        (10, 10, null, 84, 'Some Lady', false)
;

INSERT INTO session_notes (session_id, uid, note)
    VALUES
        (1, 1, 'I did X and it gave me an extra 20 points.'),
        (1, 3, 'john had a great game. I missed my window of opportunity'),
        (4, 5, 'My first game.  Fun, but I have a lot to learn!'),
        (4, 1, 'Patrick''s first game.  He did great!  We''ll keep playing more sessions.'),
        (2, 2, 'Another fun time!')
;

INSERT INTO user_reccos (uid, game_id, recco_game_id, note)
    VALUES
        (1, 1, 7, 'If you love Gloomhaven, I highly recommend Mechs vs Minions.'),
        (3, 3, 4, 'If you love Nemesis, I highly recommend Carcassonne.'),
        (4, 8, 9, 'If you love Spirit Island, I highly recommend Cthulhu: Death May Die.'),
        (5, 2, 7, 'If you love Last Bastion, I highly recommend Mechs vs Minions.')
;

INSERT INTO user_games (uid, game_id, own, favorite, rating, notes)
    VALUES
        (1, 1, true, 1, 9.0, 'My favorite game of all time'),
        (1, 3, true, 2, 8.6, null),
        (1, 6, false, 3, 8.5, 'Don''t own this one yet, but it''s on my list'),
        (2, 8, true, 1, 9.0, 'great game'),
        (2, 9, true, 2, 8.0, 'all time great'),
        (2, 1, true, 3, 9.0, 'all time great'),
        (2, 2, true, 4, 8.0, 'good stuff'),
        (2, 5, true, 5, 8.0, 'so much fun')
;

INSERT INTO game_tips (uid, game_id, tip)
    VALUES
        (1, 1, 'Always do X before Y'),
        (3, 1, 'Never do X.  Bad idea'),
        (5, 3, 'Sometimes it''s best to do X'),
        (5, 10, 'Always do X before Y')
;

INSERT INTO badges_mech (name)
    VALUES
        ('Co-op beginner'),
        ('Co-op intermediate'),
        ('Co-op expert'),
        ('Dungeon crawl beginner'),
        ('Dungeon crawl intermediate'),
        ('Dungeon crawl expert'),
        ('Worker placement beginner'),
        ('Worker placement intermediate'),
        ('Worker placement expert')
;

INSERT INTO badges_cat (name)
    VALUES
        ('Adventure beginner'),
        ('Adventure intermediate'),
        ('Adventure expert'),
        ('City building beginner'),
        ('City building intermediate'),
        ('City building expert'),
        ('Deduction beginner'),
        ('Deduction intermediate'),
        ('Deduction expert')
;

INSERT INTO badge_tiers (name)
    VALUES
        ('Beginner'),
        ('Intermediate'),
        ('Expert')
;

INSERT INTO user_badges_mech (uid, badge_id, tier_id)
    VALUES
        (1, 3, 1),
        (1, 5, 3),
        (2, 6, 2),
        (2, 7, 3),
        (5, 5, 1),
        (4, 1, 3)
;

INSERT INTO user_badges_cat (uid, badge_id, tier_id)
    VALUES
        (1, 2, 3),
        (1, 6, 1),
        (3, 1, 2),
        (4, 7, 2),
        (5, 4, 3),
        (2, 5, 1)
;

INSERT INTO user_standings (uid, wins, losses, sessions) 
    VALUES
        (1, 3, 1, 4),
        (2, 1, 3, 4),
        (3, 0, 1, 1),
        (4, 0, 2, 2),
        (5, 0, 1, 1)
;

INSERT INTO games_cat (cat_id, name)
    VALUES
        (123, 'Adventure'),
        (234, 'City Building'),
        (345, 'Deduction')
;

INSERT INTO games_mech (mech_id, name)
    VALUES
        (123, 'Cooperative'),
        (234, 'Dungeon Crawler'),
        (345, 'Worker Placement')
;

INSERT INTO games_cat_matches (game_id, cat_id)
    VALUES
        (1, 123),
        (3, 123),
        (6, 123),
        (9, 123),
        (4, 234),
        (5, 234)
;

INSERT INTO games_mech_matches (game_id, mech_id)
    VALUES
        (1, 123),
        (2, 123),
        (5, 123),
        (6, 123),
        (7, 123),
        (8, 123),
        (9, 123),
        (1, 234),
        (3, 234),
        (6, 234),
        (9, 234),
        (4, 345),
        (5, 345),
        (8, 345)
;

INSERT INTO user_game_cat_logs (uid, cat_id, sessions)
    VALUES  
        (1, 123, 5),
        (1, 234, 2),
        (2, 123, 10),
        (2, 345, 6),
        (3, 123, 10),
        (4, 234, 6),
        (4, 345, 8),
        (5, 123, 4),
        (5, 234, 7),
        (5, 345, 9)
;

INSERT INTO user_game_mech_logs (uid, mech_id, sessions)
    VALUES
        (1, 123, 4),
        (1, 234, 6),
        (1, 345, 9),
        (2, 123, 4),
        (3, 234, 10),
        (3, 345, 8),
        (4, 123, 1),
        (4, 345, 8),
        (5, 123, 7)
;
