<template>
  <div>
    <h4 v-if="flag">No es un número válido de vecinos</h4>
    <h4 v-if="!flag">Predicción Simple</h4>
    <!-- Mostrar/ocultar botón si hay predicciones y no hay error -->
    <div v-if="!flag && prediction.length">
      <button @click="toggleTable">
        {{ showTable ? 'Ocultar' : 'Mostrar' }} Predicciones
      </button>
    </div>

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
      showTable: false,
    };	
	},
	mounted() {
    this.calculateSimplePrediction();
	},
	methods: {
    toggleTable() {
      this.showTable = !this.showTable; // Alterna la visibilidad de la tabla
    },
    calculateSimplePrediction() {
      if (this.numNeighbors <= 0 || !this.isNumeric(this.numNeighbors) || this.numNeighbors > this.utilityMatrix.length - 1) {
        this.flag = true;
        return null;
      }

			const numUsers = this.utilityMatrix.length;
			const numItems = this.utilityMatrix[0].length;
			const prediction = Array.from({ length: numUsers }, () => Array(numItems).fill(0));
      const pares = [];
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
					const sumRatings = neighbors.reduce((acc, {  similarity, user }) => acc + similarity * this.utilityMatrix[user][j], 0);

					prediction[i][j] = sumSimilarities !== 0 ? sumRatings / sumSimilarities : 0;
          if (sumRatings !== 0) {
            pares.push([i, neighbors, sumRatings, sumSimilarities, prediction[i][j], j]);
          }
          
				}
			}

			this.prediction = prediction;
      this.$emit('prediction', this.prediction, pares);
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

.custom-file-upload {
  display: inline-block;
  padding: 10px 20px;
  background-color: #3498db; /* Color de fondo azul */
  color: #fff; /* Texto en blanco */
  font-size: 16px;
  border-radius: 5px; /* Bordes redondeados */
  cursor: pointer; /* Cambia el cursor a puntero */
  transition: background-color 0.3s ease; /* Transición suave al pasar el ratón */
}

.custom-file-upload:hover {
  background-color: #2980b9; /* Color de fondo más oscuro cuando el ratón está encima */
}

/* Estilos del contenedor y del input de archivo */
.file-container {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  font-family: 'Roboto', sans-serif;
  text-align: center;
}

input[type="file"] {
  display: none; /* Ocultar input de archivo */
}

.custom-file-upload {
  display: inline-block;
  padding: 10px 20px;
  background-color: #3498db;
  color: #fff;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.custom-file-upload:hover {
  background-color: #2980b9;
}

button {
  display: inline-block;
  padding: 10px 20px;
  background-color: #3498db;
  color: #fff;
  font-size: 16px;
  border-radius: 5px;
  border-color: #3498db;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.file-output {
  margin-top: 20px;
  text-align: left;
}
</style>