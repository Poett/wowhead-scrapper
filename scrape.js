const request = require('request');
const fs = require('fs');
const zoneWriteStream = fs.createWriteStream('zones.csv');
const questWriteStream = fs.createWriteStream('quests.csv');
const npcWriteStream = fs.createWriteStream('npcs.csv');
const quest_itemWriteStream = fs.createWriteStream('quest_items.csv');
// const itemWriteStream = fs.createWriteStream('items.csv');
// const objectWriteStream = fs.createWriteStream('objects.csv');



//Define the headers for each csv file
zoneWriteStream.write(`ZoneID,Name,Instance Type,Territory\n`);
questWriteStream.write(`QuestID,Name,Req.Level,Type,Gold,Silver,Copper,Exp\n`);
npcWriteStream.write(`NPCID,Name,Level,Faction,Type\n`);
quest_itemWriteStream.write(`QuestID,ItemID,Quantity\n`);

//Define identifier maps to translate script data into names
const instanceMap = {1: "Transit", 2: "Dungeon", 3: "Raid", 4: "Battleground", 5: "Dungeon", 6: "Arena", 7: "Raid", 8: "Raid", 9: "Scenario", 10: "Artifact Acquisition", 11: "Class Hall"};
const territoryMap = {0: "Alliance", 1: "Horde", 2: "Contested", 3: "Sanctuary", 4: "PvP", 5: "World PvP"};
const questTypeMap = {1: "Group", 21: "Class", 41: "PvP", 62: "Raid", 81: "Dungeon", 82: "World Event", 83: "Legendary", 84: "Escort", 85: "Heroic", 88: "Raid (10)", 89: "Raid (25)", 98: "Scenario", 102: "Account", 104: "Side Quest", 107: "Artifact", 109: "World Quest", 110: "Epic World Quest", 111: "Elite World Quest", 112: "Epic Elite World Quest", 113: "PvP World Quest", 114: "First Aid World Quest", 115: "Battle Pet World Quest", 116: "Blacksmithing World Quest", 117: "Leatherworking World Quest", 118: "Alchemy World Quest", 119: "Herbalism World Quest", 120: "Mining World Quest", 121: "Tailoring World Quest", 122: "Engineering World Quest", 123: "Enchanting World Quest", 124: "Skinning World Quest", 125: "Jewelcrafting World Quest", 126: "Inscription World Quest", 128: "Emissary Quest", 129: "Archaeology World Quest", 130: "Fishing World Quest", 131: "Cooking World Quest", 135: "Rare World Quest", 136: "Rare Elite World Quest", 137: "Dungeon World Quest", 139: "Legion Invasion World Quest", 140: "Rated Reward", 141: "Raid World Quest", 142: "Legion Invasion Elite World Quest", 143: "Legionfall Contribution", 144: "Legionfall World Quest", 145: "Legionfall Dungeon World Quest", 146: "Legion Invasion World Quest Wrapper", 147: "Warfront - Barrens", 148: "Pickpocketing", 151: "Magni World Quest - Azerite", 152: "Tortollan World Quest - 8.0", 153: "Warfront Contribution", 254: "Island Quest", 255: "War Mode PvP", 256: "PvP Conquest", 259: "Faction Assault World Quest", 260: "Faction Assault Elite World Quest", 261: "Island Weekly Quest"};
const npcTypeMap = {1: "Beast", 2: "Dragonkin", 3: "Demon", 4: "Elemental", 5: "Giant", 6: "Undead", 7: "Humanoid", 8: "Critter", 9: "Mechanical", 10: "Uncategorized", 12: "Battle Pet", 15: "Aberration"};
const npcFactionMap = {'1':{'1':"Friendly",'0':"Alliance",'-1':"Alliace","null":"Alliance"},'0':{'1':"Horde",'0':"Neutral",'-1':"Anti-Horde","null":"Neutral"},'-1':{'1':"Horde",'0':"Anti-Alliance",'-1':"Hostile","null":"Anti-Alliance"},"null":{'1':"Horde",'0':"Neutral",'-1':"Anti-Horde","null":"Unknown"}};




