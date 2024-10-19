<template>
  <div>
    <h4 v-if="flag">Alguno de los valores de la matriz de similitud está fuera del rango permitido</h4>
    <h4 v-if="!flag">Matriz de Distancia Coseno</h4>
    <table v-if="!flag && euclideanMatrix.length">
      <thead>
        <tr>
          <th>Usuario</th>
          <th v-for="(user, index) in euclideanMatrix.length" :key="index">Usuario {{ index + 1 }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in euclideanMatrix" :key="rowIndex">
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
      euclideanMatrix: [],
      flag: true
    }
  },
  mounted() {
    this.calculateEuclideanDistance();
  },
  methods: {
    calculateEuclideanDistance() {
      const rows = this.content.trim().split('\n');
      const minValue = Number(rows[0].trim());
      const maxValue = Number(rows[1].trim());
      const userRows = rows.slice(2).map(row => row.split(' ').map(val => (val.trim() === '-' ? null : Number(val))));

      const numUsers = userRows.length;
      const matrix = Array.from({ length: numUsers }, () => Array(numUsers).fill(0));

      for (let i = 0; i < numUsers; i++) {
        for (let j = i; j < numUsers; j++) {
          if (i === j) {
            matrix[i][j] = 0; // Distancia de un usuario consigo mismo es 0
          } else if (matrix[i][j] < -1 || matrix[i][j] > 1) {
            matrix[i][j] = null;
            matrix[j][i] = null;
          } else {
            const distance = this.euclideanSimilarityByPair(userRows[i], userRows[j], minValue, maxValue);
            // console.log(`Distancia entre usuario ${i + 1} y usuario ${j + 1}: ${distance}`);
            matrix[i][j] = distance;
            matrix[j][i] = distance; // Simetría en la matriz
          }
        }
      }

      this.flag = matrix.some(row => row.some(value => value === null));
      this.euclideanMatrix = matrix;
    },

    euclideanSimilarityByPair(userAValues, userBValues, minValue, maxValue) {
      if (userAValues.some(val => val !== null && (val < minValue || val > maxValue)) || userBValues.some(val => val !== null && (val < minValue || val > maxValue))) {
        this.flag = true;
        return null;
      }
      const validPairs = userAValues.map((x, i) => [x, userBValues[i]]).filter(([x, y]) => x !== null && y !== null);

      if (validPairs.length === 0) return null; // Si no hay pares válidos

      return userAValues.reduce((sum, [a, b]) => sum + Math.pow(a - userBValues[b], 2), 0);
    }
  }
};
</script>

