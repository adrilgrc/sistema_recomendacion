<template>
  <div>
    <h4 v-if="flag">No es un número válido de vecinos</h4>
    <h4 v-if="!flag">Predicción Simple</h4>
    <div v-if="!flag && prediction.length">
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
    <div v-else>
      <p>No hay predicciones disponibles.</p>
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
      neighbors: []
    };	
	},
	mounted() {
    this.calculateSimplePrediction();
	},
	methods: {
    calculateSimplePrediction() {
      if (this.numNeighbors <= 0 || !this.isNumeric(this.numNeighbors) || this.numNeighbors > this.utilityMatrix.length - 1) {
        // this.flag = ("El número de vecinos debe ser mayor a 0.");
        this.flag = true;
        return null;
      }
			// console.log("Matriz de utilidad: ");
			// console.table(this.utilityMatrix);
			// console.log("Matriz de similitud: ");
			// console.table(this.similarityMatrix);
			// console.log("Vecinos: ", this.numNeighbors);
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
          this.neighbors = neighbors
					const sumSimilarities = neighbors.reduce((acc, { similarity }) => acc + Math.abs(similarity), 0);
					const sumRatings = neighbors.reduce((acc, { similarity, user }) => acc + similarity * this.utilityMatrix[user][j], 0);

					prediction[i][j] = sumSimilarities !== 0 ? sumRatings / sumSimilarities : 0;

				}
			}

			this.prediction = prediction;
			// console.log("Predicciones: ");
			// console.table(prediction);
		},
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
