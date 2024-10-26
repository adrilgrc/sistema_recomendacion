<template>

  <!-- Botón para descargar la matriz de similitud en un archivo .txt -->
  <div v-if="similarityMatrix.length && fileContent">
    <button @click="downloadSimilarityMatrix">Descargar Matriz de Similitud</button>
  </div>

  <div class="calculation-results">
    <h3>Resultados de Cálculo</h3>
    <p>Métrica seleccionada: <strong>{{ selectedMetric }}</strong></p>

    <div v-if="fileContent">
      <!-- Muestra el componente para calcular y mostrar la matriz de similitud -->
      <component :is="currentComponent" :content="fileContent" @matrixComputed="updateMatrices"/>      
      
      <!-- Muestra el componente para calcular las predicción simple después de la matriz de similitud -->
      <div v-if="utilityMatrix.length && similarityMatrix.length && selectedPredictionType ==='simple'">
        <SimplePrediction :utilityMatrix="utilityMatrix" :similarityMatrix="similarityMatrix" :numNeighbors="numNeighbors" @prediction="updatePrediction"/>
      </div>

      <!-- Muestra el componente para calcular las predicción diferencia con la media después de la matriz de similitud -->
      <div v-if="utilityMatrix.length && similarityMatrix.length && selectedPredictionType ==='meanDifference'">
        <!-- Componente DifferenceAverage.vue -->
        <DifferenceAverage :utilityMatrix="utilityMatrix" :similarityMatrix="similarityMatrix" :numNeighbors="numNeighbors" @prediction="updatePrediction"/>
      </div>
      
    </div>

    <div v-else>
      <p>No hay contenido del archivo disponible.</p>
    </div>
  </div>
</template>