//------------------Main Section------------------//

initializeZones();
initializeQuests();
initializeNPCs();



//-----------------------------------------------//

function initializeZones()
{
    request('https://www.wowhead.com/zones', (err, rsp, html) => 
    {
        if(!err && rsp.statusCode == 200)
        {

            let str = html.match(/zonedata.zones = (\[.*?\];)/)[1];
            //Trim off last ;
            str = str.replace(';', '');
            //Create the object from script data
            var zones = JSON.parse(str);

            //Go through each zone and collect data
            zones.forEach(zone => {parseZone(zone);});

        }
    });
}


function initializeQuests()
{


    request(`https://www.wowhead.com/quests`, (err, rsp, html) => 
    {
        if(!err && rsp.statusCode == 200)
        {
            let str = html.match(/id: 'quests'.*data: *(\[\{.*?\}\])/)[1];
            //Create the object from script data
            let quests = JSON.parse(str);

            quests.forEach(quest => {parseQuest(quest);});

        }
    });
}

function initializeNPCs()
{
    request(`https://www.wowhead.com/npcs`, (err, rsp, html) => 
    {
        if(!err && rsp.statusCode == 200)
        {
            let str = html.match(/id: 'npcs'.*data: *(\[\{.*?\}\])/)[1];
            //Create the object from script data
            let npcs = JSON.parse(str);

            npcs.forEach(npc => {parseNPC(npc);});

        }
    });
}

function parseZone(zone)
{
    //Define the values to collect
    let zoneID = zone.id;
    let zoneName = zone.name.replace(/,/g, "");

    let zoneType = (zone.instance === undefined) ? "" : instanceMap[zone.instance];
    let territory = territoryMap[zone.territory];
    let continent = "";
    let zoneParent = "";

    zoneWriteStream.write(`${zoneID},${zoneName},${zoneType},${territory}\n`);
}

function parseQuest(quest)
{

    //Quest Object
    let questID = quest.id;
    let questName = quest.hasOwnProperty('name') ? quest.name.replace(/,/g, "") : "Unknown";
    let requiredLevel = quest.hasOwnProperty('reqlevel') ? quest.reqlevel : "";
    let questType = quest.hasOwnProperty('type') ? questTypeMap[quest.type] : "";
    let questDungeonID = "";
    let money = quest.hasOwnProperty('money') ? quest.money : 0;
    let gold = Math.floor(money / 10000);
    let silver = Math.floor((money - (gold * 10000))/100);
    let copper = money - (gold * 10000) - (silver * 100);
    let exp = quest.hasOwnProperty('xp') ? quest.xp : 0;

    //Item Rewards
    if(quest.hasOwnProperty('itemrewards'))
    {
        for(let i = 0; i < quest.itemrewards.length; i++)
        {
            quest_itemWriteStream.write(`${questID},${quest.itemrewards[i][0]},${quest.itemrewards[i][1]}\n`);
        }
    }


    questWriteStream.write(`${questID},${questName},${requiredLevel},${questType},${gold},${silver},${copper},${exp}\n`);
}

function parseNPC(npc)
{
    

    let npcID = npc.id;
    let npcName = npc.name.replace(/,/g, "");
    let npcLevel1 = npc.maxlevel;
    let npcLevel2 = npc.minlevel;
    let npcLevel = (npcLevel1 === npcLevel2) ? npcLevel1 : `${npcLevel2}-${npcLevel1}`;
    let npcFaction = npc.hasOwnProperty('react') ? npcFactionMap[npc.react[0]][npc.react[1]] : "Unknown";
    let npcType = npc.hasOwnProperty('type') ? npcTypeMap[npc.type] : "";


    npcWriteStream.write(`${npcID},${npcName},${npcLevel},${npcFaction},${npcType}\n`);
}