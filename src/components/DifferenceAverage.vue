<template>
  <div>
    <!-- Mensaje de error si el número de vecinos no es válido -->
    <h4 v-if="flag">No es un número válido de vecinos</h4>

    <!-- Mostrar el título de la predicción si no hay error -->
    <h4 v-if="!flag">Predicción Diferencia con la Media</h4>

    <!-- Mostrar/ocultar botón si hay predicciones y no hay error -->
    <div v-if="!flag && prediction.length">
      <button @click="toggleTable">
        {{ showTable ? 'Ocultar' : 'Mostrar' }} Predicciones
      </button>
    </div>

    <!-- Mostrar la tabla de predicciones solo si se ha pulsado el botón y hay predicciones -->
    <div v-if="showTable && !flag && prediction.length">
      <table>
        <thead>
          <tr>
            <th>Usuario/Ítem</th>
            <!-- Generar encabezados dinámicamente para los ítems -->
            <th v-for="(itemPred, itemIndex) in prediction[0]" :key="itemIndex">Ítem {{ itemIndex + 1 }}</th>
          </tr>
        </thead>
        <tbody>
          <!-- Filas para cada usuario -->
          <tr v-for="(userPredictions, userIndex) in prediction" :key="userIndex">
            <td>Usuario {{ userIndex + 1 }}</td>
            <!-- Celdas para cada predicción de ítem -->
            <td v-for="(itemPred, itemIndex) in userPredictions" :key="itemIndex">
              {{ isNumeric(itemPred) ? itemPred.toFixed(4) : 'N/A' }}
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
    numNeighbors: {
      type: Number,
      required: true
    },
    utilityMatrix: {
      type: Array,
      required: true
    },
    similarityMatrix: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      prediction: [],
      flag: false,
      showTable: false // Controla si la tabla debe mostrarse o no
    };
  },
  mounted() {
    this.calculateDifferenceAveragePrediction();
  },
  methods: {
    // Alternar la visibilidad de la tabla
    toggleTable() {
      this.showTable = !this.showTable;
    },

    // Método para calcular la predicción usando diferencia con la media
    calculateDifferenceAveragePrediction() {
      if (this.numNeighbors <= 0 || !this.isNumeric(this.numNeighbors) || this.numNeighbors > this.utilityMatrix.length - 1) {
        this.flag = true;
        return null;
      }

      const numUsers = this.utilityMatrix.length;
      const numItems = this.utilityMatrix[0].length;
      const prediction = Array.from({ length: numUsers }, () => Array(numItems).fill(0));

      for (let i = 0; i < numUsers; i++) {
        for (let j = 0; j < numItems; j++) {
          // Si el usuario ya ha calificado el ítem, no es necesario predecir
          if (this.utilityMatrix[i][j] !== null) {
            prediction[i][j] = this.utilityMatrix[i][j];
            continue;
          }

          const neighbors = this.similarityMatrix[i]
            .map((similarity, u) => ({ similarity, user: u }))
            .filter(({ similarity, user }) => similarity !== null && i !== user)
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, this.numNeighbors);

          const sumSimilarities = neighbors.reduce((acc, { similarity }) => acc + Math.abs(similarity), 0);
          const sumRatings = neighbors.reduce((acc, { similarity, user }) => acc + similarity * (this.utilityMatrix[user][j] - this.AverageUser(user)), 0);

          prediction[i][j] = this.AverageUser(i) + (sumSimilarities !== 0 ? sumRatings / sumSimilarities : 0);
        }
      }

      this.prediction = prediction;
    },

    // Método para calcular la media del usuario
    AverageUser(userIndex) {
      const userRatings = this.utilityMatrix[userIndex];
      const ratedItems = userRatings.filter((rating) => rating !== null);
      const mean = ratedItems.reduce((sum, rating) => sum + rating, 0) / ratedItems.length;
      return mean;
    },

    // Método para verificar si el valor es numérico
    isNumeric(value) {
      return !isNaN(parseFloat(value)) && isFinite(value);
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
