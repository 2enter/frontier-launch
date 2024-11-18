/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "81lsszgyb1zgaud",
    "created": "2024-11-18 08:35:52.595Z",
    "updated": "2024-11-18 08:35:52.595Z",
    "name": "news",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "wyq4ame9",
        "name": "title",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "p8anpfbg",
        "name": "hype",
        "type": "number",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": false
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("81lsszgyb1zgaud");

  return dao.deleteCollection(collection);
})
