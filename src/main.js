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
        push_profile_picture(body, res);
    });

    /**
     * URL permetant de push un nouveau spot*
     * @param body il doit contenir toutes les infos relatif à un spot
     */
    app.post('/api/push_spot', (req, res) => {
        var body = req.body;
        console.log("\n--> PUSH d'un spot :\n\t- Json reçus : " + JSON.stringify(body));
        push_spot(body, res);
    });

    /**
     * URL permetant de get la photo de profile d'un utilisateur
     * @param pseudo pseudonyme de l'utilisateur propriétaire de la photo de profile
     */
    app.get('/api/profile_picture', (req, res) => {
        console.log("\n--> Demande d'une photo de profile :\n\t- params reçus : " + JSON.stringify(req.query));
        get_profile_picture(req.query.pseudo, res);
    });

    app.get('/api/get_spots', (req, res) => {
        console.log("\n--> Demande des spots :\n\t- params reçus : " + JSON.stringify(req.query));
        get_spots(req.query, res);
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
            res.writeHead(401, 'Content-Type', 'application/json');
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
function push_profile_picture(body, res) {
    BDDservice.push_profile_picture(body.pseudo, body.image, function (err, result) {
        if (result) {
            console.log("\t- Update de l'image de l'utilisateur " + body.pseudo + " OK");
            res.writeHead(201, 'Content-Type', 'application/json');
            res.end(JSON.stringify({"error": 0, "user_pseudo": body.pseudo, "message": "Profile picture changed"}));
        } else {
            console.log("\t- Update de l'image de l'utilisateur " + body.pseudo + " NOK");
            res.writeHead(401, 'Content-Type', 'application/json');
            res.end(JSON.stringify({
                "error": 1,
                "user_pseudo": body.pseudo,
                "message": "Failed to change profile picture cause by : " + err
            }));
        }
    })
}

/**
 * Fonction gérant l'ajout d'un nouveau spot dans la base de donnée
 * @param body contient toutes les informations d'un spot
 * @param res
 */
function push_spot(body, res) {
    BDDservice.push_spot(body, function (err, result) {
        if (err) {
            console.log("\t- push du spot FAILED");
            res.writeHead(401, 'Content-Type', 'application/json');
            res.end(JSON.stringify({
                "error": 1,
                "message": "Spot cannot be added cause by : " + err
            }));
        } else {
            console.log("\t- push du spot SUCCESS");
            res.writeHead(201, 'Content-Type', 'application/json');
            res.end(JSON.stringify({
                "error": 0,
                "message": "Spot successfully added"
            }));
        }
    })
}

/**
 * Fonction gérant la requette de demande d'une photo de profile d'un utilisateur
 * @param pseudo pseudonyme de l'utilisateur propriétaire de la photo de profile
 * @param res
 */
function get_profile_picture(pseudo, res) {
    BDDservice.get_profile_picture(pseudo, function (err, result) {
        if (err != null) {
            console.log("\t- ERREUR LORS DE LA RÉCUPÉRATION DE LA PHOTO DE PROFILE");
            res.writeHead(401, 'Content-Type', 'application/json');
            res.end(JSON.stringify({
                "error": 1,
                "message": "Cannot get profile picture cause by : " + err,
                "image": null
            }));
        } else {
            console.log("\t- Photo de profile de l'utilisateur " + pseudo + " retournée");
            res.writeHead(201, 'Content-Type', 'application/json');
            res.end(JSON.stringify({
                "error": 0,
                "message": "Profile picture get successfully",
                "image": result
            }));
        }
    });
}

/**
 * Fonction gérant les demandes de spots
 * @param params
 * @param res
 */
function get_spots(params, res) {
    BDDservice.get_spots(params, function (err, result) {
        if (err) {
            console.log("\t- ERREUR lors de la récupération des spots");
            res.writeHead(401, 'Content-Type', 'application/json');
            res.end(JSON.stringify({
                "error": 1,
                "message": "Failed to load spots cause by : " + err,
                "list_spots": null
            }));
        } else {
            console.log("\t- Envoie des spots avec les params : " + JSON.stringify(params));
            res.writeHead(201, 'Content-Type', 'application/json');
            res.end(JSON.stringify({
                "error": 0,
                "message": "Success to load spots",
                "list_spots": result
            }));
        }
    })
}

// Export des fonction
exports.run = run;