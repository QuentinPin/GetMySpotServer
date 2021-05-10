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
 */
async function create_user_account(pseudo, password, callback) {
    var password_to_store = hash_password(password);
    var sql = "INSERT INTO USER(image, password, pseudo) VALUES (NULL, '" + password_to_store + "', '" + pseudo + "')";
    await con.query(sql, function (err, result) {
        callback(err, result);
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