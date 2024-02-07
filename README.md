# Quizzy - Application de quiz  ✨

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>


##
## Lancement de l'application
Pour démarrer le serveur de développement, exécutez `nx serve quizzy`. Ouvrez votre navigateur et accédez à http://localhost:4200/.



## Langage utilisé
- TypeScript (Node.js avec le framework Nest.js)

## Description
Quizzy est une application de quiz qui permet aux utilisateurs de créer, gérer et participer à des quiz en ligne. Les utilisateurs peuvent créer des quiz personnalisés avec des questions et des réponses, puis inviter d'autres utilisateurs à y participer.

## Fonctionnalités principales
1. **Création de quiz :** Les utilisateurs peuvent créer leurs propres quiz en spécifiant le titre, la description, les questions et les réponses.
2. **Participation aux quiz :** Les utilisateurs peuvent rejoindre des quiz créés par d'autres utilisateurs.
3. **Démarrage des quiz :** Les créateurs de quiz peuvent démarrer les quiz une fois qu'ils sont prêts.
4. **Affichage des résultats :** Les résultats du quiz sont affichés à la fin de chaque session.

## Structure du projet
Le projet suit une architecture basée sur le framework Nest.js. Les principales parties du projet incluent :
- **Controllers :** Gère les requêtes HTTP et les réponses.
- **Services :** Logique métier et manipulation des données.
- **Modèles :** Représentent les entités du projet (Quiz, Question, Réponse, etc.).

## Installation
1. Clonez le dépôt : `git clone [https://github.com/zlahmar/fil_rouge.git]`
2. Installez les dépendances : `npm install`

## Difficultés rencontrées
- **Intégration Firebase :** L'intégration de Firebase pour la gestion des utilisateurs et des données a nécessité une compréhension approfondie de la documentation Firebase.
- **Validation des données :** L'utilisation de bibliothèques comme class-validator pour la validation des données a nécessité une adaptation à la programmation orientée objet.

## Collaborateurs : Groupe 4
- ELIEZER-VANEROT Joshua
- LAHMAR Zainab
- LAURET Quentin
- MICHEL Romain
- SAUTOUR William

## Licence
Ce projet est sous licence [LICENSE] - voir le fichier [LICENSE.md](LICENSE.md) pour plus de détails.
