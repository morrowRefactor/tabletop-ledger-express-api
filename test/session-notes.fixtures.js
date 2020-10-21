function makeSessionNotesArray() {
    return [
        {
            id: 1,
            session_id: 1,
            uid: 1,
            note: 'I did X and it gave me an extra 20 points.'
        },
        {
            id: 2,
            session_id: 1,
            uid: 3,
            note: 'john had a great game. I missed my window of opportunity'
        },
        {
            id: 3,
            session_id: 4,
            uid: 5,
            note: 'My first game.  Fun, but I have a lot to learn!'
        },
        {
            id: 4,
            session_id: 4,
            uid: 1,
            note: `Patrick's first game.  He did great!  We'll keep playing more sessions.`
        },
        {
            id: 5,
            session_id: 2,
            uid: 2,
            note: 'Another fun time!'
        }
    ];
};

function makeMaliciousSessionNotes() {
    const maliciousSessionNote = {
        id: 911,
        session_id: 1,
        uid: 1,
        note: 'Naughty naughty very naughty <script>alert("xss");</script>'
    };
    const expectedSessionNote = {
        ...maliciousSessionNote,
        session_id: 1,
        uid: 1,
        note: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;'
    };
    return {
        maliciousSessionNote,
        expectedSessionNote
    };
};

module.exports = {
    makeSessionNotesArray,
    makeMaliciousSessionNotes
};