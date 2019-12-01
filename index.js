class Frog {
  constructor(name, gender, eyes, legs, scent, tongue, heart, habitat, skin, weight, height) {
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
    this.habitat = habitat;
    this.skin = skin;
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
    // Assume the caller wants to pass in an array where the first index is the left
    //    eye, and the 2nd is the right
    if (Array.isArray(eyes)) {
      return {
        left: eyes[0],
        right: eyes[1]
      };
    }
    // Assume that the caller wants to use a number to indicate that both eyes have the exact same volume
    if (typeof eyes === "number") {
      return {
        left: { volume: eyes },
        right: { volume: eyes }
      };
    }
    // Assume that the caller might be unsure of what to set the eyes at this current moment, so he expects
    //    the current instance as arguments to their callback handler so they can calculate the eyes by themselves
    if (typeof eyes === "function") {
      return eyes(this);
    }
    // Assume the caller is passing in the directly formatted object if the code gets here
    return eyes;
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
  setHabitat(habitat) {
    this.habitat = habitat;
    return this;
  }
  setSkin(skin) {
    this.skin = skin;
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
        this.habitat,
        this.skin,
        this.weight,
        this.height
      );
    } else {
      // just going to log to console
      console.error("Parameters are invalid");
    }
  }
}

class ToadBuilder {
  constructor(frogBuilder) {
    this.builder = frogBuilder
    this.createToad()
  }
  
  createToad() {
    return this.builder.setHabitat('land').setSkin('dry')
  }
}
  
// frog
const sally = new FrogBuilder("sally", "female")
  .setEyes([{ volume: 1.1 }, { volume: 1.12 }])
  .setScent("blueberry")
  .setHeart({ rate: 12 })
  .setWeight(5)
  .setHeight(3.1)
  .setLegs([
    { size: "small" },
    { size: "small" },
    { size: "small" },
    { size: "small" }
  ])
  .setTongue({ width: 12, color: "navy blue", type: "round" })
  .setHabitat("water")
  .setSkin("oily")
  .build();

// toad
let kelly = new FrogBuilder("kelly", "female")

kelly = new ToadBuilder(kelly).builder
  .setEyes([{ volume: 1.1 }, { volume: 1.12 }])
  .setScent("black ice")
  .setHeart({ rate: 11 })
  .setWeight(5)
  .setHeight(3.1)
  .setLegs([
    { size: "small" },
    { size: "small" },
    { size: "small" },
    { size: "small" }
  ])
  .setTongue({ width: 12.5, color: "olive", type: "round" })
  .build();

// toad
let mike = new FrogBuilder("mike", "male")

mike = new ToadBuilder(mike).builder
  .setEyes([{ volume: 1.1 }, { volume: 1.12 }])
  .setScent('smelly socks')
  .setHeart({ rate: 15 })
  .setWeight(12)
  .setHeight(5.2)
  .setLegs([
    { size: 'medium' },
    { size: 'medium' },
    { size: 'medium' },
    { size: 'medium' },
  ])
  .setTongue({ width: 12.5, color: 'olive', type: 'round' })
  .build()

// const larry = new FrogBuilder("larry", "male")
//   .setEyes([{ volume: 1.1 }, { volume: 1.12 }])
//   .setScent("sweaty socks")
//   .setHeart({ rate: 22 })
//   .setWeight(6)
//   .setHeight(3.5)
//   .setLegs([
//     { size: "small" },
//     { size: "small" },
//     { size: "small" },
//     { size: "small" }
//   ])
//   .setTongue({ tongueWidth: 18, color: "dark red", type: "round" })
//   .build();

// // variation 1 (left eye = index 1, right eye = index 2)
// larry.setEyes([{ volume: 1 }, { volume: 1.2 }]);

// // variation 2 (left eye + right eye = same values)
// larry.setEyes(1.1);

// // variation 3 (the caller calls the shots on calculating the left and right eyes)
// larry.setEyes(function(instance) {
//   let leftEye, rightEye;
//   let weight, height;
//   if ("weight" in instance) {
//     weight = instance.weight;
//   }
//   if ("height" in instance) {
//     height = instance.height;
//   }
//   if (weight > 10) {
//     // It's a fat frog. Their eyes are probably humongous!
//     leftEye = { volume: 5 };
//     rightEye = { volume: 5 };
//   } else {
//     const volume = someApi.getVolume(weight, height);
//     leftEye = { volume };
//     // Assuming that female frogs have shorter right eyes for some odd reason
//     rightEye = { volume: instance.gender === "female" ? 0.8 : 1 };
//   }
//   return {
//     left: leftEye,
//     right: rightEye
//   };
// });

// // variation 4 (caller decides to use the formatted object directly)
// larry.setEyes({
//   left: { volume: 1.5 },
//   right: { volume: 1.51 }
// });
