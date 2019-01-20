<template>
  <div class="processing">処理中……</div>
</template>

<style scoped>
.processing {
  background-color: rgba(255, 255, 255, 0.8);
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  opacity: 0.5;
  z-index: 99;
  text-align: center;
  line-height: 150px;
  font-size: 30px;
  cursor: wait;
}
</style>
