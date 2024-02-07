export const fr = {
  appName: "Quizzy",
  common : {
    'ok': 'Ok',
  },
  header : {
    statusTooltip: {
      ko: 'Le serveur est injoignable',
      partial: 'Le serveur répond, mais pas la base de données',
      ok: 'Le serveur est en ligne !',
      pending: 'Vérification du statut serveur...'
    },
    userMissing: 'Utilisateur inconnu (issue #4)'
  },
  quiz: {
    defaultTitle: 'Nouveau Quiz',
    defaultDescription: '',
    defaultQuestionTitle: 'Nouvelle question'
  },
  registerPage: {
    title: 'Inscription',
    username: {
      placeholder: 'Nom d\'utilisateur',
      error : {
        required: 'Le nom d\'utilisateur est requis',
      }
    },
    email: {
      placeholder: 'Adresse email',
      error : {
        required: 'L\'adresse email est requise',
        email: 'L\'adresse email n\'est pas valide'
      }
    },
    password: {
      placeholder: 'Mot de passe',
      error: {
        required: 'Le mot de passe est requis',
        minlength: 'Le mot de passe doit contenir au moins 8 caractères'
      }
    },
    confirmPassword: {
      placeholder: 'Confirmez le mot de passe',
      error: {
        required: 'La confirmation du mot de passe est requise',
      }
    },
    error : {
      passwordsDoNotMatch: 'Les mots de passe ne correspondent pas'
    },
    button: {
      label: 'S\'inscrire',
    },
    login : {
      label: 'Déjà inscrit ?',
      link: 'Connectez-vous !'
    }
  },
  loginPage: {
    title: 'Connexion',
    email: {
      placeholder: 'E-mail*',
      error: {
        required: "L'e-mail est obligatoire",
        email: "L'e-mail n'est pas valide",
      },
    },
    password: {
      placeholder: 'Mot de passe*',
      error: {
        required: 'Le mot de passe est obligatoire',
      },
    },
    button: {
      label: 'Connexion',
    },
    register: {
      label: 'Créer un compte',
    },
    error: {
      loginFailed: 'Email / mot de passe invalide',
    },
    help: {
      text: "Besoin d'aide ?",
      link: 'Contactez-nous',
    },
  },
  welcomePage: {
    title: 'Bienvenue sur Quizzy !',
    description: 'Affrontez vos amis dans des quiz de culture générale !',
    join : {
      title : 'Rejoignez un questionnaire !',
      label: 'Entrez le code du questionnaire',
      placeholder: 'Code du questionnaire',
      button: 'Rejoindre',
    },
    notLogged: {
      button: 'Connectez-vous pour accéder à vos questionnaires !'
    },
    dashboard: {
      title: 'Vos Quiz',
      errorLoadingQuizzes: 'Erreur lors du chargement des questionnaires - le backend ne répond pas.',
      createQuiz: 'Nouveau Quiz',
      loading: 'Chargement des quizz en cours...',
      empty: 'Vous n\'avez pas encore de quiz. Créez-en un !',
      hateoas: {
        createMissing: 'Aucun lien dans la réponse de la liste des quiz ne permet la creation de quiz',
      },
      list : {
        title: '{{nb}} quizzes',
      }
    }
  },
  quizEditPage: {
    notFound: 'Quiz non trouvé',
    error: 'Erreur lors du chargement du quiz',
    title: {
      updated: 'Titre mis à jour',
      updateError: 'Erreur lors de la mise à jour du titre'
    },
    questions: {
      title: 'Questions',
      add: "Ajouter une question",
      empty: "Pas encore de questions",
      noQuestionReturned: 'Aucune question renvoyée par le backend',
    },
    question: {
      title: 'Question',
      newAnswer: {
        placeholder: 'Nouvelle réponse',
      }
    }
  }
}
