<template>
  <div>
    <!-- Mensaje de error si alguno de los valores está fuera del rango permitido -->
    <h4 v-if="flag">Alguno de los valores de la matriz de similitud está fuera del rango permitido</h4>

    <!-- Título de la matriz de similitud -->
    <h4 v-if="!flag">Matriz de Similitud de Correlación de Pearson</h4>

    <!-- Botón para mostrar/ocultar la tabla si no hay error y la matriz está disponible -->
    <div v-if="!flag && matrix.length">
      <button @click="toggleTable">
        {{ showTable ? 'Ocultar' : 'Mostrar' }} Matriz
      </button>
    </div>

    <!-- Mostrar la tabla de similitud solo si se ha pulsado el botón y hay matriz -->
    <div v-if="showTable && !flag && matrix.length">
      <table>
        <thead>
          <tr>
            <th>Usuario</th>
            <!-- Generar encabezados dinámicamente para los usuarios -->
            <th v-for="(user, index) in matrix.length" :key="index">Usuario {{ index + 1 }}</th>
          </tr>
        </thead>
        <tbody>
          <!-- Filas para cada usuario -->
          <tr v-for="(row, rowIndex) in matrix" :key="rowIndex">
            <td>Usuario {{ rowIndex + 1 }}</td>
            <!-- Celdas para cada valor de la matriz de similitud -->
            <td v-for="(value, colIndex) in row" :key="colIndex">
              {{ value !== null ? value.toFixed(4) : 'N/A' }}
            </td>
          </tr>
        </tbody>
      </table>
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
      matrix: [],     // Matriz de similitud de Pearson
      flag: false,    // Indica si hay un error en los valores
      showTable: false // Controla si la tabla debe mostrarse o no
    };
  },
  mounted() {
    this.calculatePearsonCorrelation();
  },
  methods: {
    // Alternar la visibilidad de la tabla
    toggleTable() {
      this.showTable = !this.showTable;
    },

    // Método para calcular la matriz de similitud usando correlación de Pearson
    calculatePearsonCorrelation() {
      const rows = this.content.trim().split('\n');
      const minValue = Number(rows[0].trim());
      const maxValue = Number(rows[1].trim());

      const userRows = rows.slice(2).map(row => row.split(' ').map(val => (val.trim() === '-' ? null : Number(val))));

      userRows.forEach(row => {
        if (row[row.length - 1] == ' ') {
          row.pop();
        }
      });

      const numUsers = userRows.length;
      const matrix = Array.from({ length: numUsers }, () => Array(numUsers).fill(0));

      const calculatePearson = (xValues, yValues) => {
        if (xValues.some(val => val !== null && (val < minValue || val > maxValue)) || yValues.some(val => val !== null && (val < minValue || val > maxValue))) {
          this.flag = true;
          return null;
        }

        const validPairs = xValues.map((x, i) => [x, yValues[i]]).filter(([x, y]) => x !== null && y !== null);
        if (validPairs.length < 2) return null;

        const n = validPairs.length;
        const sumX = validPairs.reduce((acc, [x]) => acc + x, 0);
        const sumY = validPairs.reduce((acc, [, y]) => acc + y, 0);
        const sumXY = validPairs.reduce((acc, [x, y]) => acc + x * y, 0);
        const sumX2 = validPairs.reduce((acc, [x]) => acc + x * x, 0);
        const sumY2 = validPairs.reduce((acc, [, y]) => acc + y * y, 0);

        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt((n * sumX2 - sumX ** 2) * (n * sumY2 - sumY ** 2));
        if (denominator === 0) return null;
        return numerator / denominator;
      };

      for (let i = 0; i < numUsers; i++) {
        for (let j = i; j < numUsers; j++) {
          if (i === j) {
            matrix[i][j] = 1;
          } else if (matrix[i][j] < minValue && matrix[i][j] > maxValue) {
            matrix[i][j] = null;
            matrix[j][i] = null;
          } else {
            const correlation = calculatePearson(userRows[i], userRows[j]);
            matrix[i][j] = correlation;
            matrix[j][i] = correlation;
          }
        }
      }

      this.matrix = matrix;

      // Emitir el evento cuando la matriz de Pearson esté calculada
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
