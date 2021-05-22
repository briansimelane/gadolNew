<template>
  <div class="container-fluid">
    
      <Navbar />

      <div class="container">
        
        <h4>Login</h4>
        
        <div class="row">
            <div class="col s12 m12">
              <div class="card">
                
                <div class="card-content">
                  <p>If you are already registered, please complete you credentials to login.</p>

                <div class="row no-margin">
            <form class="col s12">
              
              <div class="row small-padding">
                <div class="input-field col s12">
                  <input id="email" type="email" class="validate">
                  <label for="email">Email</label>
                </div>
              </div>

              <div class="row small-padding">
                <div class="input-field col s12">
                  <input id="password" type="password" class="validate">
                  <label for="password">Password</label>
                </div>
              </div>
              
            </form>
          </div>

                </div>
                
                    <div class="center">
                    <a to="/join" class="waves-effect waves-light btn space-right green darken-3" @click="handleLogin"><i class="material-icons left">account_circle</i>Login</a>
                    <p class="multipadding-10">Not yet registered? Please <router-link to="/signup" class="">sign up</router-link> instead.</p>
                  </div>
                
              </div>
            </div>
        </div>

      </div>

  </div>
</template>

<script>
import Navbar from '../components/Navbar'

export default {
  components: { Navbar },
  setup() {
    const handleLogin = () => {
      console.log('Handle login clicked');
    }
    return { handleLogin }
  }
}

</script>

<style scoped>
.card-content {
  padding-bottom: 0;
}

.no-margin {
  margin: 0;
}

.small-padding {
  padding: 0;
}
</style>