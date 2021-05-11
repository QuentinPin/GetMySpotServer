// Import des module
require('dotenv').config();
var mysql = require('mysql');
var bcrypt = require('bcrypt');

//Variable d'environement
const BDD_HOSTNAME = process.env.BDD_HOSTNAME;
const BDD_USER = process.env.BDD_USERNAME;
const BDD_NAME = process.env.BDD_NAME;

//Variable
var con;


/* Gestion de la connection à la BDD */
con = mysql.createConnection({
    host: BDD_HOSTNAME,
    user: BDD_USER,
    database: BDD_NAME
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connecté à la BDD");
});

/* Fonction disponible */
/**
 * Création d'un compte utilisateur dans la BDD
 * @param pseudo pseudonyme de l'utilisateur à créer
 * @param password mot de passe de l'utilisateur à créer
 * @param callback
 */
function create_user_account(pseudo, password, callback) {
    var password_to_store = hash_password(password);
    var sql = "INSERT INTO USER(image, password, pseudo) VALUES (NULL, '" + password_to_store + "', '" + pseudo + "')";
    con.query(sql, function (err, result) {
        callback(err, result);
    });
}

/**
 * Vérification login utilisateur
 * @param pseudo pseudonyme de l'utilisateur à connecté
 * @param password mot de passe de l'utilisateur à connecté
 * @param callback
 */
function login(pseudo, password, callback) {
    var sql = "SELECT * FROM USER WHERE pseudo='" + pseudo + "';";
    con.query(sql, function (err, result) {
        if (err)
            callback("internal error", false);
        else if (result[0] === undefined)
            callback("no user found for this pseudo", false);
        else
            callback(err, isPasswordCorrect(password, result[0].password));
    });
}

/**
 * Enregistrement de la photo de profile de l'utilisateur
 * @param pseudo pseudonyme de l'utilisateur
 * @param image image en base64 a enregistré
 * @param callback
 */
function profile_picture(pseudo, image, callback) {
    var sql = "UPDATE USER set image = '" + image + "' WHERE pseudo = '" + pseudo + "'";
    con.query(sql, function (err, result) {
        if (err)
            callback("internal error", false);
        else if (result.affectedRows === 0)
            callback("Pseudonyme error", false);
        else
            callback(err, true);
    });
}

/**
 * Ajout d'un spot dans la base de données
 * @param params toutes les infromation d'un spot
 * @param callback
 */
function push_spot(params, callback) {
    var sql = "INSERT INTO COLLECT(battery, time, position_latitude, position_longitude, pressure, brightness, pseudo) " +
        "VALUES (" +
        "'" + params.battery + "'," +
        "NOW()," +
        "" + params.position_latitude + "," +
        "" + params.position_longitude + "," +
        "'" + params.pressure + "'," +
        "'" + params.brightness + "'," +
        "'" + params.pseudo + "'" +
        ")";
    con.query(sql, function (err, result) {
        if (err)
            callback(err.sqlMessage, false);
        else
            callback(err, true);
    });
}

/**
 * Récupération de la photo de profile d'un utilisateur
 * @param pseudo
 * @param callback
 */
function get_profile_picture(pseudo, callback) {
    var sql = "SELECT image FROM USER WHERE pseudo = '" + pseudo + "';";
    con.query(sql, function (err, result) {
        if (err)
            callback("internal error", null);
        else if (result[0] === undefined)
            callback("Pseudonyme error", null);
        else
            callback(null, result[0].image);
    });
}


/* Fonction utilitaire */
function hash_password(password) {
    var salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

function isPasswordCorrect(password, hash) {
    return bcrypt.compareSync(password, hash);
}

exports.create_user_account = create_user_account;
exports.login = login;
exports.push_profile_picture = profile_picture;
exports.get_profile_picture = get_profile_picture;
exports.push_spot = push_spot;