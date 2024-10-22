<template>
  <div>
    <h4 v-if="flag">Alguno de los valores de la matriz de similitud está fuera del rango permitido</h4>
    <h4 v-if="!flag">Matriz de Distancia Euclídea</h4>
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
      // Split content by rows
      const rows = this.content.trim().split('\n');
      // Set min and max values
      const minValue = Number(rows[0].trim());
      const maxValue = Number(rows[1].trim());

      // Create an array of arrays of user values. Each row is a user content.
      // Split each row by spaces and convert values to an array of numbers. If a value is '-', convert it to null.
      const userRows = rows.slice(2).map(row => row.split(' ').map(val => (val.trim() === '-' ? null : Number(val))));
      // Set number of users
      const numUsers = userRows.length;
      // Create a matrix of zeros
      const matrix = Array.from({ length: numUsers }, () => Array(numUsers).fill(0));

      // Calculate euclidean distance for each pair of users.
      for (let i = 0; i < numUsers; i++) {
        for (let j = i; j < numUsers; j++) {
          if (i === j) {
            matrix[i][j] = 0; // The distance between a user and itself is 0
          } else {
            const distance = this.euclideanSimilarityByPair(userRows[i], userRows[j], minValue, maxValue);
            matrix[i][j] = distance;
            matrix[j][i] = distance; // Ensure the matrix is symmetric
          }
        }
      }

      this.flag = matrix.some(row => row.some(value => value === null));
      this.euclideanMatrix = matrix;
    },
    euclideanSimilarityByPair(userAValues, userBValues, minValue, maxValue) {
      // Check if any value is outside the range. If so, return null and set the flag to true so the error message is shown in the DOM.
      if (userAValues.some(val => val !== null && (val < minValue || val > maxValue)) || userBValues.some(val => val !== null && (val < minValue || val > maxValue))) {
        this.flag = true;
        return null;
      }
      // Filter out null values and create a list of pairs of values.
      const validPairs = userAValues.map((x, i) => [x, userBValues[i]]).filter(([x, y]) => x !== null && y !== null);

      if (validPairs.length === 0) return null; // Si no hay pares válidos
      
      // Calculate the euclidean distance between the two users by the formula:
      // sqrt(sum((a - b)^2)) where a and b are the values of the pair of users.
      const sumPairs = validPairs.reduce((sum, [a, b]) => sum + Math.pow((a - b), 2), 0);
      return Math.sqrt(sumPairs)
    }
  }
};
</script>

