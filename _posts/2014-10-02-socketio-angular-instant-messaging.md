---
layout: post
title: "Socket.io & AngularJS for Instant Messaging"
date: 2014-10-02
backgrounds:
    - http://www.branded3.com/uploads/2014/08/503944255.jpg
    - http://avocaventures.com/wp-content/uploads/2014/11/lines-of-code.jpg
thumb: http://www.kokmoka.com/wp-content/uploads/lightning-gesture-logo.png
categories: web development
tags: socket.io angularjs 1dollar
author: Radu Chiriac
---

Avec l’idée de revisiter la classique messagerie instantanée en quelque chose de plus ludique, j’ai décidé de remplacer les mots de la messagerie par des gestes que l’on fait sur son écran.

Les bases

Pour partir sur une base saine, j’ai créé un système javascript full-stack. On a besoin de Node.js et de quelques dépendances coté serveur ainsi que sur le client. Une fois Node.js installé, on va cloner le repository en local avec :
git clone https://github.com/raduchiriac/lightning-gestures lightninggestures

Le fichier package.json est déjà en place, du coup on peut directement télécharger les dépendances serveur avec un npm install, ensuite pour les dépendances client on a besoin de Bower : npm install -g bower. Pour télécharger les libraires client on va faire bower install

Mais, comment ça fonctionne ?

Finalement, cette messagerie est devenue un jeu ou on a 10 secondes pour faire le geste qui nous est demandé. Si on est suffisamment rapide on va gagner des points et on va monter dans la liste des scores.

Chaque tournée est définie comme une session ou un geste est proposé au hasard par le serveur et l’envoie aux tous les clients qui doivent le reproduire au plus vite.

Coté serveur

J’ai utilisé Socket.io pour la communication entre le serveur et le client. Vous allez trouver le fichier models/stopwatch.js qui s’occupe du timing et de la synchronisation de tout les clients. Il envoie via models/stopwatch_config.js des statuts comme: « nouvelle session », « session terminée », le temps restant de chaque session etc. ensuite, stopwatch_config.js traite tout ces événements.

// RECUPERATION D'UN GESTE DANS LE ARRAY
this.sessionDrawing = this.sessions[Math.floor(Math.random() * this.sessions.length)];
this.sessionTimestamp = new Date().getTime();
this.interval = setInterval(this.onTick, this.second);

// A VOS MARQUES, PRETS, GO !
this.emit('stopwatch:start', {
    'time': this.formatTime(this.duration),
    'drawing': this.sessionDrawing,
    'translation': this.translations[localsessionDrawing],
});
Coté client

On n’a pas vraiment besoin d’un framework MV* mais j’ai utilisé certains services et directives d’AngularJS pour la communication avec le serveur et la manipulation du DOM. Pour nous, un seul service public/js/services.js suffit pour écouter tout les événements et appeler la fonction callback avec un $scope.$apply().

J’utilise la libraire « $1 Unistroke Recognizer » créé par l’Université de Washington pour la reconnaissance des gestes. Cette librairie compare les points d’un array envoyé par le client avec des points/formes déjà mémorisés auparavant. Les points sont dessinés sur un <canvas> lors d’un touchmove et envoies a $1 après le touchend. La directive « draw » peut être retrouvé dans public/js/directives.js.

var result = _r.Recognize(_points);

var drawing = result.Name,
  precision = Math.round(result.Score * 100);
scope.sendMessage(drawing, precision);
Le résultat calculé par $1 est envoyé au serveur qui va déterminer si le geste correspond à la session. Si oui, le serveur calcule le score et l’annonce à tous les participants.

var timestamp = new Date().getTime(),
  session = stopwatch.getSession(),
  calculated_score = (stopwatch.getDuration() - (timestamp - session.time)) / 1000;

user.score += calculated_score;

if (session.drawing.toLowerCase() == data.drawing) {
  socket.broadcast.emit('send:message', {
    user: user,
    text: data.drawing
  });
  socket.broadcast.emit('set:score', {
    name: name,
    score: user.score,
  });
  fn(true, user.score);
} else {
  fn(false);
}
Astuce: Comment utiliser un filtre AngularJS pour afficher la vraie position dans une liste ordonné par une propriété d’un objet ?

Les utilisateurs sont de simples objects avec chacun un nom et un score {name: 'John', score: 50}. Comme vous pouvez le voir dans le fichier views/index.jade les utilisateurs sont ordonnés par leur propriété « score » li.list-group-item(ng-repeat="user in users | orderBy:'score':true")
Apres chaque geste correctement fait, le serveur envoie un score mais c’est le client qui calcule la position dans la collection des utilisateurs. AngularJS a une excellente fonction filter pour faire cela. On utilise indexOf() pour récupérer l’index du array ordonné après le passage du $filter et on rajoute 1 car l’indexation d’un array commence par 0 :

var ordoredUsers = $filter('orderBy')($scope.users, '-score');
var filterusers = $filter('filter')($scope.users, {
    name: $scope.name
})[0];
$scope.position = ordoredUsers.indexOf(filterusers) + 1;
Pour finir

Vous pouvez enfin faire cd lightninggestures et puis node server.js pour voir le résultat dans votre navigateur. Le serveur tourne en localhost sur le port 8080.

Démonstration

Envoyez ce lien http://bit.do/geste à vos amis car c’est beaucoup plus drôle de jouer à plusieurs. Enjoy !
