import { createSlice } from "@reduxjs/toolkit";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const clampPlayerAttributes = (attributes) => {
  attributes.hunger = clamp(attributes.hunger, 0, 100);
  attributes.thirst = clamp(attributes.thirst, 0, 100);
  attributes.energy = clamp(attributes.energy, 0, 100);
};

const updateSurvivalStatus = (state) => {
  const aliveOrDead =
    state.playerAttributes.energy <= 0 ||
    state.playerAttributes.hunger >= 100 ||
    state.playerAttributes.thirst >= 100
      ? "dead"
      : "alive";

  if (aliveOrDead === "dead") {
    const message =
      "You have died. Game over. Please reload the page to try again.You survived for " +
      state.survivedDays +
      " days and " +
      state.time +
      " hours.";
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
  }
  return aliveOrDead;
};

const updateForTimeOfDay = (state, dayTimeLogic, nightTimeLogic) => {
  const isDayTime = state.time >= 6 && state.time <= 17;
  if (isDayTime) {
    dayTimeLogic(state);
  } else {
    nightTimeLogic(state);
  }
};

const applyTravelCost = (state) => {
  // Example costs, adjust as needed
  state.playerAttributes.energy -= 5;
  state.playerAttributes.hunger += 5;
  state.playerAttributes.thirst += 5;

  //Text for system message
  const message = `Travelling costs: Energy -5, Hunger +5, Thirst +5. Current attributes: Energy ${state.playerAttributes.energy}, Hunger ${state.playerAttributes.hunger}, Thirst ${state.playerAttributes.thirst}.`;
  state.systemMessages.push({
    timestamp: new Date().toLocaleTimeString(),
    text: message,
  });
};

const statMessage = (state) => {
  const message = `Current attributes: Energy ${state.playerAttributes.energy}, Hunger ${state.playerAttributes.hunger}, Thirst ${state.playerAttributes.thirst}.`;
  state.systemMessages.push({
    timestamp: new Date().toLocaleTimeString(),
    text: message,
  });
};

const applyRandomEvent = (state, events) => {
  let random = Math.random();
  let eventTriggered = false;

  for (const event of events) {
    if (random <= event.probability) {
      event.effect(state);
      eventTriggered = true;
      break;
    }
  }

  // If no event was triggered, apply a default scenario
  if (!eventTriggered) {
    const defaultMessage = "The Hour passes uneventfully.";
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: defaultMessage,
    });
    statMessage(state);
  }
};

