<template lang="pug">
  .image--wrapper
    .image--content
      img(:src="url").image--image
      button.image--closer(@click="$emit('close')") Zamknij
</template>

<style lang="scss" scoped>

.image--wrapper {
  position: fixed;
  height: 100vh;
  width: 100vw;
  top: 0;
  z-index: 500;

  background: rgba(0, 0, 0, 0.5);

  display: flex;
  justify-content: center;
  align-items: center;
}

.image--content {
  height: 90%;
  width: 90%;

  border-radius: 10px;
  padding: 15px 0px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background-color: #f0f0f0;
}

.image--image {
  display: block;

  width: 95%;
  height: 95%;

  margin-bottom: 10px;

  object-fit: contain;
}

.image--closer {
  background-color: #c0392b;

  border: none;
  border-radius: 5px;
  padding: 3px 10px;

  font-size: 120%;
  font-weight: bold;
  color: #f0f0f0;

  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  transition: all 0.3s cubic-bezier(.25,.8,.25,1);

  cursor: pointer;

  &:hover {
    box-shadow: 0 7px 14px rgba(0,0,0,0.25), 0 5px 5px rgba(0,0,0,0.22);
  }
}

</style>

<script>
export default {
  name: 'image-view',

  props: [
    'url'
  ]
}
</script>
