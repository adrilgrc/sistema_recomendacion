<template>
  <div class="calculation-results">
    <h3>Resultados de Cálculo</h3>
    <p>Métrica seleccionada: <strong>{{ selectedMetric }}</strong></p>

    <div v-if="fileContent">
      <component :is="currentComponent" :content="fileContent" />
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

export default {
  props: {
    selectedMetric: {
      type: String,
      required: true
    },
    fileContent: {
      type: String,
      default: ''
    }
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
    EuclideanDistance
  }
};
</script>
