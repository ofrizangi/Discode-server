
// import the content of the env file
require('dotenv').config();
require("./config/database").connect();
// express - for creating endpoints
const express = require('express');
// for managing data in mongodb

const app = express();

const port = process.env.PORT

// for CORS error in the client - CORS should come before running the server
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(express.json());
// running the server on port 3001
app.listen(port, () => {
    console.log(`Server Started at ${port}`)
})


const user_routes = require('./routes/user_routes');
app.use('/api/users', user_routes)


const level_routes = require('./routes/level_routes');
app.use('/api', level_routes)

const game_routes = require('./routes/game_routes');
app.use('/api/games', game_routes)

const forum_routes = require('./routes/forum_routes');
app.use('/api', forum_routes)

/*
Just for testing - earase me later
*/
const routes = require('./routes/routes_for_testing');
// all endpoints will start with api
app.use('/api', routes)


