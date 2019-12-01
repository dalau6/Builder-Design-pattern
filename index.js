class FrogBuilder {
    constructor(name, gender) {
      this.name = name
      this.gender = gender
    }
    setEyes(eyes) {
      this.eyes = eyes
      return this
    }
    setLegs(legs) {
      this.legs = legs
      return this
    }
    setScent(scent) {
      this.scent = scent
      return this
    }
    setTongue(tongue) {
      this.tongue = tongue
      return this
    }
    setHeart(heart) {
      this.heart = heart
      return this
    }
    setWeight(weight) {
      this.weight = weight
      return this
    }
    setHeight(height) {
      this.height = height
      return this
    }
  }
  
  const larry = new FrogBuilder('larry', 'male')
    .setEyes([{ volume: 1.1 }, { volume: 1.12 }])
    .setScent('sweaty socks')
    .setHeart({ rate: 22 })
    .setWeight(6)
    .setHeight(3.5)
    .setLegs([
      { size: 'small' },
      { size: 'small' },
      { size: 'small' },
      { size: 'small' },
    ])
    .setTongue({ tongueWidth: 18, color: 'dark red', type: 'round' })
  