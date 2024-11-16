/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("s4rv9pmgeg1obr7")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "hqgmqpfe",
    "name": "type",
    "type": "select",
    "required": true,
    "presentable": true,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "water",
        "spring",
        "stair",
        "star",
        "cake",
        "diamond"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("s4rv9pmgeg1obr7")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "hqgmqpfe",
    "name": "type",
    "type": "select",
    "required": true,
    "presentable": true,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