<script>
import PearsonCorrelation from '@/components/CorrelationPearson.vue';
import CosineDistance from '@/components/CosineDistance.vue';
import EuclideanDistance from '@/components/EuclideanDistance.vue';
import SimplePrediction from '@/components/SimplePrediction.vue';
import DifferenceAverage from '@/components/DifferenceAverage.vue';
export default {
  props: {
    selectedMetric: {
      type: String,
      required: true
    },
    fileContent: {
      type: String,
      default: ''
    },
    numNeighbors: {
      type: Number,
      required: true
    },
    selectedPredictionType: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      utilityMatrix: [],
      similarityMatrix: [],
      prediction: [],
      pares: []
    };
  },
  computed: {
    currentComponent() {
      switch (this.selectedMetric) {
        case 'pearson':
          return 'PearsonCorrelation';
        case 'cosine':
          return 'CosineDistance';
        case 'euclidean':
          return 'EuclideanDistance';
        default:
          return null;
      }
    }
  },
  components: {
    PearsonCorrelation,
    CosineDistance,
    EuclideanDistance,
    SimplePrediction,
    DifferenceAverage
  },
  methods: {
    updateMatrices({ utilityMatrix, pearsonMatrix, cosineMatrix, euclideanMatrix }) {
      this.utilityMatrix = utilityMatrix;
      switch (this.selectedMetric) {
        case 'pearson':
            this.similarityMatrix = pearsonMatrix;
            break;
          case 'cosine':
            this.similarityMatrix = cosineMatrix;
            break;
          case 'euclidean':
            this.similarityMatrix = euclideanMatrix;
            break;
          default:
            this.similarityMatrix = [];
      }

      this.$emit('matrixUpdated', { utilityMatrix: this.utilityMatrix, similarityMatrix: this.similarityMatrix });
    },

    updatePrediction(predictionMatrix, pares) {	
      this.pares = pares;
      this.prediction = predictionMatrix;
      this.$emit('predictionUpdated', { prediction: this.prediction, pares: this.pares });
    },

    // Método para descargar la matriz de similitud como un archivo TXT
    downloadSimilarityMatrix() {      

      // Verificar si hay contenido en la matriz de similitud
      if (!this.similarityMatrix.length) {
        alert('No hay datos en la matriz de similitud.');
        return;
      }

      // Incluir información adicional
      let matrixText = `Métrica: `;
      switch (this.selectedMetric) {
        case 'pearson':
          matrixText += 'Correlación de Pearson\n';
          break;
        case 'cosine':
          matrixText += 'Distancia de Coseno\n';
          break;
        case 'euclidean':
          matrixText += 'Distancia Euclidiana\n';
          break;
        default:
          matrixText += 'Métrica no especificada\n';
      }
      matrixText += `Número de vecinos: ${this.numNeighbors || 'No especificado'}\n`;
      switch (this.selectedPredictionType) {
        case 'simple':
          matrixText += 'Tipo de Predicción: Simple\n';
          break;
        case 'meanDifference':
          matrixText += 'Tipo de Predicción: Diferencia con la Media\n';
          break;
        default:
          matrixText += 'Tipo de Predicción no especificado\n';
      }
      matrixText += '\n';
      matrixText += 'Matriz de Similitud:\n';
      
      this.similarityMatrix.forEach((row, rowIndex) => {
        matrixText += `Usuario ${rowIndex + 1}: `;
        matrixText += row.map(value => (value !== null ? value.toFixed(4) : 'N/A')).join(' | ');
        matrixText += '\n';
      });

      matrixText += '\nMatriz de Utilidad con Predicciones:\n';
      this.prediction.forEach((row, rowIndex) => {
        matrixText += `Usuario ${rowIndex + 1}: `;
        matrixText += row.map(value => (value !== null ? value.toFixed(4) : 'N/A')).join(' | ');
        matrixText += '\n';
      });
      console.log("pares: ", this.pares);
      matrixText += '\nConjunto de pares de usuarios:\n';
      
      for (let i = 0; i < this.pares.length; i++) {
        matrixText += `Usuario ${this.pares[i][0] + 1}\n`;
        for (let j = 0; j < this.pares[i][1].length; j++) {
          matrixText += `\tVecino ${this.pares[i][1][j].user + 1} (Similitud: ${this.pares[i][1][j].similarity.toFixed(4)})\n`;
        }
        matrixText += '\n';
        if (this.selectedPredictionType === 'simple') {
          matrixText += `SUMATORIO( similitud(a,b) * puntuacion(b,i)) = ${this.pares[i][2].toFixed(4)}\n`;
          matrixText += `abs(SUMATORIO(similitud(a,b)) ) = ${this.pares[i][3].toFixed(4)}\n`; 
          matrixText += `Siendo la predicción ${this.pares[i][2].toFixed(4)} / ${this.pares[i][3].toFixed(4)} = ${this.pares[i][4].toFixed(4)}`
        } else if (this.selectedPredictionType === 'meanDifference') {
          matrixText += `Media del usuario ${this.pares[i][0] + 1} es ${this.pares[i][6].toFixed(4)}\n`;
          matrixText += `SUMATORIO( similitud(a,b) * puntuacion(b) - mediaPuntuaciones(b)) = ${this.pares[i][2].toFixed(4)}\n`;
          matrixText += `SUMATORIO( similitud(a,b) ) = ${this.pares[i][3].toFixed(4)}\n`;
          matrixText += `Siendo la predicción ${this.pares[i][2].toFixed(4)} / ${this.pares[i][3].toFixed(4)} = ${this.pares[i][4].toFixed(4)}`
        }
        matrixText += ` para el ítem: ${this.pares[i][5] + 1}\n`;
      }

    

      // Crear un blob con el contenido de la matriz de similitud
      const blob = new Blob([matrixText], { type: 'text/plain' });

      // Crear un enlace temporal para descargar el archivo
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'matriz_similitud.txt';

    // Simular un clic en el enlace para iniciar la descarga
      link.click();

      // Liberar el objeto URL después de la descarga
      URL.revokeObjectURL(link.href);
      this.downloading = false;
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