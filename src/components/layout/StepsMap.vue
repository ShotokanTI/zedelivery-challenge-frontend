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
          <span class="font-bold text-2xl text-yellow-400">2</span> Add markers that will show up on the map to indicate the partner's coverage area.
        </li>
        <li class="text-lg text-white">
          <span class="font-bold text-2xl text-yellow-400">3</span> Fill in the additional partner information and save.
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.mapinha {
  background-image: url('https://i.gifer.com/7N1e.gif');
  background-repeat: no-repeat;
  background-position: center;
  filter: blur(1px) opacity(1) saturate(1) brightness(0.3);
  background-size: cover;
}
</style>
