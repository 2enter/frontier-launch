/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("s4rv9pmgeg1obr7")

  collection.name = "supplies"

  // remove
  collection.schema.removeField("0mxf8tsa")

  // add
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lq3j1uhl",
    "name": "paint",
    "type": "file",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "mimeTypes": [
        "image/jpeg",
        "image/webp"
      ],
      "thumbs": [],
      "maxSelect": 1,
      "maxSize": 5242880,
      "protected": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "niqbvavn",
    "name": "supply",
    "type": "file",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "mimeTypes": [
        "image/jpeg",
        "image/webp"
      ],
      "thumbs": [],
      "maxSelect": 1,
      "maxSize": 5242880,
      "protected": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "2drtgng3",
    "name": "draw_duration",
    "type": "number",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("s4rv9pmgeg1obr7")

  collection.name = "data"

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "0mxf8tsa",
    "name": "text",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // remove
  collection.schema.removeField("hqgmqpfe")

  // remove
  collection.schema.removeField("vxigmj8s")

  // remove
  collection.schema.removeField("lq3j1uhl")

  // remove
  collection.schema.removeField("niqbvavn")

  // remove
  collection.schema.removeField("2drtgng3")

  return dao.saveCollection(collection)
})
