/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("s4rv9pmgeg1obr7")

  // remove
  collection.schema.removeField("vxigmj8s")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "1tyenjoe",
    "name": "status",
    "type": "select",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "shipping",
        "shipped",
        "launched"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("s4rv9pmgeg1obr7")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "vxigmj8s",
    "name": "shipped",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // remove
  collection.schema.removeField("1tyenjoe")

  return dao.saveCollection(collection)
})
