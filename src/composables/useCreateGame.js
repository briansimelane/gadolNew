import { collection, query, where, getDocs, addDoc } from 'firebase/firestore'
import { projectFirestore } from '../firebase/config'
import resetData from '../assets/reset.json'
import { ensureCodeAuth } from './useSession'

const randAlpha4 = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = ''
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

const randDigit4 = () => {
  let result = ''
  for (let i = 0; i < 4; i++) {
    result += Math.floor(Math.random() * 10)
  }
  return result
}

const shuffle = (array) => {
  const newArray = [...array]
  let top = newArray.length
  if (top) while (--top) {
    const current = Math.floor(Math.random() * (top + 1))
    const tmp = newArray[current]
    newArray[current] = newArray[top]
    newArray[top] = tmp
  }
  return newArray
}

export default function useCreateGame() {
  const createGame = async (roomName, numberPlayers, gameTimed, gameReserve = 'no', gameWinCondition, facilitatorUid, facilitatorEmail, facilitatorName, turnDurationSeconds = 60) => {
    try {
      // 0. Ensure Firebase Auth session is active
      await ensureCodeAuth()

      // 1. Get existing codes of OPEN rooms to prevent collisions
      const q = query(collection(projectFirestore, 'rooms'), where('status', '==', 'OPEN'))
      const querySnapshot = await getDocs(q)
      const existingCodes = new Set()
      
      querySnapshot.forEach((doc) => {
        const room = doc.data()
        if (room.facilitatorCode) existingCodes.add(room.facilitatorCode)
        if (room.seatCodes) {
          Object.values(room.seatCodes).forEach(c => existingCodes.add(c))
        }
      })

      // 2. Generate unique codes
      let facilitatorCode = ''
      do {
        facilitatorCode = `FAC-${randDigit4()}`
      } while (existingCodes.has(facilitatorCode))
      existingCodes.add(facilitatorCode)

      let spectatorCode = ''
      do {
        spectatorCode = `SPEC-${randDigit4()}`
      } while (existingCodes.has(spectatorCode))
      existingCodes.add(spectatorCode)

      const seatCodes = {}
      for (let i = 1; i <= 4; i++) {
        let seatCode = ''
        do {
          seatCode = `P${i}-${randAlpha4()}`
        } while (existingCodes.has(seatCode))
        existingCodes.add(seatCode)
        seatCodes[String(i)] = seatCode
      }

      // 3. Shuffling and game values setup
      const resetValues = resetData.ResetTable
      
      // Resource Cards
      const resetRedCards = resetValues.resourcesCards.redCards
      const resetGreenCards = resetValues.resourcesCards.greenCards
      const resetYellowCards = resetValues.resourcesCards.yellowCards
      const resetPurpleCards = resetValues.resourcesCards.purpleCards
      const resetBlackCards = resetValues.resourcesCards.blackCards
      const resetContractCards = resetValues.contractCards

      const shuffledContractCards = shuffle(resetContractCards)
      const shuffledGreenCards = shuffle(resetGreenCards)
      const shuffledYellowCards = shuffle(resetYellowCards)
      const shuffledRedCards = shuffle(resetRedCards)
      const shuffledPurpleCards = shuffle(resetPurpleCards)
      const shuffledBlackCards = shuffle(resetBlackCards)

      // Starting stats
      const playerStartCash = resetValues.playerReset.cash
      const playerStartProduction = resetValues.playerReset.production
      const playerTempRed = resetValues.playerReset.temporaryResources.red
      const playerTempGreen = resetValues.playerReset.temporaryResources.green
      const playerTempYellow = resetValues.playerReset.temporaryResources.yellow
      const playerTempPurple = resetValues.playerReset.temporaryResources.purple
      const playerTempBlack = resetValues.playerReset.temporaryResources.black
      const playerPermRed = resetValues.playerReset.permanentResources.red
      const playerPermGreen = resetValues.playerReset.permanentResources.green
      const playerPermYellow = resetValues.playerReset.permanentResources.yellow
      const playerPermPurple = resetValues.playerReset.permanentResources.purple
      const playerPermBlack = resetValues.playerReset.permanentResources.black
      const playerStartValue = resetValues.playerReset.value
      const playerStartCost = resetValues.playerReset.cost
      const playerStartDebtors = resetValues.playerReset.debtors

      const makePlayerScore = () => ({
        greenTemp: playerTempGreen,
        redTemp: playerTempRed,
        yellowTemp: playerTempYellow,
        purpleTemp: playerTempPurple,
        blackTemp: playerTempBlack,
        greenPerm: playerPermGreen,
        redPerm: playerPermRed,
        yellowPerm: playerPermYellow,
        purplePerm: playerPermPurple,
        blackPerm: playerPermBlack,
        cash: playerStartCash,
        production: playerStartProduction,
        value: playerStartValue,
        costs: playerStartCost,
        debtors: playerStartDebtors,
        TempTokensTakenCounter: 0,
        greenTokenTaken: false,
        redTokenTaken: false,
        yellowTokenTaken: false,
        purpleTokenTaken: false,
        blackTokenTaken: false
      })

      const playersArray = []
      for (let i = 1; i <= 4; i++) {
        playersArray.push({
          seat: i,
          joined: false,
          name: '',
          online: false,
          uid: '',
          scores: makePlayerScore()
        })
      }

      const isTimedBool = gameTimed === 'yes' || gameTimed === true
      const parsedDuration = parseInt(turnDurationSeconds) || 60

      // Complete roomDetails payload
      const roomDetails = {
        creator: facilitatorUid || 'FACILITATOR-UID',
        createdByUid: facilitatorUid || 'FACILITATOR-UID',
        createdByEmail: facilitatorEmail || 'facilitator@gadol.com',
        createdByName: facilitatorName || 'Facilitator',
        createdAt: new Date().toISOString(),
        status: 'OPEN',
        schemaVersion: 3,

        name: roomName || 'Game Room',
        numPlayers: String(numberPlayers || 4),
        timed: gameTimed || 'no',
        turnDurationSeconds: parsedDuration,
        turnDeadline: 0,
        turnRemainingMs: parsedDuration * 1000,
        timerStatus: isTimedBool ? 'paused' : 'none',
        gameStarted: false,
        reserve: gameReserve || 'no',
        rules: gameWinCondition || 'points',
        maxnumberofplayers: resetValues?.numberOfPlayers || 4,
        lastAction: '',
        turnNumber: 1,
        gameLog: [],

        gstate: 0,
        modalPoints: false,
        modalContracts: false,
        facilitator: facilitatorUid || 'FACILITATOR-UID',
        currentPlayer: 0,
        z00contractCards: shuffledContractCards || [],
        z01greenCards: shuffledGreenCards || [],
        z02yellowCards: shuffledYellowCards || [],
        z03redCards: shuffledRedCards || [],
        z04purpleCards: shuffledPurpleCards || [],
        z05blackCards: shuffledBlackCards || [],
        z06holderCards: [0, 0, 0],
        z07marketRedTokens: resetValues?.temporaryResources?.red || 12,
        z08marketGreenTokens: resetValues?.temporaryResources?.green || 12,
        z09marketYellowTokens: resetValues?.temporaryResources?.yellow || 12,
        z10marketPurpleTokens: resetValues?.temporaryResources?.purple || 12,
        z11marketBlackTokens: resetValues?.temporaryResources?.black || 12,
        
        players: playersArray,
        facilitatorCode: facilitatorCode || `FAC-0000`,
        spectatorCode: spectatorCode || `SPEC-0000`,
        seatCodes: seatCodes || {}
      }

      // Sanitize payload to strip any undefined properties before Firestore insertion
      const cleanPayload = JSON.parse(JSON.stringify(roomDetails))

      const docRef = await addDoc(collection(projectFirestore, 'rooms'), cleanPayload)
      return { success: true, id: docRef.id, data: cleanPayload }
    } catch (err) {
      console.error('Error creating game:', err)
      return { success: false, message: err.message }
    }
  }

  return { createGame }
}
