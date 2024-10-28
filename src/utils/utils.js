export function parseInputData(content) {
  const rows = content.trim().split('\n');
  const minValue = Number(rows[0].trim());
  const maxValue = Number(rows[1].trim());

  // Convertir las filas de usuarios, reemplazando '-' con null y filtrando las filas que tienen todos sus valores a null
  let userRows = rows.slice(2)
    .map(row => row.trim().split(' ').map(val => (val.trim() === '-' ? null : Number(val))))
    .filter(row => row.some(val => val !== null));

  // Transponer la matriz para filtrar columnas
  let transposedUserRows = userRows[0].map((_, colIndex) => userRows.map(row => row[colIndex]));

  // Filtrar las columnas que tienen todos sus valores a null
  transposedUserRows = transposedUserRows.filter(col => col.some(val => val !== null));

  // Volver a transponer para regresar a las filas originales
  userRows = transposedUserRows[0].map((_, colIndex) => transposedUserRows.map(row => row[colIndex]));

  // Quitar el último elemento si es un string vacío de cada userRow
  userRows.forEach(row => {
    if (row[row.length - 1] === '' || row[row.length - 1] === 0) {
      row.pop();
    }
  });

  return {
    minValue,
    maxValue,
    userRows
  };
}

export function isNumeric(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
}
