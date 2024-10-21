<template>
  <div>
    <h4>Recomendaciones basadas en Diferencia con la Media</h4>
    <table v-if="recommendations.length">
      <thead>
        <tr>
          <th>Usuario</th>
          <th>Ítem</th>
          <th>Calificación Predicha</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, userIndex) in recommendations" :key="userIndex">
          <td :rowspan="user.userRecommendations.length">{{ userIndex + 1 }}</td>
          <template v-for="(item, index) in user.userRecommendations" :key="index">
            <tr>
              <td>Ítem {{ item.itemIndex }}</td>
              <td>{{ item.predictedRating !== null ? item.predictedRating.toFixed(4) : 'N/A' }}</td>
            </tr>
          </template>
        </tr>
      </tbody>
    </table>
    <p v-else>No se encontraron recomendaciones.</p>
  </div>
</template>

<script>
export default {
  props: {
    utilityMatrix: {
      type: Array,
      required: true,
    },
    pearsonMatrix: {
      type: Array,
      required: true,
    },
    numNeighbors: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      recommendations: [],
    };
  },
  mounted() {
    if (this.utilityMatrix.length > 0 && this.pearsonMatrix.length > 0) {
      this.generateRecommendations();
    } else {
      console.error('Las matrices de utilidad o de Pearson están vacías.');
    }
  },
  methods: {
    generateRecommendations() {
      const numUsers = this.utilityMatrix.length;
      const numItems = this.utilityMatrix[0].length;

      // Calcular la media de calificaciones para cada usuario
      const userMeans = this.utilityMatrix.map((userRatings) => {
        const ratedItems = userRatings.filter((rating) => rating !== null);
        const mean = ratedItems.length > 0
          ? ratedItems.reduce((sum, rating) => sum + rating, 0) / ratedItems.length
          : 0;
        return mean;
      });

      const recommendations = [];

      // Iteramos sobre cada usuario
      for (let u = 0; u < numUsers; u++) {
        const userRatings = this.utilityMatrix[u];
        const predictedRatings = Array(numItems).fill(null);

        // Iteramos sobre los ítems de cada usuario
        for (let i = 0; i < numItems; i++) {
          if (userRatings[i] === null) { // Si el usuario no ha calificado este ítem
            let numerator = 0;
            let denominator = 0;

            // Obtener los k vecinos más similares
            const neighbors = Array.from({ length: numUsers }, (_, v) => ({
              similarity: this.pearsonMatrix[u][v],
              index: v,
            }))
              .filter(
                (neighbor) =>
                  neighbor.index !== u && this.utilityMatrix[neighbor.index][i] !== null
              )
              .sort((a, b) => b.similarity - a.similarity) // Ordenar por mayor similitud
              .slice(0, this.numNeighbors);

            // Calcular el numerador y el denominador de la fórmula de predicción
            for (let { similarity, index: v } of neighbors) {
              numerator += similarity * (this.utilityMatrix[v][i] - userMeans[v]);
              denominator += Math.abs(similarity);
            }

            // Si el denominador es distinto de 0, calculamos la predicción
            if (denominator !== 0) {
              predictedRatings[i] = userMeans[u] + numerator / denominator;
            }
          }
        }

        // Obtener las recomendaciones con las calificaciones predichas más altas
        const userRecommendations = predictedRatings
          .map((rating, index) => ({ rating, index }))
          .filter((item) => item.rating !== null)
          .sort((a, b) => b.rating - a.rating)
          .slice(0, this.numNeighbors) // Tomamos las recomendaciones hasta el número de vecinos
          .map((item) => ({
            itemIndex: item.index + 1, // +1 si los ítems están numerados desde 1
            predictedRating: item.rating,
          }));

        // Si se generan recomendaciones, las agregamos al array de recomendaciones
        if (userRecommendations.length > 0) {
          recommendations.push({
            userIndex: u,
            userRecommendations: userRecommendations,
          });
        }
      }

      // Actualizamos las recomendaciones generadas
      this.recommendations = recommendations;
      console.log('Recomendaciones generadas:', this.recommendations);
    },
  },
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

th {
  background-color: #f2f2f2;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}
</style>
