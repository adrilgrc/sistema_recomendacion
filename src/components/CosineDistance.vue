<template>
  <div>
    <!-- Mensaje de error si alguno de los valores está fuera del rango permitido -->
    <h4 v-if="flag">Alguno de los valores de la matriz de similitud está fuera del rango permitido</h4>

    <!-- Título de la matriz de similitud -->
    <h4 v-if="!flag">Matriz de Distancia Coseno</h4>

    <!-- Botón para mostrar/ocultar la tabla si no hay error y la matriz está disponible -->
    <div v-if="!flag && cosineMatrix.length">
      <button @click="toggleTable">
        {{ showTable ? 'Ocultar' : 'Mostrar' }} Matriz
      </button>
    </div>

    <!-- Mostrar la tabla de similitud solo si se ha pulsado el botón y hay matriz -->
    <div v-if="showTable && !flag && cosineMatrix.length">
      <table>
        <thead>
          <tr>
            <th>Usuario</th>
            <!-- Generar encabezados dinámicamente para los usuarios -->
            <th v-for="(user, index) in cosineMatrix.length" :key="index">Usuario {{ index + 1 }}</th>
          </tr>
        </thead>
        <tbody>
          <!-- Filas para cada usuario -->
          <tr v-for="(row, rowIndex) in cosineMatrix" :key="rowIndex">
            <td>Usuario {{ rowIndex + 1 }}</td>
            <!-- Celdas para cada valor de la matriz de similitud -->
            <td v-for="(value, colIndex) in row" :key="colIndex">
              {{ value !== null ? value.toFixed(4) : 'N/A' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mensaje si no hay matriz de similitud disponible o si hay un error -->
    <div v-else>
      <p>No hay matriz de similitud disponible.</p>
    </div>
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
      cosineMatrix: [],  // Matriz de distancia coseno
      flag: false,       // Indica si hay un error en los valores
      showTable: false   // Controla si la tabla debe mostrarse o no
    };
  },
  mounted() {
    this.calculateCosineDistance();
  },
  methods: {
    // Alternar la visibilidad de la tabla
    toggleTable() {
      this.showTable = !this.showTable;
    },

    // Método para calcular la matriz de distancia Coseno
    calculateCosineDistance() {
      this.flag = false; // Reiniciar el flag de error
      const rows = this.content.trim().split('\n');
      const minValue = Number(rows[0].trim());
      const maxValue = Number(rows[1].trim());

      const userRows = rows.slice(2).map(row => row.split(' ').map(val => (val.trim() === '-' ? null : Number(val))));

      userRows.forEach(row => {
        if (row[row.length - 1] === ' ') {
          row.pop();
        }
      });

      const numUsers = userRows.length;
      const matrix = Array.from({ length: numUsers }, () => Array(numUsers).fill(0));

      const calculateCosine = (xValues, yValues) => {
        if (xValues.some(val => val !== null && (val < minValue || val > maxValue)) || yValues.some(val => val !== null && (val < minValue || val > maxValue))) {
          this.flag = true;
          return null;
        }

        const validPairs = xValues.map((x, i) => [x, yValues[i]]).filter(([x, y]) => x !== null && y !== null);

        if (validPairs.length === 0) return null; // Si no hay pares válidos

        const dotProduct = validPairs.reduce((sum, [x, y]) => sum + x * y, 0);
        const magnitudeX = Math.sqrt(validPairs.reduce((sum, [x]) => sum + x * x, 0));
        const magnitudeY = Math.sqrt(validPairs.reduce((sum, [, y]) => sum + y * y, 0));

        if (magnitudeX === 0 || magnitudeY === 0) return null; // Evitar la división por cero

        const cosineSimilarity = dotProduct / (magnitudeX * magnitudeY);
        return cosineSimilarity;
      };

      for (let i = 0; i < numUsers; i++) {
        for (let j = i; j < numUsers; j++) {
          if (i === j) {
            matrix[i][j] = 1; // La distancia entre un usuario y sí mismo es 1
          } else if (matrix[i][j] < -1 || matrix[i][j] > 1) {
            matrix[i][j] = null;
            matrix[j][i] = null;
          } else {
            const distance = calculateCosine(userRows[i], userRows[j]);
            matrix[i][j] = distance;
            matrix[j][i] = distance; // Mantener la simetría
          }
        }
      }

      this.flag = matrix.some(row => row.some(value => value === null));
      this.cosineMatrix = matrix;

      // Emitir el evento cuando la matriz de Coseno esté calculada
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
