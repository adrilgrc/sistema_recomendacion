<template>
  <div class="calculation-results">
    <h3>Resultados de Cálculo</h3>
    <p>Métrica seleccionada: <strong>{{ selectedMetric }}</strong></p>

    <div v-if="fileContent">
      <!-- Muestra el componente para calcular y mostrar la matriz de similitud -->
      <component :is="currentComponent" :content="fileContent" @matrixComputed="updateMatrices" />

      <!-- Muestra el componente para calcular las predicción simple después de la matriz de similitud -->
      <div v-if="utilityMatrix.length && similarityMatrix.length && selectedPredictionType ==='simple'">
        <SimplePrediction :utilityMatrix="utilityMatrix" :similarityMatrix="similarityMatrix" :numNeighbors="numNeighbors" />
      </div>

      <!-- Muestra el componente para calcular las predicción diferencia con la media después de la matriz de similitud -->
      <div v-if="utilityMatrix.length && similarityMatrix.length && selectedPredictionType ==='meanDifference'">
        <!-- Componente DifferenceAverage.vue -->
        <DifferenceAverage :utilityMatrix="utilityMatrix" :similarityMatrix="similarityMatrix" :numNeighbors="numNeighbors" />
      </div>


      <!-- Botón para descargar la matriz de similitud en un archivo .txt -->
      <div v-if="similarityMatrix.length">
        <button @click="downloadSimilarityMatrix">Descargar Matriz de Similitud</button>
        <p v-if="downloading">Descargando...</p>
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
      downloading: false // Nuevo estado para controlar el texto "Descargando..."

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
    

    // Método para descargar la matriz de similitud como un archivo TXT
    downloadSimilarityMatrix() {      
      console.log('Entrando a la función downloadSimilarityMatrix');
      console.log('Matriz de Similitud:', this.similarityMatrix);
      this.downloading = true;

      // Verificar si hay contenido en la matriz de similitud
      if (!this.similarityMatrix.length) {
        alert('No hay datos en la matriz de similitud.');
        this.downloading = false;
        return;
      }

      // Crear un texto que contenga la matriz de similitud
      let matrixText = 'Matriz de Similitud:\n';
      this.similarityMatrix.forEach((row, rowIndex) => {
        matrixText += `Usuario ${rowIndex + 1}: `;
        matrixText += row.map(value => (value !== null ? value.toFixed(4) : 'N/A')).join(' | ');
        matrixText += '\n';
      });

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

</style>