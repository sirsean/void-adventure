class Scenario {
    constructor(index, data, roll) {
        this.index = index;
        this.data = data;
        this.roll = roll;
    }

    get name() {
        return this.data.name;
    }

    get type() {
        return this.data.buffType;
    }

    get narrative() {
        return this.data.narrative;
    }

    crewAppliedBuffs(crew) {
        if (this.type == "TOP_DRIFTER") {
            let best = null;
            crew.forEach(drifter => {
                const score = this.drifterTotalBuff(drifter);
                const buffs = this.drifterBuffs(drifter).map(b => b.name).sort();
                if (!best || score > best.score) {
                    best = {
                        drifter,
                        score,
                        buffs,
                    }
                }
            });
            return best.buffs;
        } else {
            return [...new Set(crew.map(d => this.drifterBuffs(d).map(b => b.name)).flat())].sort();
        }
    }

    drifterBuffs(drifter) {
        return [
            this.data.graphicBuffs[drifter.graphic],
            this.data.accessoryBuffs[drifter.accessory],
            this.data.headgearBuffs[drifter.headgear],
        ].filter(b => !!b);
    }

    drifterTotalBuff(drifter) {
        return this.drifterBuffs(drifter)
            .map(buff => buff.score)
            .reduce((acc, score) => (acc + score), 0);
    }

    crewScore(crew) {
        const buffs = crew.map(d => this.drifterTotalBuff(d));
        let score;
        if (this.type == "TOP_DRIFTER") {
            score = buffs.sort().reverse()[0];
        } else {
            score = buffs.reduce((a, s) => (a + s), 0);
        }
        return Math.max(score - this.roll, 0);
    }
}

class Buff {
    constructor(name, score) {
        this.name = name;
        this.score = score;
    }
}

const rivalry = new Buff("Rivalry", -3);
const evade1 = new Buff("Evade", 14);
const evade2 = new Buff("Evade", 12);
const evade3 = new Buff("Evade", 10);
const barter = new Buff("Barter", 8);
const diplomacy1 = new Buff("Diplomacy", 20);
const diplomacy2 = new Buff("Diplomacy", 17);
const diplomacy3 = new Buff("Diplomacy", 15);
const threaten = new Buff("Threaten", 20);
const ambush = new Buff("Ambush", 20);
const sabotage = new Buff("Sabotage", 20);
const mental = new Buff("Mental", 3);
const navigation = new Buff("Navigation", 4);
const maintenance = new Buff("Maintenance", 2);
const temperament = new Buff("Temperament", -1);
const speed = new Buff("Speed", 7);
const food = new Buff("Food", 4);
const luck = new Buff("luck", 4);
const eva = new Buff("EVA", 1);
const harvest1 = new Buff("Harvest", 4);
const harvest2 = new Buff("Harvest", 3);
const harvest3 = new Buff("Harvest", 2);
const harvest4 = new Buff("Harvest", 0);
const hyperspec = new Buff("Hyperspec", 2);
const intuition = new Buff("Intuition", 4);
const landing1 = new Buff("Landing", 5);
const landing2 = new Buff("Landing", 4);
const landing3 = new Buff("Landing", 3);
const comms = new Buff("Comms", 3);
const combat1 = new Buff("Combat", 3);
const combat2 = new Buff("Combat", 2);
const combat3 = new Buff("Combat", 1);
const escape = new Buff("Escape", 4);
const intelligence1 = new Buff("Intelligence", 4);
const intelligence2 = new Buff("Intelligence", 3);
const defense1 = new Buff("Defense", 4);
const defense2 = new Buff("Defense", 3);
const defense3 = new Buff("Defense", 2);

