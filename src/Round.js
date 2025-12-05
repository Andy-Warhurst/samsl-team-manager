
const roundDates = [
    {round: '1', date: "2025-05-04"},
    {round: '2', date: "2025-05-18"},
    {round: '3', date: "2025-05-25"},
    {round: '4', date: "2025-06-01"},
    {round: 'CUPQ', date: "2025-06-08"},
    {round: '5', date: "2025-06-15"},
    {round: '6', date: "2025-06-22"},
    {round: '7', date: "2025-06-29"},
    {round: '8', date: "2025-07-06"},
    {round: 'CUP1', date: "2025-07-13"},
    {round: '9', date: "2025-07-20"},
    {round: '10', date: "2025-07-27"},
    {round: '11', date: "2025-08-03"},
    {round: '12', date: "2025-08-10"},
    {round: '13', date: "2025-08-24"},
    {round: '14', date: "2025-08-31"},
    {round: '15', date: "2025-09-07"},
    {round: '16', date: "2025-09-14"},
    {round: '17', date: "2025-09-21"},
    {round: '18', date: "2025-09-28"},
];

const Round = () => {
    const today = new Date();

    // Find the next round date
    const nextRound = roundDates.find(({ date }) => new Date(date) > today);

    return nextRound ? nextRound.round : 'No more rounds';
};

export default Round;

