
const roundDates = [
    {round: '1', date: "2026-05-03"},
    {round: '2', date: "2026-05-17"},
    {round: '3', date: "2026-05-24"},
    {round: '4', date: "2026-05-31"},
    {round: '5', date: "2026-06-14"},
    {round: '6', date: "2026-06-21"},
    {round: '7', date: "2026-06-28"},
    {round: '8', date: "2026-07-05"},
    {round: '9', date: "2026-07-19"},
    {round: '10', date: "2026-07-26"},
    {round: '11', date: "2026-08-02"},
    {round: '12', date: "2026-08-09"},
    {round: '13', date: "2026-08-23"},
    {round: '14', date: "2026-08-30"},
    {round: '15', date: "2026-09-06"},
    {round: '16', date: "2026-09-13"},
    {round: '17', date: "2026-09-20"},
    {round: '18', date: "2026-09-27"},
];

const Round = () => {
    const today = new Date();

    // Find the next round date
    const nextRound = roundDates.find(({ date }) => new Date(date) > today);

    return nextRound ? nextRound.round : 'No more rounds';
};

export default Round;

