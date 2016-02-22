var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable('population', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        country_id: 'int',
        city_id: 'int',
        male: 'int',
        female: 'int'
    }, callback);
};

exports.down = function(db, callback) {
    db.dropTable('population', callback);
};
