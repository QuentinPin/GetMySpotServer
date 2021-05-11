// Import des module
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const BDDservice = require('./database/BDDservice')

//Variable d'environement
const IP_SERVER = process.env.IP_SERVER;
const PORT_SERVER = process.env.PORT_SERVER;

// Constante
const app = express();


function run() {
    app.use(bodyParser.json());

    /**
     * URL de création d'un compte utilisateur
     * @param pseudo pseudonyme de l'utilisateur à créer
     * @param password mot de passde de l'utilisateur à créer
     */
    app.post('/api/create_account', (req, res) => {
        var body = req.body;
        console.log("\n--> Création d'un utilisateur :\n\t- Json reçus : " + JSON.stringify(body));
        create_user(body, res);
    });

    /**
     * URL de connexion d'un utilisateur
     * @param pseudo pseudonyme de l'utilisateur à connecter
     * @param password mot de passde de l'utilisateur à connecter
     */
    app.post('/api/login', (req, res) => {
        var body = req.body;
        console.log("\n--> Connexion de l'utilisateur :\n\t- Json reçus : " + JSON.stringify(body));
        login(body, res);
    });

    app.listen(PORT_SERVER, IP_SERVER, () => {
        console.log(`Server is running at http://${IP_SERVER}:${PORT_SERVER}`);
    });
}

/**
 * Fonction gérant la création d'un compte utilisateur
 * @param body
 * @param res
 */
function create_user(body, res) {
    BDDservice.create_user_account(body.pseudo, body.password, function (err, results) {
        if (err) {
            console.log("\t- ERREUR LORS DE LA CREATION DE L'UTILISATEUR");
            res.writeHead(401,'Content-Type', 'application/json');
            res.end(JSON.stringify({ "error": 1, "user_pseudo": null, "message": "User cannot be created cause by : " + err.sqlMessage }));
        } else {
            console.log("\t- Pseudo de l'utilisateur ajouté : " + body.pseudo);
            res.writeHead(201,'Content-Type', 'application/json');
            res.end(JSON.stringify({ "error": 0, "user_pseudo": body.pseudo, "message": "User created" }));
        }
    });
}

/**
 * Fonction gérant la connexion d'un utilisateur
 * @param body
 * @param res
 */
function login(body, res) {
    BDDservice.login(body.pseudo, body.password, function (err, result) {
        if (err) {
            console.log("\t- ERREUR LORS DE LA CONNEXION D'UN UTILISATEUR");
            res.writeHead(401,'Content-Type', 'application/json');
            res.end(JSON.stringify({ "error": 1, "user_pseudo": null, "message": "User cannot be logged cause by : " + err }));
        } else if (result){
            console.log("\t- Utilisateur " + body.pseudo + " connecté");
            res.writeHead(201,'Content-Type', 'application/json');
            res.end(JSON.stringify({ "error": 0, "user_pseudo": body.pseudo, "message": "User successfully logged" }));
        }else {
            console.log("\t- Utilisateur " + body.pseudo + " PAS connecté : password error");
            res.writeHead(201,'Content-Type', 'application/json');
            res.end(JSON.stringify({ "error": 0, "user_pseudo": body.pseudo, "message": "User failed to login, password error" }));
        }
    })
}

// Export des fonction
exports.run = run;