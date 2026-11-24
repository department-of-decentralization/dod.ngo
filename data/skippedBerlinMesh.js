// Skipped Berlin Chaos Mesh meetup dates
const skippedBerlinMesh = {
  skippedDates: [
    {
      year: 2026,
      month: 7, // july
      reason: 'DWeb Camp',
    },
    {
      year: 2026,
      month: 8, // august
      reason: 'summer break',
    },
  ],
}

// Convert months to 0-indexed before exporting
// Months are 0-indexed (0 = January, 11 = December)
const exportData = {
  ...skippedBerlinMesh,
  skippedDates: skippedBerlinMesh.skippedDates.map((date) => ({
    ...date,
    month: date.month - 1,
  })),
}

export default exportData
