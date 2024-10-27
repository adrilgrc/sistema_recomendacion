<template>
  <div class="file-container">
    <h1>Leer Matriz de Utilidad</h1>
    
    <!-- Campo para subir archivo -->
    <label for="file-upload" class="custom-file-upload">
      Seleccionar archivo
    </label>
    <input type="file" id="file-upload" @change="handleFileChange" accept=".txt" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileContent: '', // Aquí se almacenará el contenido del archivo
    };
  },
  methods: {
    handleFileChange(event) {
      const file = event.target.files[0]; // Obtener el archivo seleccionado
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.fileContent = e.target.result; // Almacenar el contenido del archivo
          this.$emit('fileContentLoaded', this.fileContent); // Emitir el contenido al padre
        };
        reader.readAsText(file); // Leer el archivo como texto
      }
    },
  },
};
</script>