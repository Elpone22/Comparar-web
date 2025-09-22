<script setup lang="ts">
import { useRouter } from 'vue-router'
defineProps<{
  product: {
    id: number
    name: string
    image: string
    prices: Array<{
      store: string
      price: number
      url?: string
      currency: string
      address?: string
    }>
  }
}>()

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(price)
}

const router = useRouter()
const goToDetail = (id: number) => {
  router.push({ name: 'local-product-detail', params: { id } })
}
</script>

<template>
  <v-card 
    class="mx-auto my-4 product-card" 
    max-width="400"
    :hover="true"
    :ripple="true"
    @click="goToDetail(product.id)"
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
            <div class="d-flex flex-column align-end w-100">
              <span class="text-h6 font-weight-bold" :class="{ 'text-green': index === 0 }">
                {{ formatPrice(price.price) }}
              </span>
              <small v-if="price.address" class="text-grey">{{ price.address }}</small>
            </div>
          </v-list-item-subtitle>
          
          <template v-slot:append>
            <v-btn
              v-if="price.url"
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
