<template>
  <div>
    <MatrixDisplay
      :matrix="cosineMatrix"
      :flag="flag"
      title="Matriz de Distancia Coseno"
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
      
      const { minValue, maxValue, userRows } = parseInputData(this.content);

      const numUsers = userRows.length;
      const matrix = Array.from({ length: numUsers }, () => Array(numUsers).fill(0));

      const calculateCosine = (xValues, yValues) => {
        // validar que los valores no sean null, no sean menores a minValue o mayores a maxValue
        if (xValues.some(val => val !== null && (val < minValue || val > maxValue)) || yValues.some(val => val !== null && (val < minValue || val > maxValue))) {
          this.flag = true;
          return null;
        }

        // if (xValues.length !== yValues.length) {
        //   this.flag = true;
        //   return null;
        // }

        // if (xValues.length !== yValues.length) {
        //   const diff = Math.abs(xValues.length - yValues.length);
        //   if (xValues.length > yValues.length) {
        //     yValues = yValues.concat(Array(diff).fill(null));
        //   } else {
        //     xValues = xValues.concat(Array(diff).fill(null));
        //   }
        // }

        const validPairs = xValues.map((x, i) => [x, yValues[i]]).filter(([x, y]) => x !== null && y !== null);

        if (validPairs.length === 0) return null; // Si no hay pares válidos

        const dotProduct = validPairs.reduce((sum, [x, y]) => sum + x * y, 0);
        const magnitudeX = Math.sqrt(validPairs.reduce((sum, [x]) => sum + x * x, 0));
        const magnitudeY = Math.sqrt(validPairs.reduce((sum, [, y]) => sum + y * y, 0));

        if (magnitudeX === 0 || magnitudeY === 0) return null; // Para evitar división por cero
        
        const cosineSimilarity = dotProduct / (magnitudeX * magnitudeY);
        

        return (cosineSimilarity); // La distancia coseno
      };
      // Calcular la matriz de distancia coseno para todos los pares de usuarios
      for (let i = 0; i < numUsers; i++) {
        for (let j = i; j < numUsers; j++) {
          if (i === j) {
            matrix[i][j] = 1; // Distancia de un usuario consigo mismo es 1
          } else if (matrix[i][j] < -1 || matrix[i][j] > 1) {
            matrix[i][j] = null;
            matrix[j][i] = null;
          } else {
            const distance = calculateCosine(userRows[i], userRows[j]);
            console.log(`Distancia entre usuario ${i + 1} y usuario ${j + 1}: ${distance}`);
            console.log("Tamaño userRows[i]: ", userRows[i].length);
            console.log("Tamaño userRows[j]: ", userRows[j].length);
            // console.log(`Distancia entre usuario ${i + 1} y usuario ${j + 1}: ${distance}`);
            matrix[i][j] = distance;
            matrix[j][i] = distance; // Simetría en la matriz
          }
        }
      }
      this.flag = matrix.some(row => row.some(value => value === null));
      this.cosineMatrix = matrix;

      this.$emit('matrixComputed', {
        utilityMatrix: userRows,   
        cosineMatrix: this.cosineMatrix 
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

