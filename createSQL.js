
const fs = require('fs');
const insertWriteStream = fs.createWriteStream('inserts.sql')


var file;
var tuples;



//Load Zone
file = fs.readFileSync('zones.csv','utf8')
tuples = file.split("\n");
for(let j = 1; j < tuples.length - 1; j++)
{
    let tuple = tuples[j];
    tokens = tuple.split(',');

    for(let i = 0; i < tokens.length; i++)
    {
        tokens[i] = tokens[i] === '' ? `NULL` : tokens[i];
        tokens[i] = tokens[i].replace(/'|&/g, "");
    }

    writeZoneInsert(tokens[0], `'${tokens[1]}'`,`'${tokens[2]}'`,`'${tokens[3]}'`);
};

//Load Objects
file = fs.readFileSync('objects.csv','utf8')
tuples = file.split("\n");
for(let j = 1; j < tuples.length - 1; j++)
{
    let tuple = tuples[j];
    tokens = tuple.split(',');

    for(let i = 0; i < tokens.length; i++)
    {
        tokens[i] = tokens[i] === '' ? `NULL` : tokens[i];
        tokens[i] = tokens[i].replace(/'|&/g, "");
    }

    
    writeObjectInsert(tokens[0], `'${tokens[1]}'`,`'${tokens[2]}'`);
};



//Load Items
file = fs.readFileSync('items.csv','utf8')
tuples = file.split("\n");
for(let j = 1; j < tuples.length - 1; j++)
{
    let tuple = tuples[j];
    tokens = tuple.split(',');

    for(let i = 0; i < tokens.length; i++)
    {
        tokens[i] = tokens[i] === '' ? `NULL` : tokens[i];
        tokens[i] = tokens[i].replace(/'|&/g, "");
    }

    
    writeItemInsert(tokens[0], `'${tokens[1]}'`,`'${tokens[2]}'`,`'${tokens[3]}'`, `'${tokens[4]}'`);
};



//Load NPCs
file = fs.readFileSync('npcs.csv','utf8')
tuples = file.split("\n");
for(let j = 1; j < tuples.length - 1; j++)
{
    let tuple = tuples[j];
    tokens = tuple.split(',');

    for(let i = 0; i < tokens.length; i++)
    {
        tokens[i] = tokens[i] === '' ? `NULL` : tokens[i];
        tokens[i] = tokens[i].replace(/'|&/g, "");
    }
    
    writeNPCInsert(tokens[0], `'${tokens[1]}'`,`'${tokens[2]}'`,`'${tokens[3]}'`, `'${tokens[4]}'`);

};



//Load Quests
file = fs.readFileSync('quests.csv','utf8')
tuples = file.split("\n");
for(let j = 1; j < tuples.length - 1; j++)
{
    let tuple = tuples[j];
    tokens = tuple.split(',');

    for(let i = 0; i < tokens.length; i++)
    {
        tokens[i] = tokens[i] === '' ? `NULL` : tokens[i];
        tokens[i] = tokens[i].replace(/'|&/g, "");
    }
    
    writeQuestInsert(tokens[0], `'${tokens[1]}'`,`'${tokens[2]}'`,`'${tokens[3]}'`, tokens[4], tokens[5], tokens[6], tokens[7]);

};



//Load NPC-Drop
file = fs.readFileSync('npc_drop.csv','utf8')
tuples = file.split("\n");
for(let j = 1; j < tuples.length - 1; j++)
{
    let tuple = tuples[j];
    tokens = tuple.split(',');

    for(let i = 0; i < tokens.length; i++)
    {
        tokens[i] = tokens[i] === '' ? `NULL` : tokens[i];
        tokens[i] = tokens[i].replace(/'|&/g, "");
    }

    writeNPCDropsInsert(tokens[0], tokens[1]);

};



//Load NPC-Sells
file = fs.readFileSync('npc_sell.csv','utf8')
tuples = file.split("\n");
for(let j = 1; j < tuples.length - 1; j++)
{
    let tuple = tuples[j];
    tokens = tuple.split(',');

    for(let i = 0; i < tokens.length; i++)
    {
        tokens[i] = tokens[i] === '' ? `NULL` : tokens[i];
        tokens[i] = tokens[i].replace(/'|&/g, "");
    }

    writeNPCSellsInsert(tokens[0], tokens[1]);
};



//Load NPC-Starts
file = fs.readFileSync('npc_start.csv','utf8')
tuples = file.split("\n");
for(let j = 1; j < tuples.length - 1; j++)
{
    let tuple = tuples[j];
    tokens = tuple.split(',');

    for(let i = 0; i < tokens.length; i++)
    {
        tokens[i] = tokens[i] === '' ? `NULL` : tokens[i];
        tokens[i] = tokens[i].replace(/'|&/g, "");
    }

    writeNPCStartsInsert(tokens[0], tokens[1]);
};



//Load NPC-Ends
file = fs.readFileSync('npc_end.csv','utf8')
tuples = file.split("\n");
for(let j = 1; j < tuples.length - 1; j++)
{
    let tuple = tuples[j];
    tokens = tuple.split(',');

    for(let i = 0; i < tokens.length; i++)
    {
        tokens[i] = tokens[i] === '' ? `NULL` : tokens[i];
        tokens[i] = tokens[i].replace(/'|&/g, "");
    }

    writeNPCEndsInsert(tokens[0], tokens[1]);
};



//Load NPC-Zones
file = fs.readFileSync('npc_zone.csv','utf8')
tuples = file.split("\n");
for(let j = 1; j < tuples.length - 1; j++)
{
    let tuple = tuples[j];
    tokens = tuple.split(',');

    for(let i = 0; i < tokens.length; i++)
    {
        tokens[i] = tokens[i] === '' ? `NULL` : tokens[i];
        tokens[i] = tokens[i].replace(/'|&/g, "");
    }

    writeZoneNPCsInsert(tokens[0], tokens[1]);
};



//Load Object-Zones
file = fs.readFileSync('object_zone.csv','utf8')
tuples = file.split("\n");
for(let j = 1; j < tuples.length - 1; j++)
{
    let tuple = tuples[j];
    tokens = tuple.split(',');

    for(let i = 0; i < tokens.length; i++)
    {
        tokens[i] = tokens[i] === '' ? `NULL` : tokens[i];
        tokens[i] = tokens[i].replace(/'|&/g, "");
    }

    writeZoneObjectsInsert(tokens[0], tokens[1]);
};



//Load Quest-Zones
file = fs.readFileSync('quest_zone.csv','utf8')
tuples = file.split("\n");
for(let j = 1; j < tuples.length - 1; j++)
{
    let tuple = tuples[j];
    tokens = tuple.split(',');

    for(let i = 0; i < tokens.length; i++)
    {
        tokens[i] = tokens[i] === '' ? `NULL` : tokens[i];
        tokens[i] = tokens[i].replace(/'|&/g, "");
    }

    writeZoneQuestInsert(tokens[0], tokens[1]);
};



//Load Quest-Items
file = fs.readFileSync('quest_items.csv','utf8')
tuples = file.split("\n");
for(let j = 1; j < tuples.length - 1; j++)
{
    let tuple = tuples[j];
    tokens = tuple.split(',');

    for(let i = 0; i < tokens.length; i++)
    {
        tokens[i] = tokens[i] === '' ? `NULL` : tokens[i];
        tokens[i] = tokens[i].replace(/'|&/g, "");
    }

    writeRewardsItemInsert(tokens[0], tokens[1], tokens[2]);
};





function writeZoneInsert(zoneID, name, type, territory)
{
    insertWriteStream.write(`insert into Zones values (${zoneID}, ${name}, ${type}, ${territory});\n`)
}

function writeNPCInsert(npcID, name, npcLevel, faction, npcType)
{
    insertWriteStream.write(`insert into NPCs values (${npcID}, ${name}, ${npcLevel}, ${faction}, ${npcType});\n`)
}

function writeItemInsert(itemID, name, itemClass, itemSubclass, itemSlot)
{
    insertWriteStream.write(`insert into Items values (${itemID}, ${name}, ${itemClass}, ${itemSubclass}, ${itemSlot});\n`)
}

function writeObjectInsert(objectID, name, objectType)
{
    insertWriteStream.write(`insert into Objects values (${objectID}, ${name}, ${objectType});\n`)
}

function writeQuestInsert(questID, name, req, questType, gold, silver, copper, exp)
{
    insertWriteStream.write(`insert into Quests values (${questID}, ${name}, ${req}, ${questType}, ${gold}, ${silver}, ${copper}, ${exp});\n`)
}

function writeZoneObjectsInsert(zoneID, objectID)
{
    insertWriteStream.write(`insert into ZoneObjects values (${zoneID}, ${objectID});\n`)
}

function writeZoneQuestInsert(zoneID, questID)
{
    insertWriteStream.write(`insert into ZonesQuests values (${zoneID}, ${questID});\n`)
}

function writeZoneNPCsInsert(zoneID, npcID)
{
    insertWriteStream.write(`insert into ZoneNPCs values (${zoneID}, ${npcID});\n`)
}

function writeObjectProvidesInsert(objectID, itemID)
{
    insertWriteStream.write(`insert into ObjectProvides values (${objectID}, ${itemID});\n`)
}

function writeNPCSellsInsert(npcID, itemID)
{
    insertWriteStream.write(`insert into NPCSells values (${npcID}, ${itemID});\n`)
}

function writeNPCDropsInsert(npcID, itemID)
{
    insertWriteStream.write(`insert into NPCDrops values (${npcID}, ${itemID});\n`)
}

function writeNPCStartsInsert(npcID, questID)
{
    insertWriteStream.write(`insert into NPCStarts values (${npcID}, ${questID});\n`)
}

function writeNPCEndsInsert(npcID, questID)
{
    insertWriteStream.write(`insert into NPCEnds values (${npcID}, ${questID});\n`)
}

function writeRewardsItemInsert(questID, itemID, quantity)
{
    insertWriteStream.write(`insert into RewardsItem values (${questID}, ${itemID}, ${quantity});\n`)
}



