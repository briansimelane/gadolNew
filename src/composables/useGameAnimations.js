import { nextTick } from 'vue'
import gsap from 'gsap'
import Flip from 'gsap/Flip'

gsap.registerPlugin(Flip)

export function useGameAnimations() {
  let ctx = null

  /**
   * Initialize GSAP Context bound to a container element for automatic cleanup.
   * @param {HTMLElement|Ref<HTMLElement>} containerRef 
   */
  const initAnimations = (containerRef) => {
    const el = containerRef && containerRef.value ? containerRef.value : containerRef
    ctx = gsap.context(() => {}, el || document.body)
  }

  /**
   * Revert all animations and cleanup context on component unmount.
   */
  const cleanupAnimations = () => {
    if (ctx) {
      ctx.revert()
      ctx = null
    }
  }

  /**
   * Helper to color hex/glow values for tokens
   */
  const getColorGlow = (color) => {
    const glows = {
      green: '#00e676',
      yellow: '#ffea00',
      red: '#ff1744',
      purple: '#d500f9',
      black: '#78909c'
    }
    return glows[color] || '#00e676'
  }

  /**
   * Action A: Buying Tokens
   * Animates floating tokens flying across the screen from TokenMarket (or Modal)
   * to the Active Player's Panel with parabola trajectory, glow, and landing pulse.
   */
  const animateTokenPurchase = async ({
    color,
    count = 1,
    sourceEl = null,
    targetEl = null,
    stateUpdateCallback = null
  }) => {
    const colLower = (color || 'green').toLowerCase()

    // 1. Locate source pill (check acquire modal or market bar)
    const sourcePill = sourceEl || 
      document.querySelector(`.custom-modal-overlay .token-mini-img[src*="${colLower}"]`) ||
      document.querySelector(`.token-mini-img[src*="${colLower}"]`) ||
      document.querySelector(`.token-pill.${colLower}-pill`)

    // 2. Locate EXACT color target slot (prioritizes active player's specific color slot)
    const targetArea = targetEl || 
      document.querySelector(`.PlayerScoreArea[data-is-active="true"] [data-token-color="${colLower}"]`) ||
      document.querySelector(`.team-matrix-row[data-is-active="true"] .color-matrix-box[data-color="${colLower}"] .tokens-val`) ||
      document.querySelector(`.team-matrix-row[data-is-active="true"] .color-matrix-box.${colLower} .tokens-val`) ||
      document.querySelector(`.team-matrix-row[data-is-active="true"] .color-matrix-box.${colLower}`) ||
      document.querySelector(`[data-token-color="${colLower}"]`) ||
      document.querySelector(`.color-matrix-box.${colLower}`) ||
      document.querySelector(`.PlayerScoreArea[data-is-active="true"] .scorePlayerTempResources`) ||
      document.querySelector(`.team-matrix-row[data-is-active="true"]`) ||
      document.querySelector(`.PlayerScoreArea`)

    if (!sourcePill || !targetArea) {
      if (stateUpdateCallback) await stateUpdateCallback()
      return
    }

    const sourceRect = sourcePill.getBoundingClientRect()
    const targetRect = targetArea.getBoundingClientRect()
    const glowColor = getColorGlow(colLower)

    const clones = []

    for (let i = 0; i < count; i++) {
      const clone = document.createElement('div')
      clone.className = `floating-token-animation`
      clone.style.cssText = `
        position: fixed;
        left: ${sourceRect.left + sourceRect.width / 2 - 20}px;
        top: ${sourceRect.top + sourceRect.height / 2 - 20}px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        z-index: 100000;
        pointer-events: none;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 20px ${glowColor}, 0 6px 16px rgba(0,0,0,0.5);
        background: #ffffff;
        border: 2px solid ${glowColor};
        will-change: transform, opacity;
      `

      const img = document.createElement('img')
      img.src = new URL(`../assets/img/${colLower}Token.png`, import.meta.url).href
      img.style.cssText = 'width: 28px; height: 28px; object-fit: contain;'
      clone.appendChild(img)

      document.body.appendChild(clone)
      clones.push(clone)
    }

    if (stateUpdateCallback) {
      await stateUpdateCallback()
      await nextTick()
    }

    // Parabolic curved trajectory to target area
    const startX = sourceRect.left + sourceRect.width / 2 - 20
    const startY = sourceRect.top + sourceRect.height / 2 - 20
    const endX = targetRect.left + targetRect.width / 2 - 20
    const endY = targetRect.top + targetRect.height / 2 - 20

    const deltaX = endX - startX
    const deltaY = endY - startY
    const arcHeight = Math.min(-120, deltaY - 80) // Parabola arc upwards

    clones.forEach((clone, index) => {
      const tl = gsap.timeline({
        delay: index * 0.12,
        onComplete: () => {
          // Trigger impact pulse on player panel target
          gsap.fromTo(
            targetArea,
            { scale: 1.15, boxShadow: `0 0 25px ${glowColor}` },
            { scale: 1, boxShadow: 'none', duration: 0.35, ease: 'back.out(2)' }
          )
          clone.remove()
        }
      })

      // Flight sequence
      tl.to(clone, {
        duration: 0.7,
        x: deltaX,
        y: deltaY,
        scale: 1.25,
        rotation: 360,
        ease: 'power1.inOut'
      })
      .to(clone, {
        duration: 0.35,
        y: startY + arcHeight,
        ease: 'power2.out'
      }, 0)
      .to(clone, {
        duration: 0.35,
        y: deltaY,
        ease: 'power2.in'
      }, 0.35)
    })
  }

  /**
   * Action B: Buying a Card
   * Creates a prominent floating card visual clone that lifts (1.2x scale + glow),
   * rotates slightly (-4° to +4°), and flies smoothly across the screen into the player panel.
   */
  const animateCardPurchase = async ({
    cardEl = null,
    cardData = null,
    color = null,
    targetAreaEl = null,
    stateUpdateCallback = null
  }) => {
    const sourceCard = cardEl || 
      (cardData ? document.querySelector(`[data-card-ref="${cardData.Ref}"]`) : null) ||
      document.querySelector('.zoom-backdrop .resource_card, .zoom-backdrop .contract_card') ||
      document.querySelector('.resource-card-holder')

    const cardColor = (color || cardData?.Colour || sourceCard?.dataset?.color || 'green').toLowerCase()

    // 2. Locate EXACT color card target slot
    const targetArea = targetAreaEl || 
      document.querySelector(`.PlayerScoreArea[data-is-active="true"] [data-card-color="${cardColor}"]`) ||
      document.querySelector(`.team-matrix-row[data-is-active="true"] .color-matrix-box[data-color="${cardColor}"] .cards-val`) ||
      document.querySelector(`.team-matrix-row[data-is-active="true"] .color-matrix-box.${cardColor} .cards-val`) ||
      document.querySelector(`.team-matrix-row[data-is-active="true"] .color-matrix-box.${cardColor}`) ||
      document.querySelector(`[data-card-color="${cardColor}"]`) ||
      document.querySelector(`.color-matrix-box.${cardColor}`) ||
      document.querySelector(`.PlayerScoreArea[data-is-active="true"] .scorePlayerPermResources`) ||
      document.querySelector(`.team-matrix-row[data-is-active="true"]`) ||
      document.querySelector(`.PlayerScoreArea`)

    if (!sourceCard || !targetArea) {
      if (stateUpdateCallback) await stateUpdateCallback()
      return
    }

    const cardRect = sourceCard.getBoundingClientRect()
    const targetRect = targetArea.getBoundingClientRect()

    // Create high z-index overlay clone
    const clone = sourceCard.cloneNode(true)
    clone.className += ' animated-card-clone'
    clone.style.cssText = `
      position: fixed;
      left: ${cardRect.left}px;
      top: ${cardRect.top}px;
      width: ${cardRect.width}px;
      height: ${cardRect.height}px;
      z-index: 100000;
      pointer-events: none;
      box-shadow: 0 16px 32px rgba(0,0,0,0.4), 0 0 25px rgba(0, 150, 136, 0.6);
      transform-origin: center center;
      will-change: transform, opacity;
    `
    document.body.appendChild(clone)

    if (stateUpdateCallback) {
      await stateUpdateCallback()
      await nextTick()
    }

    const deltaX = targetRect.left + targetRect.width / 2 - (cardRect.left + cardRect.width / 2)
    const deltaY = targetRect.top + targetRect.height / 2 - (cardRect.top + cardRect.height / 2)
    const randomRotation = (Math.random() - 0.5) * 8

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.fromTo(
          targetArea,
          { scale: 1.06, outline: '3px solid #00796b' },
          { scale: 1, outline: 'none', duration: 0.4, ease: 'back.out(2)' }
        )
        clone.remove()
      }
    })

    // Phase 1: Lift & Elevate
    tl.to(clone, {
      scale: 1.2,
      rotation: randomRotation,
      duration: 0.25,
      ease: 'power2.out'
    })

    // Phase 2: Flight across screen to target area
    tl.to(clone, {
      x: deltaX,
      y: deltaY,
      scale: 0.6,
      rotation: 0,
      duration: 0.65,
      ease: 'power2.inOut'
    })

    // Phase 3: Landing snap
    tl.to(clone, {
      opacity: 0,
      scale: 0.4,
      duration: 0.15
    })
  }

  /**
   * Action C: Fulfilling a Contract
   * Multi-stage high-impact visual sequence:
   * 1. Payment: Required token icons fly from Player Panel into center of Contract Card.
   * 2. Processing: Gold/Green success pulse glow around Contract Card.
   * 3. Resolution: Contract 3D flips (rotateY 180°), flies to player's score pile, and pops score particle!
   */
  const animateContractFulfillment = async ({
    contractEl = null,
    cardData = null,
    targetAreaEl = null,
    stateUpdateCallback = null
  }) => {
    const contract = contractEl || 
      (cardData ? document.querySelector(`[data-card-ref="${cardData.Ref}"]`) : null) ||
      document.querySelector('.zoom-backdrop .contract_card') ||
      document.querySelector('.contract_card')

    const scorePile = targetAreaEl || 
      document.querySelector('.PlayerScoreArea[data-is-active="true"] .scoreFinancials') ||
      document.querySelector('.team-matrix-row[data-is-active="true"] .team-financials-grid') ||
      document.querySelector('.team-matrix-row[data-is-active="true"]') ||
      document.querySelector('.scoreFinancials') ||
      document.querySelector('.team-matrix-row') ||
      document.querySelector('.PlayerScoreArea')

    if (!contract) {
      if (stateUpdateCallback) await stateUpdateCallback()
      return
    }

    const contractRect = contract.getBoundingClientRect()

    // Create high z-index overlay clone of contract card
    const clone = contract.cloneNode(true)
    clone.style.cssText = `
      position: fixed;
      left: ${contractRect.left}px;
      top: ${contractRect.top}px;
      width: ${contractRect.width}px;
      height: ${contractRect.height}px;
      z-index: 100000;
      pointer-events: none;
      transform-origin: center center;
      will-change: transform, opacity;
      perspective: 1000px;
    `
    document.body.appendChild(clone)

    const tl = gsap.timeline({
      onComplete: async () => {
        if (stateUpdateCallback) {
          await stateUpdateCallback()
          await nextTick()
        }
        clone.remove()
      }
    })

    // Phase 1: Payment Tokens Fly in
    const sourceTokens = document.querySelectorAll('.scorePlayerTempResources img')
    const paymentClones = []

    sourceTokens.forEach((tok, idx) => {
      if (idx >= 3) return
      const tokRect = tok.getBoundingClientRect()
      const pClone = tok.cloneNode(true)
      pClone.style.cssText = `
        position: fixed;
        left: ${tokRect.left}px;
        top: ${tokRect.top}px;
        width: 28px;
        height: 28px;
        z-index: 100001;
        pointer-events: none;
        will-change: transform, opacity;
      `
      document.body.appendChild(pClone)
      paymentClones.push(pClone)
    })

    if (paymentClones.length > 0) {
      const centerX = contractRect.left + contractRect.width / 2 - 14
      const centerY = contractRect.top + contractRect.height / 2 - 14

      tl.to(paymentClones, {
        duration: 0.45,
        left: centerX,
        top: centerY,
        scale: 0.8,
        stagger: 0.08,
        ease: 'power2.inOut'
      })
      .to(paymentClones, {
        opacity: 0,
        scale: 0.1,
        duration: 0.2,
        onComplete: () => paymentClones.forEach(p => p.remove())
      })
    }

    // Phase 2: Gold Success Burst & Pulse
    tl.to(clone, {
      scale: 1.15,
      boxShadow: '0 0 35px #ffd700, 0 0 15px #2e7d32, 0 12px 28px rgba(0,0,0,0.5)',
      duration: 0.35,
      ease: 'back.out(2.5)'
    }, '-=0.1')

    // Phase 3: 3D Card Flip (rotateY: 180deg) & Flight to Score Area
    tl.to(clone, {
      rotateY: 180,
      duration: 0.5,
      ease: 'power2.inOut'
    })

    if (scorePile) {
      const scoreRect = scorePile.getBoundingClientRect()
      const deltaX = scoreRect.left + scoreRect.width / 2 - (contractRect.left + contractRect.width / 2)
      const deltaY = scoreRect.top + scoreRect.height / 2 - (contractRect.top + contractRect.height / 2)

      tl.to(clone, {
        x: deltaX,
        y: deltaY,
        scale: 0.4,
        opacity: 0,
        duration: 0.55,
        ease: 'power2.in'
      })

      // Score counter impact pop
      tl.add(() => {
        gsap.fromTo(
          scorePile,
          { scale: 1.1, color: '#2e7d32' },
          { scale: 1, color: '', duration: 0.4, ease: 'elastic.out(1, 0.5)' }
        )
      })
    }
  }

  const getSeatColor = (seatVal) => {
    if (seatVal === 1) return '#fdb410'
    if (seatVal === 2) return '#007b46'
    if (seatVal === 3) return '#1565c0'
    if (seatVal === 4) return '#e21234'
    return '#007b46'
  }

  /**
   * Action D: Allocating Managers to a Resource Card
   * Meeples fly from Team Supply to target Resource Card with a pop/drop landing effect.
   */
  const animateManagerAllocation = async ({
    cardRef,
    seat = 1,
    count = 1,
    stateUpdateCallback = null
  }) => {
    const cardEl = document.querySelector(`[data-card-ref="${cardRef}"]`)
    const sourceSupply = document.querySelector(`.PlayerScoreArea[data-is-active="true"] .player-managers-bar`) ||
      document.querySelector(`.team-matrix-row[data-is-active="true"] .team-managers-matrix`) ||
      document.querySelector(`.player-managers-bar, .team-managers-matrix`)

    if (!cardEl || !sourceSupply) {
      if (stateUpdateCallback) await stateUpdateCallback()
      return
    }

    const sourceRect = sourceSupply.getBoundingClientRect()
    const targetRect = cardEl.getBoundingClientRect()
    const teamColor = getSeatColor(seat)

    const meeples = []
    for (let i = 0; i < count; i++) {
      const meeple = document.createElement('div')
      meeple.innerHTML = '<i class="material-icons">person</i>'
      meeple.style.cssText = `
        position: fixed;
        left: ${sourceRect.left + sourceRect.width / 2 - 16}px;
        top: ${sourceRect.top + sourceRect.height / 2 - 16}px;
        width: 32px;
        height: 32px;
        color: ${teamColor};
        z-index: 100000;
        pointer-events: none;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4));
        will-change: transform, opacity;
      `
      document.body.appendChild(meeple)
      meeples.push(meeple)
    }

    if (stateUpdateCallback) {
      await stateUpdateCallback()
      await nextTick()
    }

    const deltaX = targetRect.left - 4 - (sourceRect.left + sourceRect.width / 2)
    const deltaY = targetRect.bottom - 16 - (sourceRect.top + sourceRect.height / 2)

    meeples.forEach((m, idx) => {
      gsap.to(m, {
        duration: 0.65,
        x: deltaX + (idx * 6),
        y: deltaY + (idx * 4),
        scale: 1.3,
        rotation: 360,
        delay: idx * 0.08,
        ease: 'back.out(1.7)',
        onComplete: () => {
          gsap.fromTo(
            cardEl,
            { scale: 1.08, boxShadow: `0 0 25px ${teamColor}` },
            { scale: 1, boxShadow: 'none', duration: 0.35, ease: 'back.out(2)' }
          )
          m.remove()
        }
      })
    })
  }

  /**
   * Action E: Reclaiming Managers when Purchasing Card
   * Meeples fly off the card back into Team Supply.
   */
  const animateManagerReturn = async ({
    cardRef,
    seat = 1,
    count = 1,
    stateUpdateCallback = null
  }) => {
    const cardEl = document.querySelector(`[data-card-ref="${cardRef}"]`)
    const targetSupply = document.querySelector(`.PlayerScoreArea[data-is-active="true"] .player-managers-bar`) ||
      document.querySelector(`.team-matrix-row[data-is-active="true"] .team-managers-matrix`) ||
      document.querySelector(`.player-managers-bar, .team-managers-matrix`)

    if (!cardEl || !targetSupply) {
      if (stateUpdateCallback) await stateUpdateCallback()
      return
    }

    const sourceRect = cardEl.getBoundingClientRect()
    const targetRect = targetSupply.getBoundingClientRect()
    const teamColor = getSeatColor(seat)

    const meeples = []
    for (let i = 0; i < count; i++) {
      const meeple = document.createElement('div')
      meeple.innerHTML = '<i class="material-icons">person</i>'
      meeple.style.cssText = `
        position: fixed;
        left: ${sourceRect.left - 4 - 16}px;
        top: ${sourceRect.bottom - 32}px;
        width: 32px;
        height: 32px;
        color: ${teamColor};
        z-index: 100000;
        pointer-events: none;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4));
        will-change: transform, opacity;
      `
      document.body.appendChild(meeple)
      meeples.push(meeple)
    }

    if (stateUpdateCallback) {
      await stateUpdateCallback()
      await nextTick()
    }

    const deltaX = targetRect.left + targetRect.width / 2 - (sourceRect.left + sourceRect.width / 2)
    const deltaY = targetRect.top + targetRect.height / 2 - (sourceRect.top + sourceRect.height / 2)

    meeples.forEach((m, idx) => {
      gsap.to(m, {
        duration: 0.6,
        x: deltaX,
        y: deltaY,
        scale: 0.8,
        delay: idx * 0.08,
        ease: 'power2.inOut',
        onComplete: () => {
          gsap.fromTo(
            targetSupply,
            { scale: 1.12 },
            { scale: 1, duration: 0.35, ease: 'bounce.out' }
          )
          m.remove()
        }
      })
    })
  }

  /**
   * Action F: Moving a Card to In Play Space (Space A or Space B)
   * Card flies from Market / Zoom Overlay directly to the In Play Space tile.
   */
  const animateMoveToInPlay = async ({
    cardEl = null,
    cardData = null,
    targetSpace = 'A',
    stateUpdateCallback = null
  }) => {
    const sourceCard = cardEl ||
      (cardData ? document.querySelector(`[data-card-ref="${cardData.Ref}"]`) : null) ||
      document.querySelector('.zoom-backdrop .resource_card, .zoom-backdrop .contract_card') ||
      document.querySelector('.resource-card-holder')

    const targetArea = document.querySelector(`[data-inplay-space="${targetSpace}"]`) ||
      document.querySelector('.in-play-pair-tile') ||
      document.body

    if (!sourceCard || !targetArea) {
      if (stateUpdateCallback) await stateUpdateCallback()
      return
    }

    const cardRect = sourceCard.getBoundingClientRect()
    const targetRect = targetArea.getBoundingClientRect()

    const clone = sourceCard.cloneNode(true)
    clone.className += ' animated-card-clone'
    clone.style.cssText = `
      position: fixed;
      left: ${cardRect.left}px;
      top: ${cardRect.top}px;
      width: ${cardRect.width}px;
      height: ${cardRect.height}px;
      z-index: 100000;
      pointer-events: none;
      box-shadow: 0 16px 36px rgba(0, 121, 107, 0.7), 0 0 25px rgba(0, 150, 136, 0.8);
      transform-origin: center center;
      will-change: transform, opacity;
    `
    document.body.appendChild(clone)

    if (stateUpdateCallback) {
      await stateUpdateCallback()
      await nextTick()
    }

    const deltaX = targetRect.left + targetRect.width / 2 - (cardRect.left + cardRect.width / 2)
    const deltaY = targetRect.top + targetRect.height / 2 - (cardRect.top + cardRect.height / 2)

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.fromTo(
          targetArea,
          { scale: 1.08, outline: '3px solid #00796b' },
          { scale: 1, outline: 'none', duration: 0.4, ease: 'back.out(2)' }
        )
        clone.remove()
      }
    })

    tl.to(clone, {
      scale: 1.15,
      rotation: targetSpace === 'B' ? 6 : -6,
      duration: 0.25,
      ease: 'power2.out'
    })

    tl.to(clone, {
      x: deltaX,
      y: deltaY,
      scale: 0.5,
      rotation: 0,
      duration: 0.6,
      ease: 'power2.inOut'
    })

    tl.to(clone, {
      opacity: 0,
      scale: 0.3,
      duration: 0.15
    })
  }

  /**
   * Action G: Discarding a Card from In Play Space
   * High-impact card explosion with glowing shockwave ring and 20 360-degree card shrapnel shards.
   */
  const animateCardDiscard = async ({
    cardEl = null,
    cardData = null,
    targetSpace = 'A',
    stateUpdateCallback = null
  }) => {
    const sourceCard = cardEl ||
      (cardData ? document.querySelector(`[data-card-ref="${cardData.Ref}"]`) : null) ||
      document.querySelector('.zoom-backdrop .resource_card, .zoom-backdrop .contract_card') ||
      document.querySelector(`[data-inplay-space="${targetSpace}"]`) ||
      document.querySelector('.in-play-pair-tile')

    if (!sourceCard) {
      if (stateUpdateCallback) await stateUpdateCallback()
      return
    }

    const cardRect = sourceCard.getBoundingClientRect()
    const centerX = cardRect.left + cardRect.width / 2
    const centerY = cardRect.top + cardRect.height / 2

    // Main Card Clone
    const clone = sourceCard.cloneNode(true)
    clone.className += ' animated-card-clone'
    clone.style.cssText = `
      position: fixed;
      left: ${cardRect.left}px;
      top: ${cardRect.top}px;
      width: ${cardRect.width}px;
      height: ${cardRect.height}px;
      z-index: 100000;
      pointer-events: none;
      box-shadow: 0 0 35px #ff3d00, 0 0 70px #ff9100;
      transform-origin: center center;
      will-change: transform, opacity, filter;
    `
    document.body.appendChild(clone)

    // Shockwave Ring Element
    const shockwave = document.createElement('div')
    shockwave.style.cssText = `
      position: fixed;
      left: ${centerX - 25}px;
      top: ${centerY - 25}px;
      width: 50px;
      height: 50px;
      border: 4px solid #ff3d00;
      border-radius: 50%;
      z-index: 100001;
      pointer-events: none;
      box-shadow: 0 0 20px #ff9100, inset 0 0 20px #ff3d00;
      opacity: 1;
      transform-origin: center center;
    `
    document.body.appendChild(shockwave)

    // 20 Fiery Card Shards / Shrapnel Elements
    const shards = []
    const shardColors = ['#ff3d00', '#ff9100', '#ffea00', '#dd2c00', '#ff6d00', '#ffffff', '#26a69a']

    for (let i = 0; i < 20; i++) {
      const shard = document.createElement('div')
      const size = 6 + Math.floor(Math.random() * 12)
      const color = shardColors[Math.floor(Math.random() * shardColors.length)]
      shard.style.cssText = `
        position: fixed;
        left: ${centerX - size / 2}px;
        top: ${centerY - size / 2}px;
        width: ${size}px;
        height: ${size * (0.6 + Math.random() * 1.2)}px;
        background: ${color};
        border-radius: ${Math.random() > 0.5 ? '2px' : '50%'};
        z-index: 100002;
        pointer-events: none;
        box-shadow: 0 0 10px ${color};
        will-change: transform, opacity;
      `
      document.body.appendChild(shard)
      shards.push(shard)
    }

    if (stateUpdateCallback) {
      await stateUpdateCallback()
      await nextTick()
    }

    const tl = gsap.timeline({
      onComplete: () => {
        clone.remove()
        shockwave.remove()
        shards.forEach(s => s.remove())
      }
    })

    // Phase 1: Rapid Charge-Up & Intense Vibration
    tl.to(clone, {
      scale: 1.18,
      filter: 'brightness(1.8) saturate(2)',
      duration: 0.18,
      ease: 'power2.out'
    })
    .to(clone, {
      x: (Math.random() - 0.5) * 16,
      y: (Math.random() - 0.5) * 16,
      rotation: (Math.random() - 0.5) * 14,
      duration: 0.08,
      repeat: 3,
      yoyo: true,
      ease: 'rough'
    })

    // Phase 2: BOOM! Card Flash Expand & Shatter Dissolve
    tl.to(clone, {
      scale: 1.5,
      opacity: 0,
      filter: 'brightness(4) contrast(2)',
      duration: 0.15,
      ease: 'power4.out'
    })

    // Shockwave expansion
    gsap.to(shockwave, {
      width: 280,
      height: 280,
      x: -115,
      y: -115,
      opacity: 0,
      borderWidth: 1,
      duration: 0.45,
      ease: 'power2.out',
      delay: 0.18
    })

    // Shrapnel Shards 360-Degree Radial Explosion Physics
    shards.forEach((s, idx) => {
      const angle = (idx / 20) * Math.PI * 2 + (Math.random() - 0.5) * 0.4
      const distance = 80 + Math.random() * 160
      const targetX = Math.cos(angle) * distance
      const targetY = Math.sin(angle) * distance
      const rotationSpeed = (Math.random() - 0.5) * 1080

      gsap.to(s, {
        x: targetX,
        y: targetY,
        rotation: rotationSpeed,
        scale: 0.2,
        opacity: 0,
        duration: 0.5 + Math.random() * 0.25,
        ease: 'power3.out',
        delay: 0.18
      })
    })
  }

  return {
    initAnimations,
    cleanupAnimations,
    animateTokenPurchase,
    animateCardPurchase,
    animateContractFulfillment,
    animateManagerAllocation,
    animateManagerReturn,
    animateMoveToInPlay,
    animateCardDiscard
  }
}
