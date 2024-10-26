<template>

  <div v-if="!flag && matrix.length">
    <MatrixDisplay
      :matrix="matrix"
      :flag="flag"
      title="Matriz de Similitud de Correlación de Pearson"
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
      matrix: [],
      flag: false,
    };
  },
  mounted() {
    this.calculatePearsonCorrelation();
  },
  methods: {
  
    calculatePearsonCorrelation() {
      this.flag = false; // Reiniciar el flag de forma que entiendo que todos los valores son validos en este momento
      // Usar la función de utilidades
      const { minValue, maxValue, userRows } = parseInputData(this.content);
      const numUsers = userRows.length;
      const matrix = Array.from({ length: numUsers }, () => Array(numUsers).fill(0));

      
      const calculatePearson = (xValues, yValues) => {
        if (xValues.some(val => val !== null && (val < minValue || val > maxValue)) || yValues.some(val => val !== null && (val < minValue || val > maxValue))) {
          this.flag = true;
          return null;
        }
        
        const validPairs = xValues.map((x, i) => [x, yValues[i]]).filter(([x, y]) => x !== null && y !== null);
        if (validPairs.length === 0) return null;
        
        const n = validPairs.length;
        console.log("N: ", n);
        const sumX = validPairs.reduce((acc, [x]) => acc + x, 0);
        const sumY = validPairs.reduce((acc, [, y]) => acc + y, 0);
        const sumXY = validPairs.reduce((acc, [x, y]) => acc + x * y, 0);
        const sumX2 = validPairs.reduce((acc, [x]) => acc + x * x, 0);
        const sumY2 = validPairs.reduce((acc, [, y]) => acc + y * y, 0);
        console.log("SumX: ", sumX);
        console.log("SumY: ", sumY);
        console.log("SumXY: ", sumXY);
        console.log("SumX2: ", sumX2);
        console.log("SumY2: ", sumY2);

        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt((n * sumX2 - sumX ** 2) * (n * sumY2 - sumY ** 2));
        console.log("Numerator: ", numerator);
        console.log("Denominator: ", denominator);
        if (denominator === 0) return null;
        return numerator / denominator;
      };

      for (let i = 0; i < numUsers; i++) {
        for (let j = i; j < numUsers; j++) {

          if (i === j) {
            matrix[i][j] = 1;
          } else if (matrix[i][j] < -1 || matrix[i][j] > 1) {
            console.log("Matrix[i][j]: ", matrix[i][j]);
            matrix[i][j] = null;
            matrix[j][i] = null;
          } else {
            const correlation = calculatePearson(userRows[i], userRows[j]);
            console.log("Correlation: ", correlation);
            console.log("Calculatedpearson: ", calculatePearson(userRows[i], userRows[j]));
            matrix[i][j] = correlation;
            matrix[j][i] = correlation;
          }
        }
      }
      this.matrix = matrix;
      // this.flag = matrix.some(row => row.some(value => value === null));

      // Emite el evento cuando la matriz de Pearson está calculada
      this.$emit('matrixComputed', {
        utilityMatrix: userRows,   // Esta es la matriz de utilidad (ratings)
        pearsonMatrix: this.matrix // Esta es la matriz de Pearson (similitud)
      });
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