const SCENARIOS = [
  {
    name: "Cove Stalkers",
    buffType: "TOP_DRIFTER",
    narrative: "By the authority of Calson Wight, you are encroaching in private space. Quelch your burners, kips. We got you painted solid under company rails, so nothing greasy.",
    graphicBuffs: {
      "Roving Terror": rivalry,
      "Void Drifter": rivalry,
      "Topography Society": evade3,
      "The Man Earlie Expeditionary Society": evade3,
      "Longhaulers": evade3,
      "Slash Patcher": evade2,
      "Saddler Racing League": evade1,
      "Union of Merchants": barter,
      "Mercenary": diplomacy3,
      "Dugall Freight": diplomacy3,
      "Beshtala-Chanko": diplomacy3,
      "League of Channel": diplomacy2,
      "Cove Stalkers": diplomacy1,
    },
    accessoryBuffs: {
      "Kickback Bombshot": threaten,
      "Bottle Juice": barter,
      "Mystery Bottle": barter,
      "The Claimant": barter,
      "The Penetrator": barter,
      "Coil Gun": ambush,
      "Scout": sabotage,
      "Ultrarange Sniper": sabotage,
      "Tone Sceptre": diplomacy2,
    },
    headgearBuffs: {},
  },
  {
    name: "Journey",
    buffType: "WHOLE_TEAM",
    narrative: "Decacycles of empty space stand between you and your prize. You pray that your journey is mundane, but even mundanity has its own perils for a crew of five, pakt like sardines in a crushed tin box.",
    graphicBuffs: {
        "The Transcendentalists": mental,
        "Void Drifter": mental,
        "Survivalist Guild": mental,
        "Free Fringe": mental,
        "The Forsaken": mental,
        "The Bench": mental,
        "The Path": mental,
        "Topography Society": navigation,
        "The Man Earlie Expeditionary Society": navigation,
        "Longhaulers": navigation,
        "Cog Crew": maintenance,
        "Engineers Guild": maintenance,
        "Slash Patcher": temperament,
        "League of Channel": temperament,
        "Carver": temperament,
        "Ji": temperament,
        "Combustible": temperament,
        "Dark Ether House": temperament,
        "Union of Merchants": speed,
        "Saddler Racing League": speed,
        "The Borsh Conservatory of Gastrotechs": food,
    },
    accessoryBuffs: {
        "The Crab": maintenance,
        "Crystal Catcher": maintenance,
        "Freight Flinger": maintenance,
        "Gold-plated Grappler": maintenance,
        "Grand Entrance": maintenance,
        "Sash Strapper": maintenance,
        "Scout": maintenance,
        "Ultrarange Sniper": maintenance,
        "VICE GRIP": maintenance,
        "HAND CANNON": maintenance,
        "BORE MASTER": maintenance,
        "Bottle Juice": mental,
        "Mystery Bottle": mental,
        "The Penetrator": mental,
        "Tone Sceptre": mental,
        "Dead Beam": luck,
        "Rapture": luck,
        "Rigor Mortis": luck,
    },
    headgearBuffs: {
        "Clincher x Bincal": food,
        "The Beetle": food,
        "Sock x Charybdis": food,
        "Baghead x Bincal": food,
        "Muckface": food,
        "Bincal Mouth Machine": food,
        "The Sullken Smile": food,
        "The Saav": food,
        "The Bald Beetle": food,
        "Charybdis": food,
    },
  },
  {
    name: "Station Pillage",
    type: "WHOLE_TEAM",
    narrative: "Despite the terrifying beauty of this unadulterated frontier planet, fear and disappointment begins to set in. No one dares say anything, but there's nothing on the scopes save for the ragged buzz of electrical radiation emanating from the planet itself. Even in its state of disrepair, battered by centuries of celestial wear, the station might just be the most beautiful thing you've ever seen…and that's not only because of the payload it represents.",
    graphicBuffs: {
        "Roving Terror": eva,
        "Grid Gang": eva,
        "Slash Patcher": eva,
        "Cog Crew": harvest3,
        "Round Power": harvest3,
        "Deepsatch": harvest3,
        "Freebooters' Flag": harvest2,
        "Freebooters Flag": harvest2,
        "Engineers Guild": harvest2,
        "Orbital Miners Guild": harvest2,
        "Mesmegraph": harvest1,
        "Hyperspec": harvest1,
        "Chainrunners": harvest1,
        "Dugall Freight": harvest4,
        "Machinist Social Club": harvest4,
    },
    accessoryBuffs: {
        "Thruster": harvest2,
        "Chainflicker": harvest2,
        "Seam Ripper": harvest2,
        "Everdull Snippies": harvest2,
        "The Crab": harvest1,
        "Bottle Juice": harvest2,
        "Crystal Catcher": harvest1,
        "Dead Beam": luck,
        "Detector": harvest1,
        "Freight Flinger": harvest2,
        "Gold-plated Grappler": harvest1,
        "Grand Entrance": harvest1,
        "Hair Trigger": harvest2,
        "Rigor Mortis": luck,
        "Sash Strapper": harvest1,
        "Scout": harvest1,
        "The Claimant": harvest1,
        "The Expat": harvest1,
        "The Holemaker": harvest1,
        "Ultrarange Sniper": harvest2,
        "VICE GRIP": harvest1,
        "HAND CANNON": harvest2,
        "BORE MASTER": harvest1,
    },
    headgearBuffs: {
        "Korkhead": eva,
        "BC Shiner": eva,
        "Good King Maude": eva,
        "Hangtooth": eva,
        "The Scaper": eva,
        "The Stalker": eva,
        "Boxhead": hyperspec,
        "Backstab Squeezebox": eva,
        "Rustler's Braincage": eva,
        "Kipper": eva,
        "The Spyhopper": eva,
        "The Pillowcase": eva,
        "Headforge": eva,
        "Hardhat": eva,
        "Trailmaker": eva,
    },
  },
  {
    name: "Muck Harvest",
    type: "WHOLE_TEAM",
    narrative: "It appears the gas planet is not a gas planet at all, but hides a swampy surface beneath it's planet-wide storms. This is confirmed when the dead drifter's nav module is plugged into the ship's computer, indicating the precise coordinates of their landing site.",
    graphicBuffs: {
        "The Transcendentalists": intuition,
        "Wings": landing1,
        "Topography Society": landing2,
        "Subsurface Miners Guild": harvest3,
        "Engineers Guild": landing3,
        "The Borsch Conservatory of Gastrotechs": harvest1,
        "Survivalist Guild": navigation,
        "Venonauts": harvest2,
        "Round Power": harvest3,
        "High Tox": harvest2,
        "The Man Earlie Expeditionary Society": harvest3,
        "The Forsaken": harvest3,
        "Deepsatch": harvest2,
        "Hyperspec": harvest1,
        "Chainrunners": harvest1
    },
    accessoryBuffs: {
        "The Spunker": harvest1,
        "The Shriek": navigation,
        "Wedge": harvest1,
        "Ball Claw": harvest1,
        "Beastsbane": harvest1,
        "Bottle Juice": harvest2,
        "Crystal Catcher": harvest1,
        "Detector": harvest1,
        "Freight Flinger": harvest2,
        "Gilded Seam Ripper": luck,
        "Gold-plated Grappler": harvest1,
        "Hair Trigger": harvest1,
        "Mystery Bottle": harvest1,
        "Sash Strapper": harvest2,
        "The Amputator": harvest1,
        "The Claimant": harvest1,
        "The Expat": harvest2,
        "The Holemaker": harvest1,
        "The Purifier": harvest1,
        "The Surgeon": harvest2,
        "Tone Sceptre": harvest2,
        "VICE GRIP": harvest1,
        "HAND CANNON": harvest2,
        "BORE MASTER": harvest1,
    },
    headgearBuffs: {
        "Clincher x Bincal": harvest2,
        "The Beetle": harvest2,
        "Sock x Charybdis": harvest2,
        "Baghead x Bincal": harvest2,
        "Muckface": harvest1,
        "Bincal Mouth Machine": harvest2,
        "The Sullken Smile": harvest2,
        "The Saav": harvest2,
        "The Bald Beetle": harvest2,
        "Charybdis": harvest2,
        "Boxhead": hyperspec,
        "The Channelrat": comms,
    },
  },
  {
    name: "Ambush",
    type: "WHOLE_TEAM",
    narrative: "Mutineers aloft. Come to the mouth of Grol the shit-mucker and feed our forsaken fury…",
    graphicBuffs: {
        "The Transcendentalists": intuition,
        "Roving Terror": combat2,
        "Void Drifter": combat3,
        "Cross of the Round Power": combat2,
        "Slash Patcher": combat1,
        "Survivalist Guild": escape,
        "Venonauts": combat3,
        "Carver": combat3,
        "Ji": combat3,
        "Mercenary": combat3,
        "The Forsaken": escape,
        "Cove Stalkers": combat1,
        "Combustible": combat3,
        "Lethal": combat3,
        "Hyperspec": combat1,
        "Ana": combat1,
        "Chainrunners": combat1,
    },
    accessoryBuffs: {
        "Thruster": combat3,
        "Hull Breacher": combat3,
        "Death Beam": combat1,
        "Reef Sweeper": combat3,
        "The (Fat) Koltso": combat2,
        "The Slipper": combat3,
        "The Koltso": combat2,
        "Trunker": combat3,
        "Hole Puncher": combat3,
        "The Nozzle": combat3,
        "Steady Hammer": combat3,
        "Cream Steamer": combat2,
        "Candlestick": combat3,
        "Soaker": combat3,
        "Soapy": combat3,
        "Bolt Harp": combat2,
        "Cove Carver": combat2,
        "Faulk's Icepick": combat1,
        "Roulette": combat1,
        "Heavy Spigot": combat3,
        "The Straight Smile": combat3,
        "The Crab": combat1,
        "Beastsbane": combat1,
        "Coil Gun": combat1,
        "Gilded Seam Ripper": luck,
        "Grand Entrance": combat1,
        "Hair Trigger": combat1,
        "Rapture": luck,
        "Sash Strapper": combat1,
        "Scout": combat1,
        "Stampy": combat1,
        "The Amputator": combat1,
        "The Claimant": combat3,
        "The Expat": combat1,
        "The Holemaker": combat1,
        "The Purifier": combat1,
        "The Surgeon": combat1,
        "Ultrarange Sniper": combat1,
        "VICE GRIP": combat2,
        "HAND CANNON": combat1,
        "BORE MASTER": combat2,
    },
    headgearBuffs: {
        "Boxhead": hyperspec,
        "Darksight": combat3,
    },
  },
  {
    name: "Roving Terror",
    type: "WHOLE_TEAM",
    narrative: "The Roving Terror are perhaps the most fearsome and storied of the pirate groups that skulk The Fringe, known primarily for their uncanny ability to take down large freighters and tourist vessels with their large, organized fleets in the early days. Now, they're a more scattered, ramshackle operation. They've been pushed out of hot spots by corpo-mercs and have scattered across the less-traveled routes where they lie in wait for enterprising drifters like yourselves.",
    graphicBuffs: {
        "Roving Terror": intelligence1,
        "Void Drifter": defense3,
        "Cross of the Round Power": combat1,
        "Cog Crew": defense3,
        "Engineers Guild": defense3,
        "Slash Patcher": defense1,
        "Union of Merchants": intelligence2,
        "Venonauts": combat3,
        "Carver": combat3,
        "Ji": combat3,
        "Saddler Racing League": defense1,
        "Mercenary": combat2,
        "Cove Stalkers": combat1,
        "Combustible": combat3,
        "Lethal": combat3,
        "Longhaulers": defense2,
        "Ana": combat1,
        "Chainrunners": defense1,
    },
    accessoryBuffs: {
        "Hull Breacher": defense2,
        "Death Beam": defense1,
        "Reef Sweeper": combat1,
        "The Slipper": combat1,
        "Trunker": combat2,
        "The Nozzle": combat2,
        "Soaker": combat2,
        "Hull Hooker": defense1,
        "Prongseat": defense1,
        "Heavy Spigot": combat2,
        "The Straight Smile": combat1,
        "Kickback Bombshot": defense1,
        "The Crab": intelligence1,
        "Beastsbane": combat1,
        "Bottle Juice": barter,
        "Coil Gun": intelligence1,
        "Crystal Catcher": defense1,
        "Dead Beam": luck,
        "Freight Flipper": defense1,
        "Gold-plated Grappler": defense1,
        "Grand Entrance": intelligence1,
        "Sash Strapper": intelligence1,
        "Scout": intelligence1,
        "Stampy": combat1,
        "The Amputator": combat1,
        "The Claimant": combat2,
        "The Expat": combat1,
        "The Holemaker": defense1,
        "The Penetrator": barter,
        "The Surgeon": combat1,
        "Ultrarange Sniper": defense1,
        "VICE GRIP": combat2,
        "HAND CANNON": defense1,
        "BORE MASTER": combat2,
    },
    headgearBuffs: {
        "Darksight": combat2,
        "Trailmaker": defense2,
    },
  },
]

export const NUM_SCENARIOS = SCENARIOS.length;
export const MAX_SCENARIO = SCENARIOS.length - 1;

export function startScenario(index, roll) {
    if (index <= MAX_SCENARIO) {
        return new Scenario(index, SCENARIOS[index], roll);
    }
}