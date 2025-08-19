<template>
  <v-container class="py-8">
    <v-card class="mx-auto" max-width="800">
      <v-card-title class="text-h4 font-weight-bold text-center py-6">
        Acerca de PriceCompare
      </v-card-title>
      
      <v-card-text class="pa-6">
        <v-row>
          <v-col cols="12" md="6" class="d-flex align-center">
            <div>
              <h3 class="text-h5 mb-4">¿Qué es PriceCompare?</h3>
              <p class="text-body-1 mb-4">
                PriceCompare es una aplicación web que te permite comparar precios de productos 
                en diferentes tiendas en línea de manera rápida y sencilla.
              </p>
              <p class="text-body-1 mb-4">
                Nuestro objetivo es ayudarte a encontrar las mejores ofertas y ahorrar dinero en tus compras en línea.
              </p>
            </div>
          </v-col>
          
          <v-col cols="12" md="6" class="text-center">
            <v-icon size="120" color="primary" class="mb-4">mdi-cart-search</v-icon>
          </v-col>
        </v-row>
        
        <v-divider class="my-6"></v-divider>
        
        <h3 class="text-h5 mb-4">¿Cómo funciona?</h3>
        <v-row>
          <v-col cols="12" md="4" class="text-center">
            <v-icon size="48" color="primary" class="mb-2">mdi-magnify</v-icon>
            <h4 class="text-h6 mb-2">Busca productos</h4>
            <p class="text-body-2">Encuentra el producto que deseas comparar</p>
          </v-col>
          
          <v-col cols="12" md="4" class="text-center">
            <v-icon size="48" color="primary" class="mb-2">mdi-scale-balance</v-icon>
            <h4 class="text-h6 mb-2">Compara precios</h4>
            <p class="text-body-2">Revisa los precios en diferentes tiendas</p>
          </v-col>
          
          <v-col cols="12" md="4" class="text-center">
            <v-icon size="48" color="primary" class="mb-2">mdi-cart-arrow-down</v-icon>
            <h4 class="text-h6 mb-2">Compra al mejor precio</h4>
            <p class="text-body-2">Selecciona la mejor opción para ti</p>
          </v-col>
        </v-row>
      </v-card-text>
      
      <v-card-actions class="pa-4">
        <v-btn color="primary" to="/" prepend-icon="mdi-arrow-left">
          Volver al inicio
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
// Lógica del componente si es necesaria
</script>
