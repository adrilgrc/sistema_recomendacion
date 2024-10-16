<template>
  <div>
    <h4>Distancia Coseno: <strong>{{ cosineDistance }}</strong></h4>
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
      cosineDistance: null
    };
  },
  mounted() {
    this.calculateCosineDistance();
  },
  methods: {
    calculateCosineDistance() {
      const rows = this.content.trim().split('\n');
      const userRows = rows.slice(2);
      const xValues = [];
      const yValues = [];

      userRows.forEach(row => {
        const values = row.split(' ').map(val => (val === '-' ? null : Number(val)));
        if (!values.includes(null)) {
          xValues.push(values[0]);
          yValues.push(values[1]);
        }
      });

      if (xValues.length === 0 || yValues.length === 0) {
        this.cosineDistance = 'Error en los datos o no suficientes datos válidos';
        return;
      }

      const dotProduct = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
      const magnitudeX = Math.sqrt(xValues.reduce((sum, x) => sum + x * x, 0));
      const magnitudeY = Math.sqrt(yValues.reduce((sum, y) => sum + y * y, 0));

      if (magnitudeX === 0 || magnitudeY === 0) {
        this.cosineDistance = 'División por cero';
      } else {
        const cosineSimilarity = dotProduct / (magnitudeX * magnitudeY);
        this.cosineDistance = (1 - cosineSimilarity).toFixed(4);
      }
    }
  }
};
</script>

