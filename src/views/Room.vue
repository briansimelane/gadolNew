<template>
  <div class="container-fluid">
    
      <NavbarInRoom />

      <div class="container-fluid">
        <div class="center">
          <h5>In the room</h5>
        </div>
        <div class="row">
          <div class="col s12 center">
            <span>Redirect to your dashboard: <router-link to="Player">here</router-link>.</span>
          </div>
        </div>
      </div>

  </div>
</template>

<script>
import NavbarInRoom from '../components/NavbarInRoom'


export default {
  components: { NavbarInRoom },
  setup() {
    

    const Player = { name: 'Brian' };

    const haveRooms = null;

    return {  Player, haveRooms }
  }
}

</script>
