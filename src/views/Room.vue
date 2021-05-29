<template>
  <div class="container-fluid">
    
      <NavbarInRoom />

      <div class="container-fluid">
        <div class="center">
          <h5>Room ID: <span class="red-text">{{id}}</span> </h5>
        </div>
        <div class="row">
          <div class="col s12 center">
            <span>Return your dashboard: <router-link to="/Player">here</router-link>.</span>
            
          </div>
        </div>
        <div class="row">
          <div class="col s12">
             <!-- <Game :gameID="id"/> -->
          </div>
        </div>
      </div>

      <div class="container-fluid yellow">
        <div class="row">
          <div class="col s4 space-allaround ">
            
          </div>
        </div>
      </div>

  </div>
</template>

<script>

import NavbarInRoom from '../components/NavbarInRoom'
import Game from '../components/Game'




export default {
  components: { NavbarInRoom, Game },
  props: ['id'],
  setup(props) {
    
    
    return {  }
  }
}

</script>
