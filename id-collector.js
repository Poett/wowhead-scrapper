const request = require('request');
const fs = require('fs');

//Get read files
const zoneFile = fs.readFileSync('object_zone.csv', 'utf8');
const npcFile = fs.readFileSync('npc_drop.csv', 'utf8');
const npc2File = fs.readFileSync('npc_sell.csv', 'utf8');
const questFile = fs.readFileSync('quest_items.csv', 'utf8');

const itemWriteStream = fs.createWriteStream('items.csv');
const objectsmWriteStream = fs.createWriteStream('objects.csv');

itemWriteStream.write(`ItemID,Name,Class,Subclass,Slot\n`);
objectsmWriteStream.write(`ObjectID,Name,Type\n`);

//slotbak
const itemSlotMap = {1: "Head", 2: "Neck", 3: "Shoulder", 4: "Shirt", 5: "Chest", 6: "Waist", 7: "Legs", 8: "Feet", 9: "Wrist", 10: "Hands", 11: "Finger", 12: "Trinket", 13: "One-Hand", 14: "Shield", 15: "Ranged", 16: "Back", 17: "Two-Hand", 18: "Bag", 19: "Tabard", 21: "Main Hand", 22: "Off Hand", 23: "Held In Off-hand", 24: "Projectile", 25: "Thrown", 28: "Relic"};
const itemClassesMap = {0: "Consumable", 1: "Container", 2: "Weapon", 3: "Gem", 4: "Armor", 5: "Reagent", 6: "Projectile", 7: "Trade Good", 9: "Recipe", 10: "Currency", 12: "Quest", 13: "Key", 15: "Miscellaneous", 16: "Glyph"};
const itemSubClassesMap = {"0":{"0":"Consumable","1":"Potion","2":"Elixir","3":"Flask","4":"Scroll","5":"Food&Drink","6":"Perm.Enhancement","7":"Bandage","8":"OtherConsumables","-3":"Temp.Enhancement"},"1":{"0":"Bag","1":"SoulBag","2":"HerbBag","3":"EnchantingBag","4":"EngineeringBag","5":"GemBag","6":"MiningBag","7":"LeatherworkingBag","8":"InscriptionBag","9":"TackleBox","10":"CookingBag"},"2":{"0":"One-HandedAxe","1":"Two-HandedAxe","2":"Bow","3":"Gun","4":"One-HandedMace","5":"Two-HandedMace","6":"Polearm","7":"One-HandedSword","8":"Two-HandedSword","9":"Warglaives","10":"Staff","13":"FistWeapon","14":"Misc.(Weapons)","15":"Dagger","16":"Thrown","18":"Crossbow","19":"Wand","20":"FishingPole"},"3":{"0":"RedGem","1":"BlueGem","2":"YellowGem","3":"PurpleGem","4":"GreenGem","5":"OrangeGem","6":"MetaGem","7":"SimpleGem","8":"PrismaticGem","9":"Sha-TouchedGem","10":"CogwheelGem","-18":"HolyRelic","-17":"StormRelic","-16":"LifeRelic","-15":"WaterRelic","-14":"FireRelic","-13":"FrostRelic","-12":"ArcaneRelic","-11":"FelRelic","-10":"ShadowRelic","-9":"BloodRelic","-8":"IronRelic"},"4":{"0":"Misc.(Armor)","1":"ClothArmor","2":"LeatherArmor","3":"MailArmor","4":"PlateArmor","5":"Cosmetic","6":"Shield","7":"Libram","8":"Idol","9":"Totem","10":"Sigil","11":"Relic","-8":"Shirt","-7":"Tabard","-6":"Cloak","-5":"Off-handFrill","-4":"Trinket","-3":"Amulet","-2":"Ring"},"6":{"2":"Arrow","3":"Bullet"},"7":{"1":"Part","2":"Explosive","3":"Device","4":"Jewelcrafting","5":"Cloth","6":"Leather","7":"Metal&Stone","8":"Meat","9":"Herb","10":"Elemental","11":"Other(TradeGoods)","12":"Enchanting","13":"Material","14":"ArmorEnchantment","15":"WeaponEnchantment"},"9":{"0":"Book","1":"LeatherworkingPattern","2":"TailoringPattern","3":"EngineeringSchematic","4":"BlacksmithingPlans","5":"CookingRecipe","6":"AlchemyRecipe","7":"FirstAidBook","8":"EnchantingFormula","9":"FishingBook","10":"JewelcraftingDesign","11":"InscriptionTechnique","12":"MiningGuide"},"15":{"0":"Junk","1":"Reagent","2":"Companion","3":"Holiday","4":"Other(Miscellaneous)","5":"Mount","-7":"FlyingMount","-2":"ArmorToken"},"16":{"1":"WarriorGlyph","2":"PaladinGlyph","3":"HunterGlyph","4":"RogueGlyph","5":"PriestGlyph","6":"DeathKnightGlyph","7":"ShamanGlyph","8":"MageGlyph","9":"WarlockGlyph","10":"MonkGlyph","11":"DruidGlyph","12":"DemonHunter"}};
const objectTypeMap = {  "3": "Container",  "9": "Book",  "19": "Mailbox",  "25": "Fishing Pool",  "45": "Garrison Shipment",  "50": "Shared Container",  "-5": "Chest",  "-3": "Herb",  "-9": "Interactive",  "-4": "Mining Node",  "-2": "Quest",  "-6": "Tool",  "-7": "Archaeology",  "-8": "Treasure"};


