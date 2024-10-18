<template>
  <div>
    <h4 v-if="flag">Alguno de los valores de la matriz de similitud está fuera del rango permitido</h4>
    <h4 v-if="!flag">Matriz de Distancia Coseno</h4>
    <table v-if="!flag && cosineMatrix.length">
      <thead>
        <tr>
          <th>Usuario</th>
          <th v-for="(user, index) in cosineMatrix.length" :key="index">Usuario {{ index + 1 }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in cosineMatrix" :key="rowIndex">
          <td>Usuario {{ rowIndex + 1 }}</td>
          <td v-for="(value, colIndex) in row" :key="colIndex">{{ value !== null ? value.toFixed(4) : 'N/A' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      cosineMatrix: [],
      flag: false
    };
  },
  mounted() {
    this.calculateCosineDistance();
  },
  methods: {
    calculateCosineDistance() {
      this.flag = false; // Reiniciar el flag de forma que entiendo que todos los valores son validos en este momento
      const rows = this.content.trim().split('\n');
      const minValue = Number(rows[0].trim());
      const maxValue = Number(rows[1].trim());

      const userRows = rows.slice(2).map(row => row.split(' ').map(val => (val.trim() === '-' ? null : Number(val))));

      const numUsers = userRows.length;
      const matrix = Array.from({ length: numUsers }, () => Array(numUsers).fill(0));

      const calculateCosine = (xValues, yValues) => {
        // validar que los valores no sean null, no sean menores a minValue o mayores a maxValue
        if (xValues.some(val => val !== null && (val < minValue || val > maxValue)) || yValues.some(val => val !== null && (val < minValue || val > maxValue))) {
          this.flag = true;
          return null;
        }
        const validPairs = xValues.map((x, i) => [x, yValues[i]]).filter(([x, y]) => x !== null && y !== null);

        if (validPairs.length === 0) return null; // Si no hay pares válidos

        const dotProduct = validPairs.reduce((sum, [x, y]) => sum + x * y, 0);
        const magnitudeX = Math.sqrt(validPairs.reduce((sum, [x]) => sum + x * x, 0));
        const magnitudeY = Math.sqrt(validPairs.reduce((sum, [, y]) => sum + y * y, 0));

        if (magnitudeX === 0 || magnitudeY === 0) return null; // Para evitar división por cero
        
        const cosineSimilarity = dotProduct / (magnitudeX * magnitudeY);
        return (1 - cosineSimilarity); // La distancia coseno
      };

      // Calcular la matriz de distancia coseno para todos los pares de usuarios
      for (let i = 0; i < numUsers; i++) {
        for (let j = i; j < numUsers; j++) {
          if (i === j) {
            matrix[i][j] = 0; // Distancia de un usuario consigo mismo es 0
          } else if (matrix[i][j] < -1 || matrix[i][j] > 1) {
            matrix[i][j] = null;
            matrix[j][i] = null;
          } else {
            const distance = calculateCosine(userRows[i], userRows[j]);
            // console.log(`Distancia entre usuario ${i + 1} y usuario ${j + 1}: ${distance}`);
            matrix[i][j] = distance;
            matrix[j][i] = distance; // Simetría en la matriz
          }
        }
      }
      this.flag = matrix.some(row => row.some(value => value === null));
      this.cosineMatrix = matrix;
    }
  }
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

th, td {
  border: 1px solid #dee2e6;
  padding: 8px;
  text-align: center;
}
</style>

