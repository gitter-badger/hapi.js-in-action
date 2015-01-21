module.exports = function (connection) {

    return [{
        method: 'GET',
        path: '/recipes',
        handler: function (request, reply) {

            var sql = 'SELECT * FROM recipes';
            var params = [];

            if (request.query.cuisine) {
                sql += ' WHERE cuisine = ?';
                params.push(request.query.cuisine);
            }

            connection.query(sql, params, function (err, results) {

                if (err) {
                    throw err;
                }

                reply(results);
            });
        }
    }, {
        method: 'GET',
        path: '/recipes/{id}',
        handler: function (request, reply) {
            
            connection.query('SELECT * FROM recipes WHERE id = ?', [request.params.id], function (err, results) {

                if (err) {
                    throw err;
                }

                if (results[0]) {
                    reply(results[0]);
                } else {
                    reply('Not found').code(404);
                }
            });
        }
    }, {
        method: 'POST',
        path: '/recipes',
        config: {
            auth: 'api',
            payload: {                  
                output: 'data',
                parse: true
            }
        },
        handler: function (request, reply) {

            var sql = 'INSERT INTO recipes (name, cooking_time, prep_time, serves, cuisine, ingredients, directions, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

            connection.query(sql, 
            [
                request.payload.name,
                request.payload.cooking_time,
                request.payload.prep_time,
                request.payload.serves,
                request.payload.cuisine,
                request.payload.ingredients,
                request.payload.directions,
                request.auth.credentials.id,
            ], 
            function (err, results) {

                if(err) {
                    throw err;
                }

                reply({status: 'ok'});
            });
        }
    }];

};