const request = require('request');
const fs = require('fs');

//Get read files
const zoneFile = fs.readFileSync('zones.csv', 'utf8');
const npcFile = fs.readFileSync('npcs.csv', 'utf8');

//Get Write files
const object_zoneWriteStream = fs.createWriteStream('object_zone.csv');
const npc_zoneWriteStream = fs.createWriteStream('npc_zone.csv');
const quest_zoneWriteStream = fs.createWriteStream('quest_zone.csv');

const npc_dropWriteStream = fs.createWriteStream('npc_drop.csv');
const npc_sellWriteStream = fs.createWriteStream('npc_sell.csv');
const npc_startWriteStream = fs.createWriteStream('npc_start.csv');
const npc_endWriteStream = fs.createWriteStream('npc_end.csv');

process.env.UV_THREADPOOL_SIZE = 128;

//Define the headers for each csv file
object_zoneWriteStream.write(`ZoneID,ObjectID,Name,Type\n`);
npc_zoneWriteStream.write(`ZoneID,NPCID\n`);
quest_zoneWriteStream.write(`ZoneID,QuestID\n`);
npc_dropWriteStream.write(`NPCID,ItemID\n`);
npc_sellWriteStream.write(`NPCID,ItemID\n`);
npc_startWriteStream.write(`NPCID,QuestID\n`);
npc_endWriteStream.write(`NPCID,QuestID\n`);


//Define identifier maps to translate script data into names
const objectTypeMap = {3: "Container", 9: "Book", 19: "Mailbox", 25: "Fishing Pool", 45: "Garrison Shipment", 50: "Shared Container", "-2": "Quest", "-3": "Herb", "-4": "Mining Node", "-5": "Chest", "-6": "Tool", "-7": "Archaeology", "-8": "Treasure", "-9": "Interactive"};


//------------------Main Section------------------//

//Read Zone CSV
var zoneTuples = zoneFile.split('\n');
var npcTuples = npcFile.split('\n');

var i = 0;
var j = 0;

let zoneIntervalID = setInterval(() =>
{
    i++
    if(i >= zoneTuples.length){clearInterval(zoneIntervalID); return;}
    let zoneAttributes = zoneTuples[i].split(",");
    let zoneID = zoneAttributes[0];
    searchZone(zoneID);
}, 400);

let npcIntervalID = setInterval(() =>
{
    j++
    if(j >= npcTuples.length){clearInterval(npcIntervalID); return;}
    let npcAttributes = npcTuples[j].split(",");
    let npcID = npcAttributes[0];
    searchNPC(npcID);
}, 400);



//-----------------------------------------------//


function searchZone(zoneID)
{
    //Go to the zone page and collect data
    const options = {url: `https://www.wowhead.com/zone=${zoneID}`, timeout: 0};

    request(options, (err, rsp, html) => 
    {
        if(!err && rsp.statusCode == 200)
        {
            /* -----------Object Data----------- */
            let object_script = html.match(/id: 'objects'.*data: *(\[\{.*?\}\])/);
            let npc_script = html.match(/id: 'npcs'.*data: *(\[\{.*?\}\])/);
            let quest_script = html.match(/id: 'quests'.*data: *(\[\{.*?\}\])/);

            /* -----------Object Data----------- */

            parseZoneObjects(object_script, zoneID);

            /* -----------NPC Data----------- */

            parseZoneNPCs(npc_script, zoneID);

            /* -----------Quest Data----------- */
            parseZoneQuests(quest_script, zoneID);
        }
    });
}

function searchNPC(npcID)
{
    const options = {url: `https://www.wowhead.com/npc=${npcID}`, timeout: 0};

    request(options, (err, rsp, html) => 
    {
        if(!err && rsp.statusCode == 200)
        {
            console.log(`${npcID}...`)
            /* -----------Collect Script Data----------- */
            let drop_script = html.match(/id: 'drops'.*data: *(\[\{.*?\}\]\})/);
            let sell_script = html.match(/id: 'sells'.*data: *(\[\{.*?\}\]\})/);
            let start_script = html.match(/id: 'starts'.*data: *(\[\{.*?\}\])/);
            let end_script = html.match(/id: 'ends'.*data: *(\[\{.*?\}\])/);

            /* -----------Drop Data----------- */
            parseNPCDrops(drop_script, npcID);
            /* -----------Sell Data----------- */
            parseNPCSells(sell_script, npcID);
            /* -----------Start Data----------- */
            parseNPCStarts(start_script, npcID);
            /* -----------End Data----------- */
            parseNPCEnds(end_script, npcID);
        }
        else
        {
            console.log(err);
        }
    });
}


function parseNPCDrops(drop_script, npcID)
{
    if(drop_script !== null)
    {
        
        let data = drop_script[1];
        let itemIDs = data.match(/("id":\d+)/);

        for(let i = 1; i < itemIDs.length; i++)
        {
            let ids = itemIDs[i].split(":");
            
            let itemID = ids[1];
            npc_dropWriteStream.write(`${npcID},${itemID}\n`);
        }
        
        

    }
}
function parseNPCSells(sell_script, npcID)
{
    if(sell_script !== null)
    {
 
        let data = sell_script[1];
        let itemIDs = data.match(/("id":\d+)/);

        for(let i = 1; i < itemIDs.length; i++)
        {
            let ids = itemIDs[i].split(":");
            
            let itemID = ids[1];
            npc_sellWriteStream.write(`${npcID},${itemID}\n`);
        }
    }
}
function parseNPCStarts(start_script, npcID)
{
    if(start_script !== null)
    {
        
        let data = start_script[1];
        let starts = JSON.parse(data);

        starts.forEach(start => 
            {
                let itemID = start.id;
                npc_startWriteStream.write(`${npcID},${itemID}\n`);
            });

    }
}
function parseNPCEnds(end_script, npcID)
{
    if(end_script !== null)
    {
        
        let data = end_script[1];
        let ends = JSON.parse(data);

        ends.forEach(end => 
            {
                let itemID = end.id;
                npc_endWriteStream.write(`${npcID},${itemID}\n`);
            });

    }
}


function parseZoneObjects(object_script, zoneID)
{
    if(object_script !== null)
    {
        let data = object_script[1];
        let objects = JSON.parse(data);

        objects.forEach(object => 
            {
                let objectID = object.id;
                let objectName = object.name.replace(/,/g, "");
                let objectType = objectTypeMap[object.type];

                object_zoneWriteStream.write(`${zoneID},${objectID},${objectName},${objectType}\n`);

            });

    }
}

function parseZoneNPCs(npc_script, zoneID)
{
    if(npc_script !== null)
    {
        let data = npc_script[1];
        let npcs = JSON.parse(data);

        npcs.forEach(npc => 
            {
                let npcID = npc.id;

                npc_zoneWriteStream.write(`${zoneID},${npcID}\n`);

            });

    }
}

function parseZoneQuests(quest_script, zoneID)
{
    if(quest_script !== null)
    {
        let data = quest_script[1];
        let quests = JSON.parse(data);

        quests.forEach(quest => 
            {
                let questID = quest.id;

                quest_zoneWriteStream.write(`${zoneID},${questID}\n`);

            });

    }
}