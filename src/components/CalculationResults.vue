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
      matrixText += '\nConjunto de pares de usuarios:\n';
      
      for (let i = 0; i < this.pares.length; i++) {
        matrixText += `Usuario ${this.pares[i][0] + 1} con el ítem ${this.pares[i][5] + 1}\n`;
        for (let j = 0; j < this.pares[i][1].length; j++) {
          matrixText += `\tVecino ${this.pares[i][1][j].user + 1} (Similitud: ${this.pares[i][1][j].similarity.toFixed(4)})\n`;
        }
        matrixText += '\n';
        if (this.selectedPredictionType === 'simple') {
          matrixText += `\tSUMATORIO( similitud(a,b) * puntuacion(b,i)) = ${this.pares[i][2].toFixed(4)}\n`;
          matrixText += `\tabs(SUMATORIO(similitud(a,b)) ) = ${this.pares[i][3].toFixed(4)}\n`; 
          matrixText += `\tSiendo la predicción ${this.pares[i][2].toFixed(4)} / ${this.pares[i][3].toFixed(4)} = ${this.pares[i][4].toFixed(4)}`
        } else if (this.selectedPredictionType === 'meanDifference') {
          matrixText += `\tMedia del usuario ${this.pares[i][0] + 1} es ${this.pares[i][6].toFixed(4)}\n`;
          matrixText += `\tSUMATORIO( similitud(a,b) * puntuacion(b) - mediaPuntuaciones(b)) = ${this.pares[i][2].toFixed(4)}\n`;
          matrixText += `\tSUMATORIO( similitud(a,b) ) = ${this.pares[i][3].toFixed(4)}\n`;
          matrixText += `\tSiendo la predicción ${this.pares[i][2].toFixed(4)} / ${this.pares[i][3].toFixed(4)} = ${this.pares[i][4].toFixed(4)}`
        }
        matrixText += ` para el ítem: ${this.pares[i][5] + 1}\n\n`;
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