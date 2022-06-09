/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class KonosubaActor extends Actor {

  /** @override */
  prepareData() {
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
  }

  /** @override */
  prepareBaseData() {
    // Data modifications in this step occur before processing embedded
    // documents or derived data.
  }

  /**
   * @override
   * Augment the basic actor data with additional dynamic data. Typically,
   * you'll want to handle most of your calculated/derived data in this step.
   * Data calculated in this step should generally not exist in template.json
   * (such as ability modifiers rather than ability scores) and should be
   * available both inside and outside of character sheets (such as if an actor
   * is queried and has a roll executed directly from it).
   */
  prepareDerivedData() {
    const actorData = this.data;
    const data = actorData.data;
    const flags = actorData.flags.konosuba || {};

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    this._prepareCharacterData(actorData);
    this._prepareNpcData(actorData);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    if (actorData.type !== 'character') return;

    // Make modifications to data here. For example:
    const data = actorData.data;

    // Loop through ability scores, and add their modifiers to our sheet output.
    for (let [key, ability] of Object.entries(data.abilities)) {
      // Calculate the modifier.
      ability.abilityScore = Math.floor((ability.base + ability.abilityBonus + ability.otherBonus) / 3) + ability.classBonus + ability.abilityScoreBonus;
      ability.checkBonus = ability.abilityScore;
    }

    // Calculate combat stats
    data.stats.combat.hitCheck.base = data.abilities.dexterity.checkBonus
    data.stats.combat.hitCheck.total = data.stats.combat.hitCheck.base + data.stats.combat.hitCheck.hitModifier + data.stats.combat.hitCheck.skillModifier + data.stats.combat.hitCheck.otherModifier;

    data.stats.combat.attackPower.total = data.stats.combat.attackPower.attackPower + data.stats.combat.attackPower.skillModifier + data.stats.combat.attackPower.otherModifier;

    data.stats.combat.dodgeCheck.base = data.abilities.agility.checkBonus
    data.stats.combat.dodgeCheck.total = data.stats.combat.dodgeCheck.base + data.stats.combat.dodgeCheck.dodgeModifier + data.stats.combat.dodgeCheck.skillModifier + data.stats.combat.dodgeCheck.otherModifier;

    data.stats.combat.physicalDefense.total = data.stats.combat.physicalDefense.armorModifier + data.stats.combat.physicalDefense.skillModifier + data.stats.combat.physicalDefense.otherModifier;

    data.stats.combat.magicalDefense.base = data.abilities.mind.checkBonus
    data.stats.combat.magicalDefense.total = data.stats.combat.magicalDefense.base + data.stats.combat.magicalDefense.armorModifier + data.stats.combat.magicalDefense.skillModifier + data.stats.combat.magicalDefense.otherModifier;

    data.stats.combat.actionPoints.base = data.abilities.agility.checkBonus + data.abilities.perception.checkBonus;
    data.stats.combat.actionPoints.total = data.stats.combat.actionPoints.base + data.stats.combat.actionPoints.actionModifier + data.stats.combat.actionPoints.skillModifier + data.stats.combat.actionPoints.otherModifier;

    data.stats.combat.movement.base = data.abilities.strength.checkBonus + 5;
    data.stats.combat.movement.total = data.stats.combat.movement.base + data.stats.combat.movement.movementModifier + data.stats.combat.movement.skillModifier + data.stats.combat.movement.otherModifier;

    // Calculate special checks
    data.stats.special.magicCheck.base = data.abilities.intelligence.checkBonus
    data.stats.special.magicCheck.total = data.stats.special.magicCheck.base + data.stats.special.magicCheck.skillModifier + data.stats.special.magicCheck.otherModifier;

    data.stats.special.detectTraps.base = data.abilities.perception.checkBonus
    data.stats.special.detectTraps.total = data.stats.special.detectTraps.base + data.stats.special.detectTraps.skillModifier + data.stats.special.detectTraps.otherModifier;

    data.stats.special.disarmTraps.base = data.abilities.dexterity.checkBonus
    data.stats.special.disarmTraps.total = data.stats.special.disarmTraps.base + data.stats.special.disarmTraps.skillModifier + data.stats.special.disarmTraps.otherModifier;

    data.stats.special.senseThreats.base = data.abilities.perception.checkBonus
    data.stats.special.senseThreats.total = data.stats.special.senseThreats.base + data.stats.special.senseThreats.skillModifier + data.stats.special.senseThreats.otherModifier;

    data.stats.special.identifyEnemy.base = data.abilities.intelligence.checkBonus
    data.stats.special.identifyEnemy.total = data.stats.special.identifyEnemy.base + data.stats.special.identifyEnemy.skillModifier + data.stats.special.identifyEnemy.otherModifier;
  }

  /**
   * Prepare NPC type specific data.
   */
  _prepareNpcData(actorData) {
    if (actorData.type !== 'npc') return;

    // Make modifications to data here. For example:
    const data = actorData.data;

    // Loop through ability scores, and add their modifiers to our sheet output.
    for (let [key, ability] of Object.entries(data.abilities)) {
      // Calculate the modifier.
      ability.abilityScore = Math.floor((ability.base + ability.abilityBonus + ability.otherBonus) / 3) + ability.classBonus + ability.abilityScoreBonus;
      ability.checkBonus = ability.abilityScore;
    }
  }

  /**
   * Override getRollData() that's supplied to rolls.
   */
  getRollData() {
    const data = super.getRollData();

    // Prepare character roll data.
    this._getCharacterRollData(data);
    this._getNpcRollData(data);

    return data;
  }

  /**
   * Prepare character roll data.
   */
  _getCharacterRollData(data) {
    if (this.data.type !== 'character') return;

    // Process additional PC data here.
  }

  /**
   * Prepare NPC roll data.
   */
  _getNpcRollData(data) {
    if (this.data.type !== 'npc') return;

    // Process additional NPC data here.
  }

}