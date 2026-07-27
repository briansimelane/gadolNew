import { ref } from 'vue'
import { projectAuth, projectFirestore } from '../firebase/config'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth'
import { collection, query, where, getDocs, doc, getDoc, setDoc } from 'firebase/firestore'

const role = ref(null)
const roomId = ref(null)
const seat = ref(null)
const userEmail = ref(null)
const userName = ref(null)

export const ensureCodeAuth = async () => {
  if (projectAuth.currentUser) return projectAuth.currentUser
  const guestEmail = 'player@gadol.com'
  const guestPassword = 'GadolPlayer123!'
  try {
    const res = await signInWithEmailAndPassword(projectAuth, guestEmail, guestPassword)
    return res.user
  } catch (err) {
    try {
      const res = await createUserWithEmailAndPassword(projectAuth, guestEmail, guestPassword)
      return res.user
    } catch (createErr) {
      console.warn('Could not establish guest auth session:', createErr)
      return null
    }
  }
}

const setSession = (newRole, newRoomId, newSeat, newEmail, newName) => {
  role.value = newRole
  roomId.value = newRoomId
  seat.value = newSeat
  userEmail.value = newEmail
  userName.value = newName

  if (newRole) localStorage.setItem('gadol_role', newRole)
  else localStorage.removeItem('gadol_role')

  if (newRoomId) localStorage.setItem('gadol_room_id', newRoomId)
  else localStorage.removeItem('gadol_room_id')

  if (newSeat !== null && newSeat !== undefined) localStorage.setItem('gadol_seat', String(newSeat))
  else localStorage.removeItem('gadol_seat')

  if (newEmail) localStorage.setItem('gadol_user_email', newEmail)
  else localStorage.removeItem('gadol_user_email')

  if (newName) localStorage.setItem('gadol_user_name', newName)
  else localStorage.removeItem('gadol_user_name')
}

const clearSession = () => {
  setSession(null, null, null, null, null)
}

const restoreSession = async () => {
  const storedRole = localStorage.getItem('gadol_role')
  const storedRoomId = localStorage.getItem('gadol_room_id')
  const storedSeat = localStorage.getItem('gadol_seat')
  const storedEmail = localStorage.getItem('gadol_user_email')
  const storedName = localStorage.getItem('gadol_user_name')

  if (storedRole) {
    if (storedRoomId && (storedRole === 'PLAYER' || storedRole === 'FACILITATOR' || storedRole === 'SPECTATOR')) {
      try {
        await ensureCodeAuth()
        const roomRef = doc(projectFirestore, 'rooms', storedRoomId)
        const roomSnap = await getDoc(roomRef)
        if (roomSnap.exists() && roomSnap.data().status === 'OPEN') {
          role.value = storedRole
          roomId.value = storedRoomId
          seat.value = storedSeat ? parseInt(storedSeat) : null
          userEmail.value = storedEmail
          userName.value = storedName
        } else if (roomSnap.exists() && roomSnap.data().status !== 'OPEN') {
          clearSession()
          return { success: false, message: 'This game has ended' }
        } else {
          role.value = storedRole
          roomId.value = storedRoomId
          seat.value = storedSeat ? parseInt(storedSeat) : null
          userEmail.value = storedEmail
          userName.value = storedName
        }
      } catch (err) {
        console.warn('Error fetching room snapshot during restoreSession, falling back to local session:', err)
        role.value = storedRole
        roomId.value = storedRoomId
        seat.value = storedSeat ? parseInt(storedSeat) : null
        userEmail.value = storedEmail
        userName.value = storedName
      }
    } else {
      await ensureCodeAuth()
      role.value = storedRole
      roomId.value = null
      seat.value = null
      userEmail.value = storedEmail
      userName.value = storedName
    }
  }
  return { success: true }
}

const loginWithCode = async (rawCode) => {
  if (!rawCode) return { success: false, message: 'Code cannot be empty' }
  const clean = (s) => (s || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase()
  const code = clean(rawCode)

  if (code === 'ADMINMASTER') {
    await ensureCodeAuth()
    setSession('ADMIN', null, null, null, 'Master Admin')
    return { success: true }
  }

  try {
    await ensureCodeAuth()

    const q = query(collection(projectFirestore, 'rooms'), where('status', '==', 'OPEN'))
    const querySnapshot = await getDocs(q)
    let matched = false
    let resolvedRole = null
    let resolvedRoomId = null
    let resolvedSeat = null

    querySnapshot.forEach((docSnap) => {
      if (matched) return
      const room = docSnap.data()
      const fallbackSpecCode = clean('SPEC-' + docSnap.id.substring(0, 4))

      if (clean(room.facilitatorCode) === code) {
        matched = true
        resolvedRole = 'FACILITATOR'
        resolvedRoomId = docSnap.id
      }
      
      if (!matched && ((room.spectatorCode && clean(room.spectatorCode) === code) || fallbackSpecCode === code)) {
        matched = true
        resolvedRole = 'SPECTATOR'
        resolvedRoomId = docSnap.id
      }

      if (!matched && room.seatCodes) {
        for (const [seatKey, seatVal] of Object.entries(room.seatCodes)) {
          if (clean(seatVal) === code) {
            matched = true
            resolvedRole = 'PLAYER'
            resolvedRoomId = docSnap.id
            resolvedSeat = parseInt(seatKey)
            break
          }
        }
      }
    })

    if (matched) {
      setSession(resolvedRole, resolvedRoomId, resolvedSeat, null, null)
      return { success: true, roomId: resolvedRoomId, role: resolvedRole }
    } else {
      return { success: false, message: 'Invalid access code' }
    }
  } catch (err) {
    console.error('Error logging in with code:', err)
    return { success: false, message: 'Connection error — try again' }
  }
}

const loginWithEmail = async (email, password) => {
  try {
    const res = await signInWithEmailAndPassword(projectAuth, email, password)
    if (!res.user) {
      throw new Error('Sign in failed')
    }

    const uid = res.user.uid
    const facRef = doc(projectFirestore, 'facilitators', uid)
    let facSnap = await getDoc(facRef)

    let roleVal = 'FACILITATOR'
    let nameVal = res.user.displayName || email.split('@')[0]

    if (email.toLowerCase() === 'brian@learningsims.co.za') {
      roleVal = 'ADMIN'
    }

    if (!facSnap.exists()) {
      const newFac = {
        uid,
        name: nameVal,
        email,
        role: roleVal,
        createdAt: new Date().toISOString(),
        createdByEmail: 'system',
        gamesCreatedCount: 0
      }
      await setDoc(facRef, newFac)
    } else {
      roleVal = facSnap.data().role || roleVal
      nameVal = facSnap.data().name || nameVal
    }

    setSession(roleVal, null, null, email, nameVal)
    return { success: true }
  } catch (err) {
    console.error('Error logging in with email:', err)
    return { success: false, message: err.message || 'Incorrect credentials' }
  }
}

const logout = async () => {
  try {
    await firebaseSignOut(projectAuth)
  } catch (err) {
    // Ignore
  }
  clearSession()
}

export default function useSession() {
  return {
    role,
    roomId,
    seat,
    userEmail,
    userName,
    loginWithCode,
    loginWithEmail,
    logout,
    restoreSession
  }
}
