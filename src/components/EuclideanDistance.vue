<template>
  <div>
    <!-- Mensaje de error si alguno de los valores está fuera del rango permitido -->
    <h4 v-if="flag">Alguno de los valores de la matriz de similitud está fuera del rango permitido</h4>

    <!-- Título de la matriz de similitud -->
    <h4 v-if="!flag">Matriz de Distancia Euclídea</h4>

    <!-- Botón para mostrar/ocultar la tabla si no hay error y la matriz está disponible -->
    <div v-if="!flag && euclideanMatrix.length">
      <button @click="toggleTable">
        {{ showTable ? 'Ocultar' : 'Mostrar' }} Matriz
      </button>
    </div>

    <!-- Mostrar la tabla de similitud solo si se ha pulsado el botón y hay matriz -->
    <div v-if="showTable && !flag && euclideanMatrix.length">
      <table>
        <thead>
          <tr>
            <th>Usuario</th>
            <!-- Generar encabezados dinámicamente para los usuarios -->
            <th v-for="(user, index) in euclideanMatrix.length" :key="index">Usuario {{ index + 1 }}</th>
          </tr>
        </thead>
        <tbody>
          <!-- Filas para cada usuario -->
          <tr v-for="(row, rowIndex) in euclideanMatrix" :key="rowIndex">
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
      euclideanMatrix: [],  // Matriz de distancia Euclídea
      flag: true,           // Indica si hay un error en los valores
      showTable: false      // Controla si la tabla debe mostrarse o no
    };
  },
  mounted() {
    this.calculateEuclideanDistance();
  },
  methods: {
    // Alternar la visibilidad de la tabla
    toggleTable() {
      this.showTable = !this.showTable;
    },

    // Método para calcular la matriz de distancia Euclídea
    calculateEuclideanDistance() {
      // Split content by rows
      const rows = this.content.trim().split('\n');
      // Set min and max values
      const minValue = Number(rows[0].trim());
      const maxValue = Number(rows[1].trim());

      // Create an array of arrays of user values. Each row is a user content.
      const userRows = rows.slice(2).map(row => row.split(' ').map(val => (val.trim() === '-' ? null : Number(val))));
      
      userRows.forEach(row => {
        if (row[row.length - 1] === ' ') {
          row.pop();
        }
      });

      const numUsers = userRows.length;
      const matrix = Array.from({ length: numUsers }, () => Array(numUsers).fill(0));

      // Calculate euclidean distance for each pair of users.
      for (let i = 0; i < numUsers; i++) {
        for (let j = i; j < numUsers; j++) {
          if (i === j) {
            matrix[i][j] = 0; // La distancia entre un usuario y sí mismo es 0
          } else {
            const distance = this.euclideanSimilarityByPair(userRows[i], userRows[j], minValue, maxValue);
            matrix[i][j] = distance;
            matrix[j][i] = distance; // Asegurar que la matriz sea simétrica
          }
        }
      }

      this.flag = matrix.some(row => row.some(value => value === null));
      this.euclideanMatrix = matrix;

      // Emitir el evento cuando la matriz de distancia Euclídea esté calculada
      this.$emit('matrixComputed', {
        utilityMatrix: userRows,   
        euclideanMatrix: this.euclideanMatrix 
      });
    },

    // Método para calcular la distancia Euclídea entre dos usuarios
    euclideanSimilarityByPair(userAValues, userBValues, minValue, maxValue) {
      // Verificar si algún valor está fuera del rango
      if (userAValues.some(val => val !== null && (val < minValue || val > maxValue)) || userBValues.some(val => val !== null && (val < minValue || val > maxValue))) {
        this.flag = true;
        return null;
      }

      // Filtrar los valores válidos (no nulos) y formar pares
      const validPairs = userAValues.map((x, i) => [x, userBValues[i]]).filter(([x, y]) => x !== null && y !== null);

      if (validPairs.length === 0) return null; // Si no hay pares válidos

      // Calcular la distancia Euclídea entre los dos usuarios
      const sumPairs = validPairs.reduce((sum, [a, b]) => sum + Math.pow((a - b), 2), 0);
      return Math.sqrt(sumPairs);
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
