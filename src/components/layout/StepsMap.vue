<template>
  <div class="relative">
    <div class="w-full px-20 items-center h-52 flex mapinha relative"></div>
    <div class="flex absolute top-16 items-center justify-evenly w-full">
      <h1 class="text-3xl font-extrabold text-yellow-400">
        FOLLOW <br />
        THE STEPS
      </h1>
      <ul>
        <li class="text-lg text-white">
          <span class="font-bold text-2xl text-yellow-400">1</span> Search for the address that you want. 
        </li>
        <li class="text-lg text-white">
          <span class="font-bold text-2xl text-yellow-400">2</span> Draw polygons to demarcate the coverage area and the partner's area.
        </li>
        <li class="text-lg text-white">
          <span class="font-bold text-2xl text-yellow-400">3</span> Click on the polygon, fill in additional partner information, and save it.
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.mapinha {
  background-image: url('https://raw.githubusercontent.com/ReyhaneMasumi/mapbox-gl-draw-cut-polygon-mode/HEAD/demo/public/demo.gif');
  background-repeat: no-repeat;
  background-position: center;
  filter: blur(1px) opacity(1) saturate(1) brightness(0.3);
  background-size: cover;
}
</style>