var zoneTuples = zoneFile.split('\n');
var npcTuples = npcFile.split('\n');
var npc2Tuples = npc2File.split('\n');
var questTuples = questFile.split('\n');

var objectIDSet = new Set();
var itemIDSet = new Set();

//Collect Object IDs
for(let i = 1; i < zoneTuples.length; i++)
{
    let objectID = zoneTuples[i].split(",")[1];
    objectIDSet.add(objectID);
}

//Collect Item IDs
for(let i = 1; i < npcTuples.length; i++)
{
    let itemID = npcTuples[i].split(",")[1];
    itemIDSet.add(itemID);
}
for(let i = 1; i < npc2Tuples.length; i++)
{
    let itemID = npc2Tuples[i].split(",")[1];
    itemIDSet.add(itemID);
}
for(let i = 1; i < questTuples.length; i++)
{
    let itemID = questTuples[i].split(",")[1];
    itemIDSet.add(itemID);
}



//Parse identified objects and items from WOWHead

objectIDSet.forEach(objectID => 
    {
        parseObject(objectID);
    });


itemIDSet.forEach(itemID => 
    {
        parseItem(itemID);
    })


function parseObject(objectID)
{
    //var listviewitems = (\[.*\]);

    //Go to the zone page and collect data
    const options = {url: `https://www.wowhead.com/objects?filter=15;3;${objectID}`, timeout: 0};

    request(options, (err, rsp, html) => 
    {
        if(!err && rsp.statusCode == 200)
        {
            /* -----------Object Data----------- */
            let object_script = html.match(/"id":"objects".*"data":(\[.*\])\}\);/);
            if(object_script !== null)
            {
                let data = object_script[1];
                let object = JSON.parse(data)[0];


                let objectName = object.hasOwnProperty('name') ? object.name : "";
                let objectType = object.hasOwnProperty('type') ? objectTypeMap[object.type] : "";

                objectsmWriteStream.write(`${objectID},${objectName},${objectType}\n`);
            }


        }
    });
}


function parseItem(itemID)
{
    //var listviewitems = (\[.*\]);

    //Go to the zone page and collect data
    const options = {url: `https://www.wowhead.com/items?filter=151;3;${itemID}`, timeout: 0};

    request(options, (err, rsp, html) => 
    {
        if(!err && rsp.statusCode == 200)
        {
            /* -----------Object Data----------- */
            let item_script = html.match(/var listviewitems = (\[.*\]);/);
            if(item_script !== null)
            {
                try {
                    let data = item_script[1];
                    data = data.replace(/,firstseenpatch: \d+/g, "");
                    let item = JSON.parse(data)[0];
    
    
    
                    let itemName = item.name;
                    let itemClass = "";
                    let itemSubClass = "";
                    try {
                        itemClass = item.hasOwnProperty('classs') ? itemClassesMap[item.classs] : "";
                        itemSubClass = item.hasOwnProperty('classs') ? (item.hasOwnProperty('subclass') ? itemSubClassesMap[item.classs][item.subclass]: "") : "";
                    } catch (error) {
                        itemClass = "";
                        itemSubClass = "";   
                    }
                    let itemSlot = item.hasOwnProperty('slot') ? (item.slot !== 0 ? itemSlotMap[item.slot] : "" ): "";
                    
                    itemWriteStream.write(`${itemID},${itemName},${itemClass},${itemSubClass},${itemSlot}\n`);
    
                } catch (error) {
                    
                }
            }


        }
    });
}