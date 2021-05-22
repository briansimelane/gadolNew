<template>
  
  <header>
    <Navbar />
  </header>
      
  <main>
    <div class="container">
          
          <h4>Welcome to Gadol online</h4>
          
          <hr>
          <p>Gadol is an exciting game of strategy and finance. Outwit your opponents in order for you to create the most value. Login or Sign up if you would like to play.</p>
          <br>
          <div class="center">
            <router-link to="/login" class="waves-effect waves-light btn space-right green darken-3"><i class="material-icons left">account_circle</i>Login</router-link>
            <router-link to="/signup" class="waves-effect waves-light btn green darken-3"><i class="material-icons left">add_circle</i>Sign up</router-link>
          </div>

    <br>      
    </div>
  </main>
      
  
    

</template>

<script>
import Foot from '../components/Foot.vue'
import Navbar from '../components/Navbar'


export default {
  components: { Navbar, Foot  }
  
}
</script>

<style scoped>
main {
    display: flex;
    flex-direction: column;

  }
footer {
  margin-top: auto;
}


</style>