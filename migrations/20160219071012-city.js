var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable('city', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        country_id: 'int',
        name: 'string'
    }, callback);
};

exports.down = function(db, callback) {
    db.dropTable('city', callback);
};