const forestEffects = {
  findBerries: (state) => {
    const message = `You found berries! Hunger -10.`;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });

    state.playerAttributes.hunger -= 10;

    statMessage(state);
  },
  encounterBees: (state) => {
    const message = `You encountered bees! Energy -5.`;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });

    state.playerAttributes.energy -= 5;

    statMessage(state);
  },
  discoverClearing: (state) => {
    const message = `You discovered a clearing! Energy +5.`;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });

    state.playerAttributes.energy += 5;

    statMessage(state);
  },
  forageMushrooms: (state) => {
    const random = Math.random();
    if (random < 0.5) {
      const message =
        "You foraged some mushrooms! But they were poisonous. Hunger -5, Energy -10.";
      state.playerAttributes.hunger -= 5;
      state.playerAttributes.energy -= 10;
      state.systemMessages.push({
        timestamp: new Date().toLocaleTimeString(),
        text: message,
      });
    } else {
      const message = "You foraged some delicious mushrooms! Hunger -10.";
      state.playerAttributes.hunger -= 10;
      state.systemMessages.push({
        timestamp: new Date().toLocaleTimeString(),
        text: message,
      });
    }
    statMessage(state);
  },

  findStream: (state) => {
    const message = "You found a stream! Thirst -5.";
    state.playerAttributes.thirst -= 5;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  spotEdiblePlants: (state) => {
    const message = "You spotted some edible plants! Hunger -15.";
    state.playerAttributes.hunger -= 15;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  encounterDeer: (state) => {
    const random = Math.random();
    if (random < 0.3) {
      const message =
        "You encountered a deer and managed to hunt it! Hunger -20.";
      state.playerAttributes.hunger -= 20;
      state.systemMessages.push({
        timestamp: new Date().toLocaleTimeString(),
        text: message,
      });
    } else {
      const message = "You encountered a deer, but it ran away.";
      state.systemMessages.push({
        timestamp: new Date().toLocaleTimeString(),
        text: message,
      });
    }
    statMessage(state);
  },

  stumbleUponAnts: (state) => {
    const message = "You stumbled upon ants! Energy -5.";
    state.playerAttributes.energy -= 5;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  findFruitTree: (state) => {
    const message = "You found a fruit tree! Hunger -20.";
    state.playerAttributes.hunger -= 20;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  getLost: (state) => {
    const message = "You got lost! Hunger +10, Thirst +10, Energy -10.";
    state.playerAttributes.hunger += 10;
    state.playerAttributes.thirst += 10;
    state.playerAttributes.energy -= 10;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },
  hearStrangeNoises: (state) => {
    const random = Math.random();
    if (random < 0.3) {
      const message = "You heard strange noises and got scared! Energy -5.";
      state.systemMessages.push({
        timestamp: new Date().toLocaleTimeString(),
        text: message,
      });
      state.playerAttributes.energy -= 5;
    } else {
      const message = "You heard strange noises but stayed calm.";
      // No effect on attributes
      state.systemMessages.push({
        timestamp: new Date().toLocaleTimeString(),
        text: message,
      });
    }

    statMessage(state);
  },

  findGlowMushrooms: (state) => {
    const message = "You found glow mushrooms! Hunger -5.";
    state.playerAttributes.hunger -= 5;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  encounterNightPredators: (state) => {
    const random = Math.random();
    if (random < 0.2) {
      const message =
        "You encountered night predators and had to flee! Energy -20.";
      state.systemMessages.push({
        timestamp: new Date().toLocaleTimeString(),
        text: message,
      });
      state.playerAttributes.energy -= 20;
    } else {
      const message = "You sensed night predators nearby but avoided them.";
      state.systemMessages.push({
        timestamp: new Date().toLocaleTimeString(),
        text: message,
      });
      // No effect on attributes
    }

    statMessage(state);
  },

  discoverSafeSpot: (state) => {
    const message = "You discovered a safe spot to rest! Energy +10.";
    state.playerAttributes.energy += 10;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  nightVisionImproves: (state) => {
    const message = "Your night vision improves, making it easier to navigate.";
    // No effect on attributes
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  findRareBerries: (state) => {
    const message = "You found rare berries! Hunger -15.";
    state.playerAttributes.hunger -= 15;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  fallIntoPit: (state) => {
    const message = "You accidentally fell into a pit! Energy -15.";
    state.playerAttributes.energy -= 15;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  stargazing: (state) => {
    const message = "You spent some time stargazing. It's peaceful.";
    // No effect on attributes
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  hearRiver: (state) => {
    const message = "You hear the sound of a river nearby. Thirst -5.";
    state.playerAttributes.thirst -= 5;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  coldNight: (state) => {
    const message = "It's a cold night. Hunger +5, Thirst +5.";
    state.playerAttributes.hunger += 5;
    state.playerAttributes.thirst += 5;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },
};

const riverEffects = {
  catchBigFish: (state) => {
    const message = "You caught a big fish! Hunger -20.";
    state.playerAttributes.hunger -= 20;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  slipOnRocks: (state) => {
    const message = "You slipped on rocks! Energy -5.";
    state.playerAttributes.energy -= 5;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  refreshingSwim: (state) => {
    const message = "You took a refreshing swim! Thirst -5, Energy +5.";
    state.playerAttributes.thirst -= 5;
    state.playerAttributes.energy += 5;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  sunburn: (state) => {
    const message = "You got a sunburn! Thirst +5, Energy -5.";
    state.playerAttributes.thirst += 5;
    state.playerAttributes.energy -= 5;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  findCleanWater: (state) => {
    const message = "You found clean water! Thirst -15.";
    state.playerAttributes.thirst -= 15;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  seeFishCantCatch: (state) => {
    const message = "You see fish but can't catch them. No effect.";
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  riverMeditation: (state) => {
    const message = "You meditate by the river. Energy +5.";
    state.playerAttributes.energy += 5;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  findBoat: (state) => {
    const message = "You found a boat. Could be useful later!";
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    // No immediate effect on attributes
    statMessage(state);
  },

  encounterFrogs: (state) => {
    const message = "You encounter frogs. Hunger -5.";
    state.playerAttributes.hunger -= 5;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  discoverWaterfall: (state) => {
    const message = "You discover a beautiful waterfall! Energy +10.";
    state.playerAttributes.energy += 10;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },
  moonlitFishing: (state) => {
    const message = "You enjoy some moonlit fishing. Hunger -15.";
    state.playerAttributes.hunger -= 15;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  slipIntoRiver: (state) => {
    const message = "You accidentally slip into the river! Energy -10.";
    state.playerAttributes.energy -= 10;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  hearMysteriousSounds: (state) => {
    const message =
      "You hear mysterious sounds near the river. No immediate effect.";
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    // No effect on attributes
    statMessage(state);
  },

  seeReflections: (state) => {
    const message = "You see intriguing reflections in the water. Energy +5.";
    state.playerAttributes.energy += 5;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  coldWater: (state) => {
    const message = "The water is unexpectedly cold. Hunger +5, Thirst +5.";
    state.playerAttributes.hunger += 5;
    state.playerAttributes.thirst += 5;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  catchNightFish: (state) => {
    const message = "You catch fish under the moonlight. Hunger -10.";
    state.playerAttributes.hunger -= 10;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  seeGlowingFish: (state) => {
    const message =
      "You spot some glowing fish in the river. A mesmerizing sight!";
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    // No effect on attributes
    statMessage(state);
  },

  hearPredator: (state) => {
    const message = "You hear a predator nearby and stay alert. Energy -5.";
    state.playerAttributes.energy -= 5;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  findRareWaterPlant: (state) => {
    const message = "You find a rare water plant! Thirst -10.";
    state.playerAttributes.thirst -= 10;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  nightSwim: (state) => {
    const message = "You take a risky night swim. Energy -5, Thirst -5.";
    state.playerAttributes.energy -= 5;
    state.playerAttributes.thirst -= 5;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },
};

const mountainEffects = {
  findCave: (state) => {
    const message = "You find a cave for shelter. Energy +10.";
    state.playerAttributes.energy += 10;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  encounterBear: (state) => {
    const message = "A bear encounter! You narrowly escape. Energy -20.";
    state.playerAttributes.energy -= 20;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  seeEagle: (state) => {
    const message =
      "You see an eagle soaring above. It's inspiring, but no effect.";
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  gatherHerbs: (state) => {
    const message = "You gather some beneficial herbs. Hunger -5, Energy +5.";
    state.playerAttributes.hunger -= 5;
    state.playerAttributes.energy += 5;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  slipOnTrail: (state) => {
    const message = "You slip on a mountain trail. Energy -5.";
    state.playerAttributes.energy -= 5;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  highPeak: (state) => {
    const message = "You reach a high peak, reenergizing you. Energy +15.";
    state.playerAttributes.energy += 15;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  findMountainSpring: (state) => {
    const message = "You find a mountain spring. Thirst -10.";
    state.playerAttributes.thirst -= 10;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  encounterGoats: (state) => {
    const message = "You encounter mountain goats. They ignore you.";
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  sunnySpotRest: (state) => {
    const message = "You rest in a sunny spot. Energy +5.";
    state.playerAttributes.energy += 5;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  rockslide: (state) => {
    const message = "A rockslide! You manage to avoid it. Energy -15.";
    state.playerAttributes.energy -= 15;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  coldWind: (state) => {
    const message =
      "A cold wind increases your hunger and thirst. Hunger +5, Thirst +5.";
    state.playerAttributes.hunger += 5;
    state.playerAttributes.thirst += 5;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  starNavigation: (state) => {
    const message = "You navigate by the stars, finding your way.";
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  shelteredSpot: (state) => {
    const message = "You find a sheltered spot for a brief rest. Energy +5.";
    state.playerAttributes.energy += 5;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  howlingWolves: (state) => {
    const message = "You hear howling wolves in the distance. Energy -5.";
    state.playerAttributes.energy -= 5;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  nightVision: (state) => {
    const message = "Your night vision improves in the moonlight. Energy +5.";
    state.playerAttributes.energy += 5;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  findNightBerries: (state) => {
    const message = "You find some berries in the moonlight. Hunger -5.";
    state.playerAttributes.hunger -= 5;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  stumbleRocks: (state) => {
    const message = "You stumble on some loose rocks. Energy -5.";
    state.playerAttributes.energy -= 5;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  moonlitPath: (state) => {
    const message = "A moonlit path helps you navigate. Energy +5.";
    state.playerAttributes.energy += 5;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  shootingStar: (state) => {
    const message =
      "A shooting star streaks across the sky. No immediate effect.";
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  unexpectedCliff: (state) => {
    const message = "You nearly walk off an unexpected cliff! Energy -10.";
    state.playerAttributes.energy -= 10;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },
};

const safeZoneEffects = {
  unexpectedVisitor: (state) => {
    const message = "An unexpected visitor shares some food. Energy +5.";
    state.playerAttributes.energy += 5;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  dreamsAndVisions: (state) => {
    const message =
      "You have insightful dreams, offering guidance for your journey.";
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  planNextMove: (state) => {
    const message =
      "You plan your next move, feeling more prepared. Energy +10.";
    state.playerAttributes.energy += 10;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  meditation: (state) => {
    const message = "A session of meditation revitalizes you. Energy +15.";
    state.playerAttributes.energy += 15;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  repairingGear: (state) => {
    const message =
      "You spend time repairing your gear. It's now more efficient.";
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  scoutingAhead: (state) => {
    const message =
      "You scout ahead and gain valuable information about the surrounding area.";
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  trainingExercise: (state) => {
    const message = "You engage in a training exercise. Energy -5, Hunger -5.";
    state.playerAttributes.energy -= 5;
    state.playerAttributes.hunger -= 5;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  foragingNearSafeZone: (state) => {
    const message = "You forage near the safe zone and find food. Hunger -10.";
    state.playerAttributes.hunger -= 10;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  rainwaterCollection: (state) => {
    const message = "You collect rainwater, quenching your thirst. Thirst -15.";
    state.playerAttributes.thirst -= 15;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },

  reflectionAndRest: (state) => {
    const message =
      "A period of reflection and rest recharges you. Energy +20.";
    state.playerAttributes.energy += 20;
    state.systemMessages.push({
      timestamp: new Date().toLocaleTimeString(),
      text: message,
    });
    statMessage(state);
  },
};

// Define logic for different zones and times of day
const forestDayTimeLogic = (state) => {
  applyRandomEvent(state, [
    { probability: 0.1, effect: forestEffects.findBerries },
    { probability: 0.09, effect: forestEffects.encounterBees },
    { probability: 0.08, effect: forestEffects.discoverClearing },
    { probability: 0.07, effect: forestEffects.forageMushrooms },
    { probability: 0.06, effect: forestEffects.findStream },
    { probability: 0.05, effect: forestEffects.spotEdiblePlants },
    { probability: 0.05, effect: forestEffects.encounterDeer },
    { probability: 0.05, effect: forestEffects.stumbleUponAnts },
    { probability: 0.05, effect: forestEffects.findFruitTree },
    { probability: 0.4, effect: forestEffects.getLost },
  ]);
  clampPlayerAttributes(state.playerAttributes);
};

const forestNightTimeLogic = (state) => {
  applyRandomEvent(state, [
    { probability: 0.1, effect: forestEffects.hearStrangeNoises },
    { probability: 0.09, effect: forestEffects.findGlowMushrooms },
    { probability: 0.08, effect: forestEffects.encounterNightPredators },
    { probability: 0.07, effect: forestEffects.discoverSafeSpot },
    { probability: 0.06, effect: forestEffects.nightVisionImproves },
    { probability: 0.05, effect: forestEffects.findRareBerries },
    { probability: 0.05, effect: forestEffects.fallIntoPit },
    { probability: 0.05, effect: forestEffects.stargazing },
    { probability: 0.05, effect: forestEffects.hearRiver },
    { probability: 0.4, effect: forestEffects.coldNight },
  ]);
  clampPlayerAttributes(state.playerAttributes);
};

const riverDayTimeLogic = (state) => {
  applyRandomEvent(state, [
    { probability: 0.1, effect: riverEffects.catchBigFish },
    { probability: 0.09, effect: riverEffects.slipOnRocks },
    { probability: 0.08, effect: riverEffects.refreshingSwim },
    { probability: 0.07, effect: riverEffects.sunburn },
    { probability: 0.06, effect: riverEffects.findCleanWater },
    { probability: 0.05, effect: riverEffects.seeFishCantCatch },
    { probability: 0.05, effect: riverEffects.riverMeditation },
    { probability: 0.05, effect: riverEffects.findBoat },
    { probability: 0.05, effect: riverEffects.encounterFrogs },
    { probability: 0.4, effect: riverEffects.discoverWaterfall },
  ]);
  clampPlayerAttributes(state.playerAttributes);
};

const riverNightTimeLogic = (state) => {
  applyRandomEvent(state, [
    { probability: 0.1, effect: riverEffects.moonlitFishing },
    { probability: 0.09, effect: riverEffects.slipIntoRiver },
    { probability: 0.08, effect: riverEffects.hearMysteriousSounds },
    { probability: 0.07, effect: riverEffects.seeReflections },
    { probability: 0.06, effect: riverEffects.coldWater },
    { probability: 0.05, effect: riverEffects.catchNightFish },
    { probability: 0.05, effect: riverEffects.seeGlowingFish },
    { probability: 0.05, effect: riverEffects.hearPredator },
    { probability: 0.05, effect: riverEffects.findRareWaterPlant },
    { probability: 0.4, effect: riverEffects.nightSwim },
  ]);
  clampPlayerAttributes(state.playerAttributes);
};

const mountainDayTimeLogic = (state) => {
  applyRandomEvent(state, [
    { probability: 0.1, effect: mountainEffects.findCave },
    { probability: 0.09, effect: mountainEffects.encounterBear },
    { probability: 0.08, effect: mountainEffects.seeEagle },
    { probability: 0.07, effect: mountainEffects.gatherHerbs },
    { probability: 0.06, effect: mountainEffects.slipOnTrail },
    { probability: 0.05, effect: mountainEffects.highPeak },
    { probability: 0.05, effect: mountainEffects.findMountainSpring },
    { probability: 0.05, effect: mountainEffects.encounterGoats },
    { probability: 0.05, effect: mountainEffects.sunnySpotRest },
    { probability: 0.4, effect: mountainEffects.rockslide },
  ]);
  clampPlayerAttributes(state.playerAttributes);
};

const mountainNightTimeLogic = (state) => {
  applyRandomEvent(state, [
    { probability: 0.1, effect: mountainEffects.coldWind },
    { probability: 0.09, effect: mountainEffects.starNavigation },
    { probability: 0.08, effect: mountainEffects.shelteredSpot },
    { probability: 0.07, effect: mountainEffects.howlingWolves },
    { probability: 0.06, effect: mountainEffects.nightVision },
    { probability: 0.05, effect: mountainEffects.findNightBerries },
    { probability: 0.05, effect: mountainEffects.stumbleRocks },
    { probability: 0.05, effect: mountainEffects.moonlitPath },
    { probability: 0.05, effect: mountainEffects.shootingStar },
    { probability: 0.4, effect: mountainEffects.unexpectedCliff },
  ]);
  clampPlayerAttributes(state.playerAttributes);
};

const safeZoneLogic = (state) => {
  // Basic recovery
  state.playerAttributes.energy += 5; // Slight energy recovery due to rest
  state.playerAttributes.hunger += 10; // Increase hunger due to inactivity
  state.playerAttributes.thirst += 10; // Increase thirst

  applyRandomEvent(state, [
    { probability: 0.1, effect: safeZoneEffects.unexpectedVisitor },
    { probability: 0.05, effect: safeZoneEffects.dreamsAndVisions },
    { probability: 0.05, effect: safeZoneEffects.planNextMove },
    { probability: 0.05, effect: safeZoneEffects.meditation },
    { probability: 0.05, effect: safeZoneEffects.repairingGear },
    { probability: 0.05, effect: safeZoneEffects.scoutingAhead },
    { probability: 0.05, effect: safeZoneEffects.trainingExercise },
    { probability: 0.05, effect: safeZoneEffects.foragingNearSafeZone },
    { probability: 0.05, effect: safeZoneEffects.rainwaterCollection },
    { probability: 0.05, effect: safeZoneEffects.reflectionAndRest },
    // Additional probabilities can be adjusted to ensure the total is <= 1
  ]);
  clampPlayerAttributes(state.playerAttributes);
};

export const gameSlice = createSlice({
  name: "game",
  initialState: {
    time: 0,
    survivedDays: 0, // State for tracking survived days
    currentZone: "safe-zone",
    playerAttributes: {
      energy: 100,
      hunger: 0,
      thirst: 0,
    },
    survivalStatus: "alive",
    systemMessages: [],
  },
  reducers: {
    changeZone: (state, action) => {
      if (state.survivalStatus === "dead") return;

      // Check if the new zone is different from the current zone
      const newZone = action.payload.zone;
      if (newZone === state.currentZone) {
        // If the zone is the same, do nothing
        return;
      }

      // Example: Add a system message when the zone changes
      const message = `Moved to ${newZone} at time ${state.time}. Current attributes: Energy ${state.playerAttributes.energy}, Hunger ${state.playerAttributes.hunger}, Thirst ${state.playerAttributes.thirst}.`;
      state.systemMessages.push({
        timestamp: new Date().toLocaleTimeString(),
        text: message,
      });

      // Apply travel cost for changing zones
      applyTravelCost(state);

      const newTime = (state.time + 1) % 24;
      if (state.time === 23 && newTime === 0) {
        state.survivedDays += 1; // Increment survived days
      }
      state.time = newTime;
      state.currentZone = newZone; // Update the current zone

      switch (newZone) {
        case "forest":
          updateForTimeOfDay(state, forestDayTimeLogic, forestNightTimeLogic);
          break;
        case "river":
          updateForTimeOfDay(state, riverDayTimeLogic, riverNightTimeLogic);
          break;
        case "mountain":
          updateForTimeOfDay(
            state,
            mountainDayTimeLogic,
            mountainNightTimeLogic
          );
          break;
        case "safe-zone":
          safeZoneLogic(state);
          break;
        // Add other zones if necessary
      }

      state.survivalStatus = updateSurvivalStatus(state);
    },
    // Other reducers can be added here as needed
  },
});

export const { changeZone } = gameSlice.actions;
export default gameSlice.reducer;
