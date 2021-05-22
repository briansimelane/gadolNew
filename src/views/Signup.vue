<template>
  <div class="container-fluid">
    
      <Navbar />

      <div class="container">
        
        <h4>Sign up</h4>
        
        <div class="row">
            <div class="col s12 m12">
              <div class="card">
                
                <div class="card-content">
                  <p>To play you need to register - please complete the following.</p>

                <div class="row no-margin">
            <form class="col s12">
              <div class="row small-padding">
                <div class="input-field col s6">
                  <input placeholder="" id="first_name" type="text" class="validate">
                  <label for="first_name">First Name</label>
                </div>
                <div class="input-field col s6">
                  <input id="last_name" type="text" class="validate">
                  <label for="last_name">Last Name</label>
                </div>
              </div>
              
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
                    <a to="/join" class="waves-effect waves-light btn space-right green darken-3" @click="handleSignup"><i class="material-icons left">add_circle</i>Sign up</a>
                    <p class="multipadding-10">Registered already? Please <router-link to="/login" class="">login</router-link> instead.</p>
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
    const handleSignup = () => {
      console.log('Handle signup clicked');
    }
    return { handleSignup }
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