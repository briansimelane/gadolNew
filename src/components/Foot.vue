<template>
  <footer class="footer-copyright green lighten-4 multipadding-10">
               
            <div class="container">
            © {{ currYear }} Copyright Gadol
            </div>
          
    </footer>
</template>

<script>
export default {

  setup(){
    const currYear = new Date().getFullYear();

    return { currYear }
  }

}
</script>

<style>

</style>