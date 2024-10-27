<template>
  <div v-if="!flag && euclideanMatrix.length">
    <MatrixDisplay
      :matrix="euclideanMatrix"
      :flag="flag"
      title="Matriz de Distancia Euclídea"
    />
  </div>
</template>

<script>
import { parseInputData } from '@/utils/utils';
import MatrixDisplay from '@/components/MatrixDisplay.vue';

export default {
  components: {
    MatrixDisplay
  },
  props: {
    content: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      euclideanMatrix: [],
      flag: false,
      showTable: false      // Controla si la tabla debe mostrarse o no
    }
  },
  mounted() {
    this.calculateEuclideanDistance();
  },
  methods: {
    // Alternar la visibilidad de la tabla
    toggleTable() {
      this.showTable = !this.showTable;
    },
    
    calculateEuclideanDistance() {
      this.flag = false; // Reset the flag so I understand that all values are valid at this point
      const { minValue, maxValue, userRows } = parseInputData(this.content);
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
      this.$emit('matrixComputed', {
        utilityMatrix: userRows,   
        euclideanMatrix: this.euclideanMatrix 
      });
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