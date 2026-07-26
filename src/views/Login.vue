<template>
  <div class="container-fluid loginBg">
    <Navbar />

    <div class="container" style="max-width: 480px; margin-top: 40px;">
      <div class="card">
        <!-- Tabs Header -->
        <div class="card-tabs">
          <ul class="tabs tabs-fixed-width">
            <li class="tab">
              <a 
                :class="{ active: activeTab === 'player' }" 
                @click="switchTab('player')" 
                class="teal-text text-darken-4 active-tab-btn"
                style="cursor: pointer; font-weight: bold;"
              >
                Player Access
              </a>
            </li>
            <li class="tab">
              <a 
                :class="{ active: activeTab === 'fac' }" 
                @click="switchTab('fac')" 
                class="teal-text text-darken-4 active-tab-btn"
                style="cursor: pointer; font-weight: bold;"
              >
                Facilitator
              </a>
            </li>
          </ul>
        </div>

        <!-- Card Content -->
        <div class="card-content grey lighten-4">
          <!-- Player Code Access Tab -->
          <div v-if="activeTab === 'player'">
            <p class="grey-text text-darken-2 center" style="margin-bottom: 20px;">
              Enter your access code to join the simulation room.
            </p>
            <form @submit.prevent="handleCodeLogin">
              <div class="row no-margin">
                <div class="input-field col s12">
                  <i class="material-icons prefix">vpn_key</i>
                  <input 
                    id="access_code" 
                    type="text" 
                    class="validate center-align" 
                    v-model="accessCode" 
                    placeholder="e.g. P1-KQWX"
                    required
                    style="text-transform: uppercase; font-size: 1.3rem; letter-spacing: 2px;"
                  >
                  <label for="access_code" class="active">Access Code</label>
                </div>
              </div>

              <div class="center" style="margin-top: 20px;">
                <div class="red-text text-darken-2 bold" style="min-height: 24px; margin-bottom: 10px;">{{ playerError }}</div>
                <button 
                  type="submit" 
                  class="waves-effect waves-light btn-large btn-block teal darken-3" 
                  :disabled="loading"
                >
                  <i class="material-icons left">play_arrow</i>Enter Game
                </button>
              </div>
            </form>
          </div>

          <!-- Facilitator & Admin Tab -->
          <div v-if="activeTab === 'fac'">
            <p class="grey-text text-darken-2 center" style="margin-bottom: 20px;">
              Facilitators & Administrators: Sign in with email.
            </p>
            <form @submit.prevent="handleEmailLogin">
              <div class="row small-padding no-margin">
                <div class="input-field col s12">
                  <i class="material-icons prefix">email</i>
                  <input id="email" type="email" class="validate" v-model="email" required>
                  <label for="email">Email Address</label>
                </div>
              </div>

              <div class="row small-padding no-margin" style="margin-top: 10px;">
                <div class="input-field col s12">
                  <i class="material-icons prefix">lock</i>
                  <input id="password" type="password" class="validate" v-model="password" required>
                  <label for="password">Password</label>
                </div>
              </div>

              <div class="center" style="margin-top: 20px;">
                <div class="red-text text-darken-2 bold" style="min-height: 24px; margin-bottom: 10px;">{{ facError }}</div>
                
                <button 
                  type="submit" 
                  class="waves-effect waves-light btn-large btn-block teal darken-3" 
                  :disabled="loading"
                  style="margin-bottom: 15px;"
                >
                  <i class="material-icons left">account_circle</i>Login
                </button>

                <div>
                  <a 
                    @click="handleForgotPassword" 
                    style="cursor: pointer; font-size: 0.9rem;"
                    class="teal-text text-darken-3"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import useSession from '../composables/useSession'
import { sendPasswordResetEmail } from 'firebase/auth'
import { projectAuth } from '../firebase/config'
import M from 'materialize-css'

export default {
  name: 'Login',
  components: { Navbar },
  setup() {
    const router = useRouter()
    const { loginWithCode, loginWithEmail, role, roomId } = useSession()

    const activeTab = ref('player')
    const accessCode = ref('')
    const email = ref('')
    const password = ref('')
    
    const loading = ref(false)
    const playerError = ref('')
    const facError = ref('')

    const switchTab = (tab) => {
      activeTab.value = tab
      playerError.value = ''
      facError.value = ''
    }

    const handleCodeLogin = async () => {
      if (loading.value) return
      loading.value = true
      playerError.value = ''

      const res = await loginWithCode(accessCode.value)
      loading.value = false

      if (res.success) {
        M.toast({ html: 'Successfully logged in!' })
        if (role.value === 'ADMIN' || role.value === 'FACILITATOR') {
          router.push({ name: 'FacilitatorHub' })
        } else {
          router.push({ name: 'GameRoom', params: { id: roomId.value } })
        }
      } else {
        playerError.value = res.message
      }
    }

    const handleEmailLogin = async () => {
      if (loading.value) return
      loading.value = true
      facError.value = ''

      const res = await loginWithEmail(email.value, password.value)
      loading.value = false

      if (res.success) {
        M.toast({ html: 'Successfully logged in!' })
        router.push({ name: 'FacilitatorHub' })
      } else {
        facError.value = res.message
      }
    }

    const handleForgotPassword = async () => {
      if (!email.value) {
        facError.value = 'Please enter your email address first.'
        return
      }
      loading.value = true
      try {
        await sendPasswordResetEmail(projectAuth, email.value)
        M.toast({ html: 'Password reset email sent!' })
        facError.value = ''
      } catch (err) {
        facError.value = err.message
      } finally {
        loading.value = false
      }
    }

    return {
      activeTab,
      accessCode,
      email,
      password,
      loading,
      playerError,
      facError,
      switchTab,
      handleCodeLogin,
      handleEmailLogin,
      handleForgotPassword
    }
  }
}
</script>

<style scoped>
.btn-block {
  width: 100%;
}
.bold {
  font-weight: bold;
}
.no-margin {
  margin: 0 !important;
}
.tabs .tab a.active {
  border-bottom: 2px solid #004d40 !important;
  background-color: #e0f2f1 !important;
}
.active-tab-btn:hover {
  background-color: rgba(0, 77, 64, 0.05);
}
</style>