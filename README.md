# GetMySpotServer
**Projet :** GetMySpotServer - API NodeJS
**Autre projet en relation :** GetMySpotClient - Application Android - [lien](https://github.com/HydroZFR/GetMySpotClient)
**Description** : Ce projet a été réalisé dans le cadre du cours de développement Android/API à l'ESEO. Il s'agit d'une application permettant aux utilisateurs de publier des photos de lieu qu'ils apprécient au cours de leur balade. Elle permet également de partager d'autres informations en plus de l'image : 
* L'adresse du lieu
* L'altitude
* La pression atmosphérique
* La luminosité ambiante
* Le niveau de batterie de l'appareil

Ces lieux sont appellés "spot" dans l'application.


## Informations
Ce server NodeJs est l'API avec laquelle [GetMySpotClient](https://github.com/HydroZFR/GetMySpotClient) communique. Cette API gère les insertions/modifications de la base de données suivants les requettes effectués par le client.
Le script de création de la base de donnée se situe dans utils/bdd.