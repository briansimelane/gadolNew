<template>
  <div class="container-fluid">
    
      <NavbarLoggedIn />

      <div class="container">
        
        <h5>Welcome {{ Player.name }}</h5>
        
        <div class="row">
            <div class="col s12 m12">
              <p>This is the player restricted area. Here you will find your created rooms or be able to join another player's room.</p>
            </div>
        </div>

        <div class="row">
          <div class="col s12 m12 center">
            <router-link to="/create" class="waves-effect waves-light btn space-right amber accent-4  black-text"><i class="material-icons left">build</i>Create a room</router-link>
            <router-link to="/join" class="waves-effect waves-light btn amber accent-4  black-text"><i class="material-icons left">fingerprint</i>Join a room</router-link>
          </div>
        </div>



        <div class="row">
            <div class="col s12 m12">
              <h6>Your created rooms:</h6>
              <div v-show="!haveRooms">
                <p class="red-text"><em>You currenly have no rooms open</em></p>
              </div>

              <div v-show="haveRooms">
                <p class="green-text">You have rooms available</p>
              </div>

            </div>
        </div>

      </div>

  </div>
</template>

<script>
import NavbarLoggedIn from '../components/NavbarLoggedIn'

export default {
  components: { NavbarLoggedIn },
  setup() {
    const handleLogin = () => {
      console.log('Handle login clicked');
    };

    const Player = { name: 'Brian' };

    const haveRooms = null;

    return { handleLogin, Player, haveRooms }
  }
}

</script>
