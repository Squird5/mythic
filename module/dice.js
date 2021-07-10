const CHARACTERISTICS = {
  "str": "Strength",
  "tou": "Toughness",
  "agi": "Agility",
  "wfr": "Warfare Ranged",
  "wfm": "Warfare Melee",
  "int": "Intellect",
  "per": "Perception",
  "cr": "Courage",
  "ch": "Charisma",
  "ld": "Leadership"
};
const FORMULA = "D100";
const THRESHOLD = 98;

export async function rollTest(element, actor) {
  const type = element.classList[0];
  if (type === "attack") {
    // TODO
  } else if (type === "initiative") {
    return await rollInitiative(element, actor);
  } else {
    const test = element.name;
    const target = parseInt(element.value);
    return await rollBasicTest(target, test, type);
  }
}

async function rollBasicTest(target, test, type) {
  const roll = await new Roll(FORMULA).roll({ async: true });
  let result = {
    type: type,
    test: CHARACTERISTICS[test] != undefined ? CHARACTERISTICS[test] : test,
    roll: roll.total,
    target: target,
    critical: false,
    degrees: 0,
    outcome: ""
  };

  if (roll.total >= THRESHOLD) {
    result.critical = true;
    result.outcome = "failure";
  } else if (roll.total === 1) {
    result.critical = true;
    result.outcome = "success";
  } else {
    const d = (target - roll.total) / 10;
    result.outcome = d >= 0 ? "success" : "failure";
    result.degrees = Math.abs(d).toFixed(1);
  }
  return result;
}

async function rollInitiative(element, actor) {
  const dataset = element.dataset;
  if (dataset.roll) {
    const roll = await new Roll(dataset.roll, actor.data.data);
    const result = await roll.roll({  async: true });
    result.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: actor }),
      flavor: dataset.label ? dataset.label : ""
    });
  }
}