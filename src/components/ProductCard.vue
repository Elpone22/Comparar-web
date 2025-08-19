<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToDetail = () => {
  router.push({ name: 'product-detail', params: { id: props.product.id } })
}

const props = defineProps<{
  product: {
    id: number
    name: string
    image: string
    prices: Array<{
      store: string
      price: number
      url: string
      currency: string
    }>
  }
}>()

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(price)
}
</script>

<template>
  <v-card 
    class="mx-auto my-4 product-card" 
    max-width="400"
    @click="goToDetail"
    :hover="true"
    :ripple="true"
  >
    <v-img :src="product.image" height="200" cover></v-img>
    
    <v-card-title class="text-h6 font-weight-bold">
      {{ product.name }}
    </v-card-title>

    <v-card-text>
      <v-list>
        <v-list-item v-for="(price, index) in product.prices" :key="index">
          <template v-slot:prepend>
            <v-avatar :color="index === 0 ? 'green lighten-4' : 'grey lighten-4'" size="40">
              <span class="text-caption">{{ index + 1 }}°</span>
            </v-avatar>
          </template>
          
          <v-list-item-title class="font-weight-medium">
            {{ price.store }}
          </v-list-item-title>
          
          <v-list-item-subtitle class="text-right">
            <span class="text-h6 font-weight-bold" :class="{ 'text-green': index === 0 }">
              {{ formatPrice(price.price) }}
            </span>
          </v-list-item-subtitle>
          
          <template v-slot:append>
            <v-btn
              :href="price.url"
              target="_blank"
              rel="noopener noreferrer"
              color="primary"
              variant="text"
              size="small"
              class="ml-2"
            >
              Ver
            </v-btn>
          </template>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>
