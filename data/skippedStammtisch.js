// Skipped Stammtisch dates
const skippedStammtisch = {
  skippedDates: [
    {
      year: 2025,
      month: 6, // June
      reason: 'ProtocolBerg v2',
    },
    {
      year: 2025,
      month: 8, // August
      reason: 'c-base maintenance days (cmd)',
    },
    {
      year: 2025,
      month: 9, // september
      reason: '30 years of c-base',
    },
  ],
}

// Convert months to 0-indexed before exporting
// Months are 0-indexed (0 = January, 11 = December)
const exportData = {
  ...skippedStammtisch,
  skippedDates: skippedStammtisch.skippedDates.map((date) => ({
    ...date,
    month: date.month - 1,
  })),
}

export default exportData
