function makeGamesArray() {
    return [
        {
            id: 1,
            title: 'Gloomhaven',
            description: 'Gloomhaven  is a game of Euro-inspired tactical combat in a persistent world of shifting motives. Players will take on the role of a wandering adventurer with their own special set of skills and their own reasons for traveling to this dark corner of the world.',
            image: 'https://cf.geekdo-images.com/original/img/lDN358RgcYvQfYYN6Oy2TXpifyM=/0x0/pic2437871.jpg',
            bgg_id: 174430,
            bgg_rating: '8.2'
        },
        {
            id: 2,
            title: 'Last Bastion',
            description: 'A handful of heroes have just stolen the powerful relics of the Baleful Queen. Without them, the immortal sovereign is weakened; recovering them is now her sole purpose.',
            image: 'https://cf.geekdo-images.com/original/img/JKYwSt8a2tcBYG20Oom7Rebth_Y=/0x0/pic4882123.png',
            bgg_id: 285984,
            bgg_rating: '8.1'
        },
        {
            id: 3,
            title: 'Nemesis',
            description: 'Playing Nemesis will take you into the heart of sci-fi survival horror in all its terror. A soldier fires blindly down a corridor, trying to stop the alien advance. A scientist races to find a solution in his makeshift lab. A traitor steals the last escape pod in the very last moment.',
            image: 'https://cf.geekdo-images.com/original/img/fOgLH666aTUqwnhtZjSGH4-XJ8U=/0x0/pic5073276.jpg',
            bgg_id: 167355,
            bgg_rating: '7.8'
        },
        {
            id: 4,
            title: 'Carcassonne',
            description: 'Carcassonne is a tile-placement game in which the players draw and place a tile with a piece of southern French landscape on it. The tile might feature a city, a road, a cloister, grassland or some combination thereof, and it must be placed adjacent to tiles that have already been played, in such a way that cities are connected to cities, roads to roads, etcetera.',
            image: 'https://cf.geekdo-images.com/original/img/o4p6f88SGE899BTNMzTvERVWZ-M=/0x0/pic2337577.jpg',
            bgg_id: 822,
            bgg_rating: '7.7'
        },
        {
            id: 5,
            title: 'Atlantis Rising',
            description: 'Atlantis Rising is a co-operative worker placement game in which you must work together with up to five other players to deploy citizens across your homeland, gathering resources in order to build a cosmic gate that can save your people.',
            image: 'https://cf.geekdo-images.com/original/img/L9MTX-jaDgKZ-0Ml8xZG4pHicWU=/0x0/pic4895878.jpg',
            bgg_id: 248490,
            bgg_rating: '7.5'
        },
        {
            id: 6,
            title: 'Zombicide: Black Plague',
            description: 'Zombicide: Black Plague takes the zombie apocalypse into a fantastical medieval setting! The arcane powers of the Necromancers have unleashed a zombie invasion in the age of swords and sorcery, and its up to your group of straggling survivors to not only stay alive during these dark times',
            image: 'https://cf.geekdo-images.com/original/img/WhHdMb8GiMY-RhHddEByDyPkrWo=/0x0/pic3184103.jpg',
            bgg_id: 176189,
            bgg_rating: '8.2'
        },
        {
            id: 7,
            title: 'Mechs vs Minions',
            description: 'Mechs vs. Minions is a cooperative tabletop campaign for 2-4 players. Set in the world of Runeterra, players take on the roles of four intrepid Yordles: Corki, Tristana, Heimerdinger, and Ziggs, who must join forces and pilot their newly-crafted mechs against an army of marauding minions.',
            image: 'https://cf.geekdo-images.com/original/img/L9MTX-jaDgKZ-0Ml8xZG4pHicWU=/0x0/pic4895878.jpg',
            bgg_id: 209010,
            bgg_rating: '8.2'
        },
        {
            id: 8,
            title: 'Spirit Island',
            description: 'In the most distant reaches of the world, magic still exists, embodied by spirits of the land, of the sky, and of every natural thing. As the great powers of Europe stretch their colonial empires further and further, they will inevitably lay claim to a place where spirits still hold power - and when they do, the land itself will fight back alongside the islanders who live there.',
            image: 'https://cf.geekdo-images.com/original/img/RmP2yBDA0LE-ZFWrEXAkgRuYjn0=/0x0/pic3615739.png',
            bgg_id: 162886,
            bgg_rating: '8.2'
        },
        {
            id: 9,
            title: 'Cthulhu: Death May Die',
            description: 'In Cthulhu: Death May Die, inspired by the writings of H.P. Lovecraft, you and your fellow players represent investigators in the 1920s who instead of trying to stop the coming of Elder Gods, want to summon those otherworldly beings so that you can put a stop to them permanently.',
            image: 'https://cf.geekdo-images.com/original/img/tVhbvCp1Vlqi6zy4uR_-Z1NIVfg=/0x0/pic4705171.jpg',
            bgg_id: 253344,
            bgg_rating: '8.0'
        },
        {
            id: 10,
            title: 'Dominion',
            description: 'Dominion, the popular strategy card game now comes to you in this massive combination pack jammed full of the best boxed sets, additional cards and extras.',
            image: 'https://cf.geekdo-images.com/original/img/KJ90XVwavBtGvNdptuETteLeNbI=/0x0/pic874537.jpg',
            bgg_id: 142131,
            bgg_rating: '8.1'
        },
    ];
};

function makeMaliciousGame() {
    const maliciousGame = {
        id: 911,
        title: 'Naughty naughty very naughty <script>alert("xss");</script>',
        image: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
        description: 'Naughty naughty very naughty <script>alert("xss");</script>',
        bgg_id: 123,
        bgg_rating: '8.8'
    };
    const expectedGame = {
        ...maliciousGame,
        title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        image: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
        description: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        bgg_id: 123,
        bgg_rating: '8.8'
    };
    return {
        maliciousGame,
        expectedGame
    };
};

module.exports = {
    makeGamesArray,
    makeMaliciousGame
};