var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable("country", {
        id: { type: "int", primaryKey: true, autoIncrement: true },
        country: "string"
    }, callback)
};

exports.down = function(db, callback) {
    db.dropTable('country', callback);
};
