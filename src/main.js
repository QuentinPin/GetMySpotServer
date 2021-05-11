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
    app.use(bodyParser.json({
        limit: '500mb',
        parameterLimit: 100000,
        extended: true
    }));

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

    /**
     * URL permetant de push la photo de profile d'un utilisateur
     * @param pseudo pseudonyme du propriétaire de la photo
     * @param image photo de profile en base64 de l'utilisateurt
     */
    app.post('/api/profile_picture', (req, res) => {
        var body = req.body;
        console.log("\n--> Réception d'une photo de profile :\n\t- Json reçus : " + JSON.stringify(body).substring(0, 150) + "...");
        profile_picture(body, res);
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
            res.writeHead(401, 'Content-Type', 'application/json');
            res.end(JSON.stringify({
                "error": 1,
                "user_pseudo": null,
                "message": "User cannot be created cause by : " + err.sqlMessage
            }));
        } else {
            console.log("\t- Pseudo de l'utilisateur ajouté : " + body.pseudo);
            res.writeHead(201, 'Content-Type', 'application/json');
            res.end(JSON.stringify({"error": 0, "user_pseudo": body.pseudo, "message": "User created"}));
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
            res.writeHead(401, 'Content-Type', 'application/json');
            res.end(JSON.stringify({
                "error": 1,
                "user_pseudo": null,
                "message": "User cannot be logged cause by : " + err
            }));
        } else if (result) {
            console.log("\t- Utilisateur " + body.pseudo + " connecté");
            res.writeHead(201, 'Content-Type', 'application/json');
            res.end(JSON.stringify({"error": 0, "user_pseudo": body.pseudo, "message": "User successfully logged"}));
        } else {
            console.log("\t- Utilisateur " + body.pseudo + " PAS connecté : password error");
            res.writeHead(201, 'Content-Type', 'application/json');
            res.end(JSON.stringify({
                "error": 1,
                "user_pseudo": body.pseudo,
                "message": "User failed to login, password error"
            }));
        }
    })
}

/**
 * Fonction gérant l'enregistrement de la photo de profile d'un utilisateur
 * @param body
 * @param res
 */
function profile_picture(body, res) {
    BDDservice.profile_picture(body.pseudo, body.image, function (err, result) {
        if (result) {
            console.log("\t- Update de l'image de l'utilisateur " + body.pseudo + " OK");
            res.writeHead(201, 'Content-Type', 'application/json');
            res.end(JSON.stringify({"error": 0, "user_pseudo": body.pseudo, "message": "Profile picture changed"}));
        } else {
            console.log("\t- Update de l'image de l'utilisateur " + body.pseudo + " NOK");
            res.writeHead(201, 'Content-Type', 'application/json');
            res.end(JSON.stringify({
                "error": 1,
                "user_pseudo": body.pseudo,
                "message": "Failed to change profile picture cause by : " + err
            }));
        }
    })
}

// Export des fonction
exports.run = run;