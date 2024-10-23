
export function parseInputData(content) {
  const rows = content.trim().split('\n');
  const minValue = Number(rows[0].trim());
  const maxValue = Number(rows[1].trim());
  
  const userRows = rows.slice(2).map(row => row.split(' ').map(val => (val.trim() === '-' ? null : Number(val))));
  
  // Quitar el último elemento si es un string vacío de cada userRow
  userRows.forEach(row => {
    if (row[row.length - 1] === ' ') {
      row.pop();
    }
  });

  return {
    minValue,
    maxValue,
    userRows
  };
}
