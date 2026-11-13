// Placeholder HTML template for PDF report generation
// Replace this with the exact HTML/CSS that mirrors your Excel layout.
export function generateReportHtml(data) {
  // `data` contains the VOT, Tabung Amanah, Akaun Amanah, and expenses info.
  // Build a simple table for now.
  const rows = data.expenses
    .map(
      (e) => `
      <tr>
        <td>${e.month}</td>
        <td>${e.description}</td>
        <td>${e.amount}</td>
      </tr>`
    )
    .join('');
  return `
  <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; }
        th { background-color: #f2f2f2; }
      </style>
    </head>
    <body>
      <h1>Pengurusan VOT UniRes Report</h1>
      <h2>Summary</h2>
      <p>Total Expenses: ${data.total}</p>
      <h2>Details</h2>
      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th>Description</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </body>
  </html>`;
}
