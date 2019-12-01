class Frog {
  constructor(name, gender, eyes, legs, scent, tongue, heart, weight, height) {
    if (!Array.isArray(legs)) {
      throw new Error('Parameter "legs" is not an array');
    }
    // Ensure that the first character is always capitalized
    this.name = name.charAt(0).toUpperCase() + name.slice(1);
    this.gender = gender;
    // We are allowing the caller to pass in an array where the first index is the left eye and the 2nd is the right
    //    This is for convenience to make it easier for them.
    //    Or they can just pass in the eyes using the correct format if they want to
    //    We must transform it into the object format if they chose the array approach
    //      because some internal API uses this format
    this.eyes = Array.isArray(eyes) ? { left: eye[0], right: eye[1] } : eyes;
    this.legs = legs;
    this.scent = scent;
    // Pretending some internal API changed the field name of the frog's tongue from "tongueWidth" to "width"
    //    Check for old implementation and migrate them to the new field name
    const isOld = "tongueWidth" in tongue;
    const newTongue = { ...tongue };
    if (isOld) {
      delete newTongue["tongueWidth"];
      newTongue.width = tongue.width;
      this.tongue = newTongue;
    } else {
      this.tongue = newTongue;
    }
    this.heart = heart;
    if (typeof weight !== "undefined") {
      this.weight = weight;
    }
    if (typeof height !== "undefined") {
      this.height = height;
    }
  }
}

class FrogBuilder {
  constructor(name, gender) {
    // Ensure that the first character is always capitalized
    this.name = name.charAt(0).toUpperCase() + name.slice(1);
    this.gender = gender;
  }
  formatEyesCorrectly(eyes) {
    return Array.isArray(eyes) ? { left: eyes[0], right: eyes[1] } : eyes;
  }
  setEyes(eyes) {
    this.eyes = this.formatEyesCorrectly(eyes);
    return this;
  }
  setLegs(legs) {
    if (!Array.isArray(legs)) {
      throw new Error('"legs" is not an array');
    }
    this.legs = legs;
    return this;
  }
  setScent(scent) {
    this.scent = scent;
    return this;
  }
  updateTongueWidthFieldName(tongue) {
    const newTongue = { ...tongue };
    delete newTongue["tongueWidth"];
    newTongue.width = tongue.width;
    return newTongue;
  }
  setTongue(tongue) {
    const isOld = "tongueWidth" in tongue;
    this.tongue = isOld
      ? this.updateTongueWidthFieldName(tongue, tongue.tongueWidth)
      : tongue;
    return this;
  }
  setHeart(heart) {
    this.heart = heart;
    return this;
  }
  setWeight(weight) {
    if (typeof weight !== "undefined") {
      this.weight = weight;
    }
    return this;
  }
  setHeight(height) {
    if (typeof height !== "undefined") {
      this.height = height;
    }
    return this;
  }
  setHeart(heart) {
    if (typeof heart !== "object") {
      throw new Error("heart is not an object");
    }
    if (!("rate" in heart)) {
      throw new Error("rate in heart is undefined");
    }
    // Assume the caller wants to pass in a callback to receive the current frog's weight and height that he or she has set
    //    previously so they can calculate the heart object on the fly. Useful for loops of collections
    if (typeof heart === "function") {
      this.heart = heart({
        weight: this.weight,
        height: this.height
      });
    } else {
      this.heart = heart;
    }
    return this;
  }
  validate() {
    const requiredFields = [
      "name",
      "gender",
      "eyes",
      "legs",
      "scent",
      "tongue",
      "heart"
    ];
    for (let index = 0; index < requiredFields.length; index++) {
      const field = requiredFields[index];
      // Immediately return false since we are missing a parameter
      if (!(field in this)) {
        return false;
      }
    }
    return true;
  }
  build() {
    const isValid = this.validate(this);
    if (isValid) {
      return new Frog(
        this.name,
        this.gender,
        this.eyes,
        this.legs,
        this.scent,
        this.tongue,
        this.heart,
        this.weight,
        this.height
      );
    } else {
      // just going to log to console
      console.error("Parameters are invalid");
    }
  }
}

const larry = new FrogBuilder("larry", "male")
  .setEyes([{ volume: 1.1 }, { volume: 1.12 }])
  .setScent("sweaty socks")
  .setHeart({ rate: 22 })
  .setWeight(6)
  .setHeight(3.5)
  .setLegs([
    { size: "small" },
    { size: "small" },
    { size: "small" },
    { size: "small" }
  ])
  .setTongue({ tongueWidth: 18, color: "dark red", type: "round" })
  .build();
