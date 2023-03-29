var flipper = new flipperClass(0, 400, 200, 200, "paddleL.png");

// Cette class controler l'objet flipper qui représente le cavenas de base
function flipperClass(flipperX, flipperY, flipperWidth, flipperHeight, flipperImg) {
  // Constructor
  this.x = flipperX;
  this.y = flipperY;
  this.width = flipperWidth;
  this.height = flipperHeight;

  this.img = new Image();
  this.img.src = flipperImg;


  // déclare methods - ball ne doit pas continuer le déplacement au dela du screen

  this.moveLeft = function() {
    if (this.x > 5) {
      this.x -= 5;
    }
  }


  // dessin l'image grace au draw
  this.draw = function() {
    c.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
}


// class pour l'objet "ball"
function ballClass() {
  // Constructor
  this.x = 50;
  this.y = 100;
  this.width = 40;
  this.height = 40;

  // dx et dy réprensente la vitesse de déplacement de la balle
  // x et y sont défini a 7 (par défaut)
  this.dx = 7;
  this.dy = 7;

  this.img = new Image();
  this.img.src = "src/ball.png";


  // Cette fonction renvoie true si cette boule coupe « obj », où « obj » est
  // soit un objet pare-chocs, soit un objet flipper. Renvoie false dans le cas contraire.*//

  this.intersects = function(obj) {
    if (this.x < obj.x + obj.width &&
      this.x + this.width > obj.x &&
      this.y < obj.y + obj.height &&
      this.y + this.height > obj.y) {
      return true;
    } else {
      return false;
    }
  }



// Fonction de mise à jour principale pour balle, s’occupe de:
//1. Mouvement de la balle (vitesse, trajectoire)
//2. logique de bord (rebond sur les bords, matrice sur le bord inférieur)
//3. rebondir sur les murs du cavenas 'flipper.png'
//4. éliminer les blocs qui sont touchés

  
  this.update = function() {
    // Move
    this.x += this.dx;
    this.y += this.dy;


    // rebond sur un mur droit
    if (this.x < 0 && this.dx < 0) {
      this.dx *= -1;
    }

    // Rebond et changement de direction 
    if (this.x + this.width > cWidth && this.dx > 0) {
      this.dx *= -1;
    }

    // Axe direction -1
    if (this.y < 0 && this.dy < 0) {
      this.dy *= -1;
    }

    // Fond du flipper : ball tombe, afficher un message puis relancer une balle dans la boucle if
    if (this.y + this.height > cHeight && this.dy > 0) {
      lives -= 1;
      if (lives == 0) {
        gameState = "gameover";
      }
      ball.x = 50;
      ball.y = 100;

      sndKick.currentTime = 0;
      sndKick.play();

    }

    // Lancement de partie
    if (this.intersects(flipper)) {
      this.dy *= -1
      sndTop.currentTime = 0;
      sndTop.play();
    }

    for (i = 0; i < 16; i++) {
        if (tomatoArray[i].bVisible == true &&
          this.intersects(tomatoArray[i])) {
          score += 10;
          tomatoArray[i].bVisible = false;
          if (this.dy < 0) {
            this.dy *= -1;
          }
          sndSnare.currentTime = 0;
          sndSnare.play();
  
        }
      }
    }
  
    // affichage ball
    this.draw = function() {
      c.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }
  
  
  
  // Class reservé aux bumpers et a leurs placements
  function tomatoClass(x, y) {
    // Constructor
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;
    this.bVisible = true; // 
  
    this.img = new Image();
    this.img.src = "oreo.png";
  
    // Draw method
    this.draw = function() {
      if (this.bVisible) {
        c.drawImage(this.img, this.x, this.y, this.width, this.height);
      }
    }
  }
  
  
  
  
  // Canvas context; used to call Canvas methods
  var c;
  
  // Canvas width and height.
  var cWidth, cHeight;
  
  // Stores the current keyboard state
  var curkeys = [];
  
  // Stores keys that have been newly pressed since last update
  var newkeys = [];
  
  
  
  // Our global variables (flipper, ball, tomatoes)
  var flipper, ball;
  var tomatoArray = [];
  
  // The current game state, can be one of: "play", "gameover"
  var gameState = "instructions";
  var score = 0;
  var lives = 3;
  
  var sndCymbal = new Audio('audio/cymbal.wav');
  var sndKick = new Audio('audio/buzzer.wav');
  var sndSnare = new Audio('audio/hit.mp3');
  var sndTop = new Audio('audio/jump.mp3');
  
  var flipperDirection = "down";

  // Initializes entire game framework. This method should only be called
// once, by the body onload event handler.
function gameFrameworkInit()

{
  // Initialize key arrays
  for (i = 0; i < 256; i++) {
    curkeys[i] = false;
    newkeys[i] = false;
  }

  // Initialize global variables for canvas
  c = myCanvas.getContext('2d');
  cWidth = myCanvas.width;
  cHeight = myCanvas.height;


  // Initialize global variables for our game
  flipper = new flipperClass();
  ball = new ballClass();

  // Populate tomatoArray[] with 16 tomatoes spread out near the top of the canvas
  for (i = 0; i < 16; i++) {
    tomatoArray[i] = new tomatoClass(50 * i, 20);
  }



  // Start listeners for getting keyboard state
  window.addEventListener('keydown',
    function(e) {
      if (!curkeys[e.keyCode]) {
        curkeys[e.keyCode] = true;
        newkeys[e.keyCode] = true;
      }
    }
  );

  window.addEventListener('keyup',
    function(e) {
      curkeys[e.keyCode] = false;
    }
  );

  // Schedule the update function to be called right before the next repaint.
  // (At the end of the update function, it will schedule itself to be called
  // again before the NEXT repaint, and so on.
  window.requestAnimationFrame(gameUpdate);
}



// Main update loop for the entire game
function gameUpdate() {
  if (gameState == "play") {
    ball.update();

    flipper.update();

    if (curkeys[37] == true) {
      flipperPosition = "up";
      flipper.img.src = "ball.png";
    }

    if (curkeys[37] == false) {
      flipperPosition = "down";
      flipper.img.src = "paddle.png";
    }




    if (curkeys[39] == true) {
      flipper.x += 5;
    }

    if (curkeys[40] == true) {
      flipper.y += 5;
    }

    if (curkeys[38] == true) {
      flipper.y -= 5;
    }


  }

  if (gameState == "gameover") {
    if (newkeys[13]) {
      location.reload();
    }

  }

  if (gameState == "instructions") {
    if (newkeys[13]) {
      gameState = "play"
    }

  }

  // Reset newkeys
  for (i = 0; i < 256; i++) {
    newkeys[i] = false;
  }

  // At the end of the update function, repaint the screen
  gameDraw();

  // Last thing the update function does is to schedule itself to be called
  // again before the next repaint
  window.requestAnimationFrame(gameUpdate);
}


// Main draw loop for the entire game
function gameDraw() {
  // Clear the canvas before we draw the current frame
  c.clearRect(0, 0, cWidth, cHeight);

  // Draw flipper/ball/bumper
  if (gameState == "play") {
    flipper.draw();
    ball.draw();
    for (i = 0; i < 16; i++) {
      tomatoArray[i].draw();
    }

    c.font = "14px Arial";
    c.fillText("Votre score: " + score, 680, 10);
    c.fillText("balles restantes: " + lives, 600, 10);
  }

  if (gameState == "instructions") {
    c.font = "20px orbitron";
    c.fillText("Bienvenue dans Proto pinball", 250, 300);
    c.fillText("Utilise les fleches directionnel pour deplacer les cross du flipper", 250, 325);
    c.fillText("Essayer de renvoyer la proto-ball", 250, 350);
    c.fillText("Maintenant obtenez le plus haut score possible !", 250, 375);


  }

  if (gameState == "gameover") {
    c.font = "17px Arial";
    c.fillText("Game Over", 250, 300);
    c.fillText("Votre score final est de: " + score, 250, 400);
    c.fillText("Appuis sur espace pour relancer une partie", 250, 425)

  }

}







<html> 

<head> 

  <style> 
    canvas { 
      background-image: url("src/retrobackground.png"); 
    } 
    
  </style> 

</head> 

<body onload="gameFrameworkInit()"> 

  <canvas id="myCanvas" width="800" height="600"></canvas> 

</body> 

</html>
