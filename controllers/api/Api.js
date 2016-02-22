var _ = require('underscore');
module.exports = {
    login(req, res, next) {
        if (req.body.hasOwnProperty('username') && req.body.hasOwnProperty('password')) {
            req.db("select * from `users` where `username` =  '" + req.body.username + "'  and `password` = '" + req.body.password + "'", (e, r, f) => {
                if (e) return res.json(req.error('error'));
                if (!r.length) return res.json(req.error('username and password didnt match'));
                return res.json(req.success("Welcome !"));
            });
        } else {
            return res.json(req.error("Incorrect data"));
        }
    },
    addCountry(req, res, next) {
        if (!req.body.hasOwnProperty('name')) return res.json(req.error('data not provided'));

        console.log(req.body)
        req.db("insert into `country` values(null,'" + req.body.name + "')", (e, r) => {
            if (e) return res.json(req.error('error'));

            return res.json(req.success('Data has been added'))
        });
    },
    getCountries(req, res, next) {
        req.db("select * from `country`", (e, r) => {
            if (e) return res.json(req.error('error'));
            res.json(req.success(r));
        });
    },
    getCities(req, res) {
        req.db("select * from `city`", (e, r) => {
            if (e) return res.json(req.error('error'));
            res.json(req.success(r));
        });
    },
    addCity(req, res) {
        if (!req.body.hasOwnProperty('name') || !req.body.hasOwnProperty('country')) return res.json(req.error('data not provided'));
        req.db("insert into `city` values(null," + req.body.country.id + ", '" + req.body.name + "')", (e, r) => {
            if (e) return res.json(req.error('error'));

            return res.json(req.success('Data has been added'))
        });
    },
    addPopulation(req, res) {
        if (!req.body.hasOwnProperty('country') || !req.body.hasOwnProperty('city')) return res.json(req.error('data not provided'));
        if (!req.body.hasOwnProperty('type') || !req.body.hasOwnProperty('male') || !req.body.hasOwnProperty('female')) return res.json(req.error('data not provided'));
        var countryID = req.body.country.id;
        var cityID = req.body.city.id;
        req.db("insert into `population` values(null,'" + countryID + "','" + cityID + "','" + req.body.male + "','" + req.body.female + "','" + req.body.type + "')", (e, r) => {
            if (e) return res.json(req.error('error'));
            return res.json(req.success('Data has been added'))
        });
    },
    dashboard(req, res) {
        var query = "select * from country";
        req.db(query, (e, r) => {
            if (e) return res.json(req.error('error'));
            if (!r.length) return res.json(req.error('no data found'));

            var countryIds = _.pick(r, 'id').toString();
            var query = "select * from city";
            req.db(query, (e, rCity) => {
                if (e) return res.json(req.error('error'));
                r = r.map((e) => {
                    return _.extendOwn(e, {
                        cities: _.where(rCity, { country_id: e.id })
                    })
                });

                var query = "select * from population";
                req.db(query, (e, rPopulation) => {
                    if (e) return res.json(req.error('error'));

                    r.forEach(function(e, i) {
                        e.cities.forEach(function(e1, i1) {
                            r[i].cities[i1].population = _.where(rPopulation, { country_id: e.id, city_id: e1.id });
                        });
                    });
                    res.json(req.success(r));
                });
            });
        });
    },
    sortPopulation(req, res, next) {
        req.db("SELECT country_id,sum(female + male) as sum FROM `population` group by country_id order by sum desc", (e, r) => {
            if (e) return res.json(req.error('error'));
            res.json(req.success(r));
        });
    }
}
