
export function extractFixturesByTeam(teamName) {
    return function(x) {
        const isHome = (x.hometeam === teamName);
        const isAway = (x.awayteam === teamName);
        const keepIt = isHome || isAway;
        return (keepIt);
    };
}

export
function extractFixturesByRound(round, teamName) {
    return function(x) {
        const isHome = (x.hometeam === teamName);
        const isAway = (x.awayteam === teamName);
        const keepIt = (x.round === round) && (isHome || isAway);
        return (keepIt);
    };
}
