/**
 * @author Josef Jelinek
 * @version 3.5b
 * Conversion to JavaScript by Michael Feather
 */
"use strict";

function AnimCube(params) {
  var D = 3; // cube dimension
  var D2 = D*D;
  // external configuration
  var config = [];
  // background colors
  var bgColor;
  var hlColor;
  var textColor;
  var buttonBgColor;
  var sliderColor; // progress bar
  var sliderBgColor;
  var buttonBorderColor;
  var cubeColor;
  // cube colors
  var colors = [];
  // cube facelets
  var cube = [];
  var scube = [];
  var initialCube = [];
  var initialSCube = [];
  // normal vectors
  var faceNormals = [
    [ 0.0, -1.0,  0.0], // U
    [ 0.0,  1.0,  0.0], // D
    [ 0.0,  0.0, -1.0], // F
    [ 0.0,  0.0,  1.0], // B
    [-1.0,  0.0,  0.0], // L
    [ 1.0,  0.0,  0.0]  // R
  ];
  // vertex co-ordinates
  var cornerCoords = [
    [-1.0, -1.0, -1.0], // UFL
    [ 1.0, -1.0, -1.0], // UFR
    [ 1.0, -1.0,  1.0], // UBR
    [-1.0, -1.0,  1.0], // UBL
    [-1.0,  1.0, -1.0], // DFL
    [ 1.0,  1.0, -1.0], // DFR
    [ 1.0,  1.0,  1.0], // DBR
    [-1.0,  1.0,  1.0]  // DBL
  ];
  // vertices of each face
  var faceCorners = [
    [0, 1, 2, 3], // U: UFL UFR UBR UBL
    [4, 7, 6, 5], // D: DFL DBL DBR DFR
    [0, 4, 5, 1], // F: UFL DFL DFR UFR
    [2, 6, 7, 3], // B: UBR DBR DBL UBL
    [0, 3, 7, 4], // L: UFL UBL DBL DFL
    [1, 5, 6, 2]  // R: UFR DFR DBR UBR
  ];
  // corresponding corners on the opposite face
  var oppositeCorners = [
    [0, 3, 2, 1], // U->D
    [0, 3, 2, 1], // D->U
    [3, 2, 1, 0], // F->B
    [3, 2, 1, 0], // B->F
    [0, 3, 2, 1], // L->R
    [0, 3, 2, 1], // R->L
  ];
  // faces adjacent to each face
  var adjacentFaces = [
    [2, 5, 3, 4], // U: F R B L
    [4, 3, 5, 2], // D: L B R F
    [4, 1, 5, 0], // F: L D R U
    [5, 1, 4, 0], // B: R D L U
    [0, 3, 1, 2], // L: U B D F
    [2, 1, 3, 0]  // R: F D B U
  ];
  // current twisted layer
  var twistedLayer;
  var twistedMode;
  // directions of facelet cycling for all faces
  var faceTwistDirs = [1, 1, -1, -1, -1, -1];
  // initial observer co-ordinate axes (view)
  var eye = [0.0, 0.0, -1.0];
  var eyeX = [1.0, 0.0, 0.0]; // (sideways)
  var eyeY = []; // (vertical)
  var initialEye = [];
  var initialEyeX = [];
  var initialEyeY = [];
  // angle of rotation of the twistedLayer
  var currentAngle; // edited angle of twisted layer
  var originalAngle; // angle of twisted layer
  // animation speed
  var speed;
  var doubleSpeed;
  // current state of the program
  var natural = true; // cube is compact, no layer is twisted
  var toTwist; // layer can be twisted
  var interrupted; // thread was interrupted
  var restarted; // animation was stopped
  var mirrored; // mirroring of the cube view
  var editable; // editation of the cube with a mouse
  var repeatable; // allow repetition of sequence
  var clickProgress; // allow advance by clicking progress bar
  var twisting; // a user twists a cube layer
  var spinning; // an animation twists a cube layer
  var animating; // animation run
  var dragging; // progress bar is controlled
  var demo; // demo mode
  var persp; // perspective deformation
  var scale; // cube scale
  var align; // cube alignment (top, center, bottom)
  var hint;
  var faceShift;
  var hintHoriz;
  var hintVert;
  var hintBorder;
  var moveCounter;
  // move sequence data
  var move = [];
  var demoMove = [];
  var initialMove = [];
  var initialReversedMove = [];
  var curMove;
  var movePos;
  var moveDir;
  var moveOne;
  var moveAnimated;
  var metric;
  var infoText = [];
  var curInfoText;
  // state of buttons
  var buttonBar; // button bar mode
  var buttonHeight;
  var drawButtons = true;
  var pushed;
  var buttonPressed = -1;
  var progressHeight = 6;
  var textHeight = 12;
  var moveText;
  var moveTextSpace;
  var outlined = true;
  var snap = false;
  var signNotation;
  var wcaNotation;
  var yzAlt;
  var superCube = false;
  var scrambleToggle = false;
  var scramble = 0;
  var randMoveCount = 0;
  var scw = 0;
  var borderWidth = 10;
  var rotateAllowed = 1;
  // transformation tables for compatibility with Lars's applet
  var posFaceTransform = [3, 2, 0, 5, 1, 4];
  var posFaceletTransform = [
    [42,35,28,21,14,7,0,43,36,29,22,15,8,1,44,37,30,23,16,9,2,45,38,31,24,17,10,3,46,39,32,25,18,11,4,47,40,33,26,19,12,5,48,41,34,27,20,13,6], // B
    [6,13,20,27,34,41,48,5,12,19,26,33,40,47,4,11,18,25,32,39,46,3,10,17,24,31,38,45,2,9,16,23,30,37,44,1,8,15,22,29,36,43,0,7,14,21,28,35,42], // F
    [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48], // U
    [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48], // R
    [42,35,28,21,14,7,0,43,36,29,22,15,8,1,44,37,30,23,16,9,2,45,38,31,24,17,10,3,46,39,32,25,18,11,4,47,40,33,26,19,12,5,48,41,34,27,20,13,6], // D
    [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48]  // L
  ];

  function onModuleLoad() {
    var fname = getParameter("config");
    if (fname != null)
      loadConfigFile(fname);
    else {
      init();
    }
  }

  // setup default configuration
  function loadConfigFile(file) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = handler;
    xhr.open('GET', file, true);
    xhr.send();

    function handler() {
      if (xhr.readyState == 4) {
        if (xhr.status == 200)
          parseConfigFile(xhr.responseText);
        else
          console.log('Error loading config file: ' + file);
        init();
      }
    }
  }

  function parseConfigFile(text) {
    var lines = text.split('\n');
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].split('=');
      if (typeof line[1] != 'undefined')
        config[line[0]] = line[1].trim();
    }
  }

  function init() {
    // setup colors
    colors[0]  = rgbToHex(255, 128,  64);  // 0 - light orange
    colors[1]  = rgbToHex(255,   0,   0);  // 1 - pure red
    colors[2]  = rgbToHex(  0, 255,   0);  // 2 - pure green
    colors[3]  = rgbToHex(  0,   0, 255);  // 3 - pure blue
    colors[4]  = rgbToHex(153, 153, 153);  // 4 - white grey
    colors[5]  = rgbToHex(170, 170,  68);  // 5 - yellow grey
    colors[6]  = rgbToHex(187, 119,  68);  // 6 - orange grey
    colors[7]  = rgbToHex(153,  68,  68);  // 7 - red grey
    colors[8]  = rgbToHex(68,  119,  68);  // 8 - green grey
    colors[9]  = rgbToHex(0,    68, 119);  // 9 - blue grey
    colors[10] = rgbToHex(255, 255, 255);  // W - white
    colors[11] = rgbToHex(255, 255,   0);  // Y - yellow
    colors[12] = rgbToHex(255,  96,  32);  // O - orange
    colors[13] = rgbToHex(208,   0,   0);  // R - red
    colors[14] = rgbToHex(0,   144,   0);  // G - green
    colors[15] = rgbToHex(32,   64, 208);  // B - blue
    colors[16] = rgbToHex(176, 176, 176);  // L - light gray
    colors[17] = rgbToHex( 80,  80,  80);  // D - dark gray
    colors[18] = rgbToHex(255,   0, 255);  // M - magenta
    colors[19] = rgbToHex(  0, 255, 255);  // C - cyan
    colors[20] = rgbToHex(255, 160, 192);  // P - pink
    colors[21] = rgbToHex(32,  255,  16);  // N - light green
    colors[22] = rgbToHex(  0,   0,   0);  // K - black
    colors[23] = rgbToHex(128, 128, 128);  // . - gray
    // setup window background color
    var param = getParameter("bgcolor");
    if (param != null && param.length == 6) {
      if (validateColor(param))
        bgColor = "#" + param;
      else
        bgColor = "gray";
    }
    else
      bgColor = "gray";
    // setup button bar background color
    param = getParameter("butbgcolor");
    if (param != null && param.length == 6) {
      if (validateColor(param))
        buttonBgColor = "#" + param;
      else
        buttonBgColor = bgColor;
    }
    else
      buttonBgColor = bgColor;
    // custom colors
    param = getParameter("colors");
    if (param != null) {
      for (var i = 0, j = 0; i < 10 && j < param.length; i++, j+=6) {
        var s = param.substr(j, 6);
        if (s.length == 6 && validateColor(s))
          colors[i] = "#" + s;
      }
    }
    // clean the cube
    for (var i = 0; i < 6; i++)
      for (var j = 0; j < D2; j++)
        cube[i][j] = i + 10;
    param = getParameter("supercube");
    if (param != null)
      if ("1" == (param)) {
        superCube = true;
        setBorderWidth(.06);
        // change white to black for default colorscheme
        for (var i = 0; i < D2; i++)
          cube[0][i] = 22;
        param = getParameter("scw");
        if (param != null) {
          if ("1" == (param))
            scw = 1;
          else if ("2" == (param))
            scw = 2;
        }
        if (scw == 1)
          colors[10] = "#000000";
      }
    param = getParameter("gabbacolors");
    if (param != null)
      if ("1" == (param)) {
        if (superCube == true) {
          colors[11] = "#fdcf00"; // Y - yellow
          colors[12] = "#fd4e0a"; // O - orange
          colors[13] = "#93000d"; // R - red
          colors[14] = "#00702d"; // G - green
          colors[15] = "#00347a"; // B - blue
        }
        else {
          setBorderWidth(.06);
          colors[11] = "#ffd90a"; // Y
          colors[12] = "#ff4f0b"; // O
          colors[13] = "#9e0b19"; // R
          colors[14] = "#0b7d39"; // G
          colors[15] = "#0b4186"; // B
        }
      }
    param = getParameter("borderwidth");
    if (param != null) {
      borderWidth = 0;
      for (var i = 0; i < param.length; i++)
        if (param.charAt(i) >= '0' && param.charAt(i) <= '9')
          borderWidth = borderWidth * 10 + parseInt(param[i]);
      if (borderWidth >= 0 && borderWidth <= 20)
        setBorderWidth(borderWidth / 100);
      else
        borderWidth = 10;
    }
    // clean the supercube
    if (superCube) {
      for (var i = 0; i < 6; i++)
        for (var j = 0; j < D2; j++)
          scube[i][j] = 0;
    }
    var initialPosition = "lluu";
    // setup color configuration of the solved cube
    param = getParameter("colorscheme");
    if (param != null && param.length == 6) {
      for (var i = 0; i < 6; i++) { // udfblr
        var color = 23;
        for (var j = 0; j < 23; j++) {
          if (param[i].toLowerCase() == "0123456789wyorgbldmcpnk".charAt(j)) {
            color = j;
            break;
          }
        }
        for (var j = 0; j < D2; j++)
          cube[i][j] = color;
      }
    }
    param = getParameter("scramble");
    if ("1" == (param))
      scramble = 1;
    else if ("2" == (param))
      scramble = 2;
    if (scramble == 0) {
      // setup facelets - compatible with Lars's applet
      param = getParameter("pos");
      if (param != null && param.length == D2*6) {
        initialPosition = "uuuuff";
        if (bgColor == "gray")
          bgColor = "white";
        for (var i = 0; i < 6; i++) {
          var ti = posFaceTransform[i];
          for (var j = 0; j < D2; j++) {
            var tj = posFaceletTransform[i][j];
            cube[ti][tj] = 23;
            for (var k = 0; k < 14; k++) {
              // "abcdefgh" ~ "gbrwoyld"
              if (param.charAt(i * D2 + j) == "DFECABdfecabgh".charAt(k)) {
                cube[ti][tj] = k + 4;
                break;
              }
            }
          }
        }
      }
      // setup color facelets
      param = getParameter("facelets");
      if (param != null && param.length == D2*6) {
        for (var i = 0; i < 6; i++) {
          for (var j = 0; j < D2; j++) {
            cube[i][j] = 23;
            for (var k = 0; k < 23; k++) {
              if (param[i * D2 + j].toLowerCase() == "0123456789wyorgbldmcpnk".charAt(k)) {
                cube[i][j] = k;
                break;
              }
            }
          }
        }
      }
      // setup supercube facelet twist
      param = getParameter("superfacelets");
      if (param != null && param.length == D2*6) {
        for (var i = 0; i < 6; i++) {
          for (var j = 0; j < D2; j++) {
            for (var k = 0; k < 4; k++) {
              if (param[i * D2 + j].toLowerCase() == "0123".charAt(k)) {
                scube[i][j] = k;
                break;
              }
            }
          }
        }
      }
    }
    signNotation = true;
    moveText = 1;
    yzAlt = true;
    wcaNotation = false;
    param = getParameter("wca");
    if (param != null)
      if ("1" == param) {
        wcaNotation = true;
        moveText = 2;
        yzAlt = true;
      }
    param = getParameter("yz");
    if (param != null)
      if ("0" == param)
        yzAlt = false;
      else if ("1" == param)
        yzAlt = true;
    param = getParameter("randmoves");
    if (param != null) {
      var rm = 0;
      for (var i = 0; i < param.length; i++)
        if (param.charAt(i) >= '0' && param.charAt(i) <= '9')
          rm = rm * 10 + parseInt(param[i]);
      if (rm > 0)
        randMoveCount = rm;
    }
    // setup move sequence (and info texts)
    param = getParameter("move");
    if ("random" == (param) || scramble > 0)
      param = randMoves(D, randMoveCount);
    move = (param == null ? [] : getMove(param, true));
    movePos = 0;
    curInfoText = -1;
    // setup initial move sequence
    if (scramble == 0) {
      param = getParameter("initmove");
      if (param != null) {
        if ("random" == (param))
          param = randMoves(D, randMoveCount);
        initialMove = param == ("#") ? move : getMove(param, false);
      }
      // setup initial reversed move sequence
      param = getParameter("initrevmove");
      if (param != null) {
        if ("random" == (param))
          param = randMoves(D, randMoveCount);
        initialReversedMove = param == ("#") ? move : getMove(param, false);
      }
      // setup demo move sequence
      param = getParameter("demo");
      if (param != null) {
        if ("random" == (param))
          param = randMoves(D, randMoveCount);
        demoMove = param == ("#") ? move : getMove(param, true);
        if (demoMove.length > 0 && demoMove[0].length > 0)
          demo = true;
      }
    }
    // setup initial cube position
    param = getParameter("position");
    vNorm(vMul(eyeY, eye, eyeX));
    if (param == null)
      param = initialPosition;
    var pi12 = Math.PI / 12;
    for (var i = 0; i < param.length; i++) {
      var angle = pi12;
      switch (param[i].toLowerCase()) {
        case 'd':
          angle = -angle;
        case 'u':
          vRotY(eye, angle);
          vRotY(eyeX, angle);
          break;
        case 'f':
          angle = -angle;
        case 'b':
          vRotZ(eye, angle);
          vRotZ(eyeX, angle);
          break;
        case 'l':
          angle = -angle;
        case 'r':
          vRotX(eye, angle);
          vRotX(eyeX, angle);
          break;
      }
    }
    vNorm(vMul(eyeY, eye, eyeX)); // fix eyeY
    // setup quarter-turn speed and double-turn speed
    speed = 0;
    doubleSpeed = 0;
    param = getParameter("speed");
    if (param != null)
      for (var i = 0; i < param.length; i++)
        if (param.charAt(i) >= '0' && param.charAt(i) <= '9')
          speed = speed * 10 + parseInt(param[i]);
    param = getParameter("doublespeed");
    if (param != null)
      for (var i = 0; i < param.length; i++)
        if (param.charAt(i) >= '0' && param.charAt(i) <= '9')
          doubleSpeed = doubleSpeed * 10 + parseInt(param[i]);
    if (speed == 0)
      speed = 10;
    if (doubleSpeed == 0)
      doubleSpeed = speed * 3 / 2;
    // perspective deformation
    persp = 0;
    param = getParameter("perspective");
    if (param == null)
      persp = 2;
    else
      for (var i = 0; i < param.length; i++)
        if (param.charAt(i) >= '0' && param.charAt(i) <= '9')
          persp = persp * 10 + parseInt(param[i]);
    // cube scale
    var varscale = 0;
    param = getParameter("scale");
    if (param != null)
      for (var i = 0; i < param.length; i++)
        if (param.charAt(i) >= '0' && param.charAt(i) <= '9')
          varscale = varscale * 10 + parseInt(param[i]);
    scale = 1.0 / (1.0 + varscale / 10.0);
    // hint displaying
    hint = false;
    param = getParameter("hint");
    if (param != null) {
      hint = true;
      faceShift = 0.0;
      for (var i = 0; i < param.length; i++)
        if (param.charAt(i) >= '0' && param.charAt(i) <= '9')
          faceShift = faceShift * 10 + parseInt(param[i]);
      if (faceShift < 1.0)
        hint = false;
      else
        faceShift /= 10.0;
    }
    hintHoriz = 3.7;
    param = getParameter("hinthoriz");
    if (param != null) {
      var n = parseFloat(param);
      if (n > 0)
        hintHoriz = n;
    }
    hintVert = 3.7;
    param = getParameter("hintvert");
    if (param != null) {
      var n = parseFloat(param);
      if (n > 0)
        hintVert = n;
    }
    hintBorder = 0;
    param = getParameter("hintborder");
    if (param != null)
      if (param == "1")
        hintBorder = 1;
    // appearance and configuration of the button bar
    buttonHeight = 13;
    param = getParameter("buttonheight");
    if (param != null) {
      var n = parseInt(param);
      if (n >= 9 & n <= 25)
        buttonHeight = n;
    }
    progressHeight = move.length == 0 ? 0 : 6;
    buttonBar = 1;
    param = getParameter("buttonbar");
    if ("0" == (param)) {
      buttonBar = 0;
      buttonHeight = 0;
      progressHeight = 0;
    }
    else if ("1" == (param))
      buttonBar = 1;
    else if ("2" == (param) || move.length == 0) {
      buttonBar = 2;
      progressHeight = 0;
    }
    // whether the cube can be edited with mouse
    param = getParameter("edit");
    if ("0" == (param))
      editable = false;
    else
      editable = true;
    // whether the sequence can be repeated
    param = getParameter("repeat");
    if ("0" == (param))
      repeatable = false;
    else
      repeatable = true;
    // whether clicking on the progress bar advances through the sequence
    param = getParameter("clickprogress");
    if ("0" == (param))
      clickProgress = false;
    else
      clickProgress = true;
    // displaying the textual representation of the move
    param = getParameter("movetext");
    if ("0" == (param))
      moveText = 0;
    else if ("1" == (param))
      moveText = 1;
    moveTextSpace = 1;
    param = getParameter("movetextspace");
    if ("0" == (param))
      moveTextSpace = 0;
    // how texts are displayed
    param = getParameter("textsize");
    if (param != null) {
      var n = parseInt(param);
      if (n >= 5 & n <= 40)
        textHeight = n;
    }
    param = getParameter("fonttype");
    if (param == null || "1" == (param))
      outlined = true;
    else
      outlined = false;
    // metric
    metric = 0;
    param = getParameter("metric");
    if (param != null) {
      if ("1" == (param)) // quarter-turn
        metric = 1;
      else if ("2" == (param)) // face-turn
        metric = 2;
      else if ("3" == (param)) // slice-turn
        metric = 3;
    }
    align = 1;
    param = getParameter("align");
    if (param != null) {
      // 0 = top, 1 = center, 2 = bottom
      var n = parseInt(param);
      if (n >= 0 & n <= 3)
        align = n;
      if (n >= 3 & n <= 99)
        align = n / 100;
    }
    param = getParameter("snap");
    if (param != null)
      if ("1" == (param))
        snap = true;
    // setup initial values
    for (var i = 0; i < 6; i++)
      for (var j = 0; j < D2; j++) {
        initialCube[i][j] = cube[i][j];
        initialSCube[i][j] = scube[i][j];
      }
    if (initialMove.length > 0)
      doMove(cube, initialMove[0], 0, initialMove[0].length, false);
    if (initialReversedMove.length > 0)
      doMove(cube, initialReversedMove[0], 0, initialReversedMove[0].length, true);
    if (scramble == 2)
      doMove(cube, move[0], 0, move[0].length, true);
    for (var i = 0; i < 3; i++) {
      initialEye[i] = eye[i];
      initialEyeX[i] = eyeX[i];
      initialEyeY[i] = eyeY[i];
    }
    // setup colors (contrast)
    if (colorAverage(bgColor) < 128) {
      textColor = "white";
      hlColor = brighter(bgColor);
    }
    else {
      textColor = "black";
      hlColor = darker(bgColor);
    }
    if (colorAverage(buttonBgColor) < 128)
      buttonBorderColor = "white";
    else
      buttonBorderColor = "black";
    sliderColor = textColor;
    param = getParameter("slidercolor");
    if (param != null && param.length == 6) {
      if (validateColor(param))
        sliderColor = "#" + param;
    }
    sliderBgColor = darker(bgColor);
    param = getParameter("sliderbgcolor");
    if (param != null && param.length == 6) {
      if (validateColor(param))
        sliderBgColor = "#" + param;
    }
    param = getParameter("troughcolor");
    if (param != null && param.length == 6) {
      if (validateColor(param))
        sliderBgColor = "#" + param;
    }
    cubeColor = "black";
    param = getParameter("cubecolor");
    if (param != null && param.length == 6) {
      if (validateColor(param))
        cubeColor = "#" + param;
    }
    moveCounter = 1;
    param = getParameter("counter");
    if ("0" == param)
      moveCounter = 0;
    curInfoText = (move.length > 0 && move[0][0] >= 1000) ? 0 : -1;
    init2();
    if (demo)
      startAnimation(-1);
  } // init()

  function getParameter(s) {
    var uparam = searchParams[s];
    if (typeof uparam == 'undefined')
      return config[s];
    return uparam;
  }

  function setBorderWidth(w) {
    border[0][0] = border[0][1] = border[1][1] = border[3][0] = w;
    border[1][0] = border[2][0] = border[2][1] = border[3][1] = 1.0 - w;
  }
  var moveModes = [
    0, 0, 0, 0, 0, 0, // UDFBLR
    7, 7, 7,          // ESM
    3, 3, 3, 3, 3, 3, // XYZxyz
    2, 2, 2, 2, 2, 2  // udfblr
  ];
  var moveCodes = [
    0, 1, 2, 3, 4, 5, // UDFBLR
    1, 2, 4,          // ESM
    5, 2, 0, 5, 2, 0, // XYZxyz
    0, 1, 2, 3, 4, 5  // udfblr
  ];

  function getMove(sequence, info) {
    if (info) {
      var inum = 0;
      var pos = sequence.indexOf('{');
      while (pos != -1) {
        inum++;
        pos = sequence.indexOf('{', pos + 1);
      }
      if (infoText == null) {
        curInfoText = 0;
        infoText = [];
      }
      else {
        var infoText2 = [];
        for (var i = 0; i < infoText.length; i++)
          infoText2[i] = infoText[i];
        curInfoText = infoText.length;
        infoText = infoText2;
      }
    }
    var num = 1;
    var pos = sequence.indexOf(';');
    while (pos != -1) {
      num++;
      pos = sequence.indexOf(';', pos + 1);
    }
    var mv = [];
    var lastPos = 0;
    pos = sequence.indexOf(';');
    num = 0;
    while (pos != -1) {
      mv[num] = getMovePart(sequence.substring(lastPos, pos), info, num++);
      lastPos = pos + 1;
      pos = sequence.indexOf(';', lastPos);
    }
    mv[num] = getMovePart(sequence.substring(lastPos), info, num);
    return mv;
  }

  function getMovePart(sequence, info, num) {
    if (wcaNotation) {
      sequence = wca_to_sign(sequence);
      sequence = convertNotation(sequence);
    }
    else if (signNotation)
      sequence = convertNotation(sequence);
    if (sequence.trim() == '#')
      if (typeof move[num] != 'undefined')
        return(move[num]);
    var length = 0;
    var mv = [];
    var moveCodeString = "UDFBLRESMXYZxyzudfblr";
    if (yzAlt == true)
      moveCodeString = "UDFBLRESMXZYxzyudfblr";
    for (var i = 0; i < sequence.length; i++) {
      if (sequence.charAt(i) == '.') {
        mv[length] = -1;
        length++;
      }
      else if (sequence.charAt(i) == '{') {
        i++;
        var s = "";
        while (i < sequence.length) {
          if (sequence.charAt(i) == '}')
            break;
          if (info)
            s += sequence.charAt(i);
          i++;
        }
        if (info) {
          infoText[curInfoText] = s;
          mv[length] = 1000 + curInfoText;
          curInfoText++;
          length++;
        }
      }
      else {
        for (var j = 0; j < 21; j++) {
          // if (sequence.charAt(i) == "UDFBLRESMXYZxyzudfblr".charAt(j)) {
          if (sequence.charAt(i) == moveCodeString.charAt(j)) {
            if (D%2 == 0) {
              var c = sequence.charAt(i);
              if (c == 'E' || c == 'S' || c == 'M')
                continue;
            }
            i++;
            var mode = moveModes[j];
            mv[length] = moveCodes[j] * 4 * (modeChar.length + 1);
            if (i < sequence.length) {
              if (moveModes[j] == 0) { // modifiers for basic characters UDFBLR
                for (var k = 0; k < modeChar.length; k++) {
                  if (sequence.charAt(i) == modeChar[k]) {
                    mode = k + 1;
                    i++;
                    break;
                  }
                }
              }
            }
            mv[length] += mode * 4;
            if (i < sequence.length) {
              if (sequence.charAt(i) == '1')
                i++;
              else if (sequence.charAt(i) == '\'' || sequence.charAt(i) == '3') {
                mv[length] += 2;
                i++;
              }
              else if (sequence.charAt(i) == '2') {
                i++;
                if (i < sequence.length && sequence.charAt(i) == '\'') {
                  mv[length] += 3;
                  i++;
                }
                else
                  mv[length] += 1;
              }
            }
            length++;
            i--;
            break;
          }
        }
      }
    }
    return mv;
  }

  var faces = ['U', 'D', 'F', 'B', 'L', 'R'];

  function replaceMoves(s, a, b, t) {
    for (var i=0; i < 6; i++) {
      var f = (t==0) ? faces[i] : faces[i].toLowerCase();
      var r = new RegExp(a + f, "g");
      s = s.replace(r, faces[i] + b);
    }
    return s;
  }

  function wca_to_sign(s) {
    for (var i=0; i < 6; i++) {
      var r = new RegExp(faces[i] + 'w', "g");
      s = s.replace(r, faces[i].toLowerCase());
    }
    return s;
  }

  function moveTextFunc(move, start, end) {
    if (start >= move.length)
      return "";
    var s = "";
    for (var i = start; i < end; i++) {
      var t = turnTextFunc(move, i);
      if (t != '')
        s += t + (moveTextSpace ? ' ' : '');
    }
    return s;
  }
  var turnSymbol = [
    [ // SiGN
      ["U", "D", "F", "B", "L", "R"],
      ["2U", "2D", "2F", "2B", "2L", "2R"],
      ["u", "d", "f", "b", "l", "r"],
      ["y", "~y", "z", "~z", "~x", "x"],
      ["Us", "Ds", "Fs", "Bs", "Ls", "Rs"],
      ["Ua", "Da", "Fa", "Ba", "La", "Ra"],
      ["3U", "3D", "3F", "3B", "3L", "3R"],
      ["4U", "4D", "4F", "4B", "4L", "4R"],
      ["5U", "5D", "5F", "5B", "5L", "5R"],
      ["6U", "6D", "6F", "6B", "6L", "6R"],
      ["7U", "7D", "7F", "7B", "7L", "7R"],
      ["8U", "8D", "8F", "8B", "8L", "8R"],
      ["9U", "9D", "9F", "9B", "9L", "9R"],
      ["10U", "10D", "10F", "10B", "10L", "10R"],
      ["3u", "3d", "3f", "3b", "3l", "3r"],
      ["4u", "4d", "4f", "4b", "4l", "4r"],
      ["5u", "5d", "5f", "5b", "5l", "5r"],
      ["6u", "6d", "6f", "6b", "6l", "6r"],
      ["7u", "7d", "7f", "7b", "7l", "7r"],
      ["8u", "8d", "8f", "8b", "8l", "8r"],
      ["9u", "9d", "9f", "9b", "9l", "9r"],
      ["10u", "10d", "10f", "10b", "10l", "10r"],
    ],
    [ // WCA 
      ["U", "D", "F", "B", "L", "R"],
      ["2U", "2D", "2F", "2B", "2L", "2R"],
      ["Uw", "Dw", "Fw", "Bw", "Lw", "Rw"],
      ["y", "~y", "z", "~z", "~x", "x"],
      ["Us", "Ds", "Fs", "Bs", "Ls", "Rs"],
      ["Ua", "Da", "Fa", "Ba", "La", "Ra"],
      ["3U", "3D", "3F", "3B", "3L", "3R"],
      ["4U", "4D", "4F", "4B", "4L", "4R"],
      ["5U", "5D", "5F", "5B", "5L", "5R"],
      ["6U", "6D", "6F", "6B", "6L", "6R"],
      ["7U", "7D", "7F", "7B", "7L", "7R"],
      ["8U", "8D", "8F", "8B", "8L", "8R"],
      ["9U", "9D", "9F", "9B", "9L", "9R"],
      ["10U", "10Dw", "10Fw", "10B", "10L", "10R"],
      ["3Uw", "3Dw", "3Fw", "3Bw", "3Lw", "3Rw"],
      ["4Uw", "4Dw", "4Fw", "4Bw", "4Lw", "4Rw"],
      ["5Uw", "5Dw", "5Fw", "5Bw", "5Lw", "5Rw"],
      ["6Uw", "6Dw", "6Fw", "6Bw", "6Lw", "6Rw"],
      ["7Uw", "7Dw", "7Fw", "7Bw", "7Lw", "7Rw"],
      ["8Uw", "8Dw", "8Fw", "8Bw", "8Lw", "8Rw"],
      ["9Uw", "9Dw", "9Fw", "9Bw", "9Lw", "9Rw"],
      ["10Uw", "10Dw", "10Fw", "10Bw", "10Lw", "10Rw"]
    ]
  ];
  var modifierStrings = ["", "2", "'", "2'"];

  function turnTextFunc(move, pos) {
    if (pos >= move.length)
      return "";
    if (move[pos] >= 1000)
      return "";
    if (move[pos] == -1)
      return ".";
    var s = turnSymbol[moveText - 1][Math.floor(move[pos] / 4) % (modeChar.length + 1)][Math.floor(move[pos] / 4 / (modeChar.length + 1))];
    if (s.charAt(0) == '~')
      return s.substring(1) + modifierStrings[(move[pos] + 2) % 4];
    return s + modifierStrings[move[pos] % 4];
  }

  var metricChar = ["", "q", "h", "s"];

  function realMoveLength(move) {
    var length = 0;
    for (var i = 0; i < move.length; i++)
      if (move[i] < 1000)
        length++;
    return length;
  }

  function realMovePos(move, pos) {
    var rpos = 0;
    for (var i = 0; i < pos; i++)
      if (move[i] < 1000)
        rpos++;
    return rpos;
  }

  function arrayMovePos(move, realPos) {
    var pos = 0;
    var rpos = 0;
    while (true) {
      while (pos < move.length && move[pos] >= 1000)
        pos++;
      if (rpos == realPos)
        break;
      if (pos < move.length) {
        rpos++;
        pos++;
      }
    }
    return pos;
  }

  function moveLength(move, end) {
    var length = 0;
    for (var i = 0; i < move.length && (i < end || end < 0); i++)
      length += turnLength(move[i]);
    return length;
  }

  function turnLength(turn) {
    if (turn < 0 || turn >= 1000)
      return 0;
    var modifier = turn % 4;
    var mode = Math.floor(turn / 4) % (modeChar.length + 1);
    var n = 1;
    switch (metric) {
      case 1: // quarter-turn metric
        if (modifier == 1 || modifier == 3)
          n *= 2;
      case 2: // face-turn metric
        if (mode == 1 || (mode >= 4 && mode <= maxSliceMode) ||
           (D == 2 && mode == 5) || (D == 4 && mode == 6))
          n *= 2;
      case 3: // slice-turn metric
        if (mode == 3)
          n = 0;
        if (metric == 3 && (mode == 4 || mode == 5))
          n *= 2;
    }
    return n;
  }

  function initInfoText(move) {
    if (move.length > 0 && move[0] >= 1000)
      curInfoText = move[0] - 1000;
    else
      curInfoText = -1;
  }

  function doMove(cube, move, start, length, reversed) {
    var position = reversed ? start + length : start;
    while (true) {
      if (reversed) {
        if (position <= start)
          break;
        position--;
      }
      if (move[position] >= 1000) {
        curInfoText = reversed ? -1 : move[position] - 1000;
      }
      else if (move[position] >= 0) {
        var modifier = move[position] % 4 + 1;
        var mode = Math.floor(move[position] / 4) % (modeChar.length + 1);
        if (modifier == 4) // reversed double turn
          modifier = 2;
        if (reversed)
          modifier = 4 - modifier;
        twistLayers(cube, Math.floor(move[position] / 4 / (modeChar.length + 1)), modifier, mode);
      }
      if (!reversed) {
        position++;
        if (position >= start + length)
          break;
      }
    }
  }

  var jobNumber = 0;
  var nowServing = 0;

  function startAnimation(mode) {
    stopAnimation();
    if (!demo && (move.length == 0 || move[curMove].length == 0))
      return;
    if (demo && (demoMove.length == 0 || demoMove[0].length == 0))
      return;
    moveDir = 1;
    moveOne = false;
    moveAnimated = true;
    switch (mode) {
      case 0: // play forward
        break;
      case 1: // play backward
        moveDir = -1;
        break;
      case 2: // step forward
        moveOne = true;
        break;
      case 3: // step backward
        moveDir = -1;
        moveOne = true;
        break;
      case 4: // fast forward
        moveAnimated = false; // moved to run()
        break;
    }
    run(jobNumber++, moveDir);
  }

  function stopAnimation() {
    if (animating == true)
      restarted = true;
  }

  function clear() {
    movePos = 0;
    natural = true;
    mirrored = false;
    for (var i = 0; i < 6; i++)
      for (var j = 0; j < D2; j++) {
        cube[i][j] = initialCube[i][j];
        scube[i][j] = initialSCube[i][j];
      }
    if (initialMove.length > 0 && typeof initialMove[curMove] != 'undefined')
      doMove(cube, initialMove[curMove], 0, initialMove[curMove].length, false);
    if (initialReversedMove.length > 0 && typeof initialReversedMove[curMove] != 'undefined')
      doMove(cube, initialReversedMove[curMove], 0, initialReversedMove[curMove].length, true);
    if (move.length > 0)
      initInfoText(move[curMove]);
    if (scramble > 0)
      move = getMove(randMoves(D, randMoveCount), false);
    if (scramble == 2)
      doMove(cube, move[0], 0, move[0].length, true);
    for (var i = 0; i < 3; i++) {
      eye[i] = initialEye[i];
      eyeX[i] = initialEyeX[i];
      eyeY[i] = initialEyeY[i];
    }
    setTimeout(paint, 0);
  }

  function splitCube(layer) {
    for (var i = 0; i < 6; i++) { // for all faces
      topBlocks[i] = topBlockTable[topBlockFaceDim[layer][i]];
      botBlocks[i] = topBlockTable[botBlockFaceDim[layer][i]];
      for (var j = 0; j < D - 2; j++)
        midBlocks[j][i] = midBlockTable[midBlockFaceDim[j][layer][i]];
    }
    natural = false;
  }

  function twistLayers(cube, layer, num, mode) {
    switch (mode) {
      case 2: // mode t
        twistLayer(cube, layer, 4 - num, 0);
        twistLayer(cube, layer, 4 - num, 1);
        break;
      case 3: // mode c
        for (var i=0; i < D/2; i++) {
          var m = (i > 1) ? i+4 : i;
          twistLayer(cube, layer, 4 - num, m);
          if (i < Math.floor(D/2))
            twistLayer(cube, layer ^ 1, num, m);
        }
        break;
      case 4: // mode s
        twistLayer(cube, layer, 4 - num, 0);
        twistLayer(cube, layer ^ 1, num, 0);
        break;
      case 5: // mode a
        twistLayer(cube, layer ^ 1, 4 - num, 0);
        twistLayer(cube, layer, 4 - num, 0);
        break;
      case 6: // mode w (4x4 only)
        if (D == 4) {
          twistLayer(cube, layer, 4 - num, 1);
          twistLayer(cube, layer ^ 1, num, 1);
        }
        else
          twistLayer(cube, layer, 4 - num, mode);
        break;
      case 21:
        twistLayer(cube, layer, 4 - num, 13);
      case 20:
        twistLayer(cube, layer, 4 - num, 12);
      case 19:
        twistLayer(cube, layer, 4 - num, 11);
      case 18:
        twistLayer(cube, layer, 4 - num, 10);
      case 17:
        twistLayer(cube, layer, 4 - num, 9);
      case 16:
        twistLayer(cube, layer, 4 - num, 8);
      case 15:
        twistLayer(cube, layer, 4 - num, 7);
      case 14:
        twistLayer(cube, layer, 4 - num, 6);
        twistLayer(cube, layer, 4 - num, 1);
        twistLayer(cube, layer, 4 - num, 0);
        break;
      default:
        twistLayer(cube, layer, 4 - num, mode);
    }
  }
  // indices for faces of layers
  var cycleLayerSides = [
    [3, 3, 3, 0], // U
    [2, 1, 1, 1], // D
    [3, 3, 0, 0], // F
    [2, 1, 1, 2], // B
    [3, 2, 0, 0], // L
    [2, 2, 0, 1]  // R
  ];
  // indices for sides of center layers
  var cycleCenters = [
    [7, 7, 7, 4], // E'(U)
    [6, 5, 5, 5], // E (D)
    [7, 7, 4, 4], // S (F)
    [6, 5, 5, 6], // S'(B)
    [7, 6, 4, 4], // M (L)
    [6, 6, 4, 5]  // M'(R)
  ];
  var twistBuffer = [];

  function twistLayer(cube, layer, num, mode) {
    twistLayer2(cube, layer, num, mode);
    if (superCube == true && num > 0 && num < 4) {
      twistLayer2(scube, layer, num, mode);
      twistSuperLayer(layer, num, mode);
    }
  }

  function twistLayer2(cube, layer, num, mode) {
    if (!mode) {
      // rotate top facelets
      for (var i=0; i < cycleOrder.length; i++) {
        var n = cycleOrder[i].length;
        for (var j = 0; j < n; j++)
          twistBuffer[(j + num * n/4) % n] = cube[layer][cycleOrder[i][j]];
        for (var j = 0; j < n; j++)
          cube[layer][cycleOrder[i][j]] = twistBuffer[j];
      }
    }
    // rotate side facelets
    var k = num * D;
    var m = (mode > 1) ? (mode - 5) * 4 : 0;
    for (var i = 0; i < 4; i++) { // to buffer
      var n = adjacentFaces[layer][i];
      var c = mode ? cycleCenters[layer][i] : cycleLayerSides[layer][i];
      var factor = cycleFactors[c];
      var offset = cycleOffsets[c + m];
      for (var j = 0; j < D; j++, k++)
        twistBuffer[k % (D*4)] = cube[n][j * factor + offset];
    }
    for (var i = 0, k = 0; i < 4; i++) { // to cube
      var n = adjacentFaces[layer][i];
      var c = mode ? cycleCenters[layer][i] : cycleLayerSides[layer][i];
      var factor = cycleFactors[c];
      var offset = cycleOffsets[c + m];
      for (var j = 0; j < D; j++, k++)
        cube[n][j * factor + offset] = twistBuffer[k];
    }
  }

  var superTwistArr = [];

  function initSuperTwist() {
    var n = D;
    var a = n*n-n;
    var b = n-1;
    /* each init element [a, b, c] is used to access a row or
       column of 6 facelets in the cube layout (shown above) where:
       a = starting facelet number
       b = increment
       c = layer (0=U, 1=D, 2=F, 3=B, 4=L, 5=R) */
    var init = [
      [[0,1,0], [0,n,1], [0,n,4], [0,1,5]], // F
      [[a,1,0], [b,n,1], [b,n,4], [a,1,5]], // B
      [[a,1,3], [0,1,1], [0,1,2], [0,n,0]], // L
      [[0,1,3], [b,n,0], [a,1,2], [a,1,1]], // R
    ];
    // use the init data to populate superTwistArr for each slice
    var v = [[n,1,1,n], [-n,-1,-1,-n], [-n,n,n,1], [n,-1,-n,-n]];
    var h = Math.ceil(n/2);
    for (var i=0; i < 4; i++)
      for (var j=0; j < h; j++)
        superTwistArr[i*h+j] = init[i].map(j => j.slice());
    for (var i=0, ix=0; i < 4; i++, ix+=h)
      for (var j=0; j < 4; j++)
        for (var k=0; k < h-1; k++)
          superTwistArr[ix+k+1][j][0] = superTwistArr[ix+k][j][0] + v[i][j];
  }

  /* for F & B moves, rotate all arrows in the slice in the same direction
     as the slice is rotated
     for R & L moves, half-twist slice arrows on the back face and on the
     face where the slice arrows from the back face moved to
  */

  function twistSuperLayer(layer, num, mode) {
    if (mode == 0)
      for (var i = 0; i < D2; i++)
        scube[layer][i] = (scube[layer][i] + 4 - num) % 4;
    var m = (mode >= 6) ? mode-4 : mode;
    var n = Math.ceil(D/2);
    if (layer == 2) superTwist2(m, 4-num) 
    if (layer == 3) superTwist2(m+n, num) 
    if (layer == 4) superTwist(m+n*2, num);
    if (layer == 5) superTwist(m+n*3, num);
  }

  function superTwist(ix, num) {
    superTwist1(superTwistArr[ix][0]);
    superTwist1(superTwistArr[ix][num]);
  }

  function superTwist1(v) {
    for (var i = v[0], n = 0; n < D; i += v[1], n++)
      scube[v[2]][i] = (scube[v[2]][i] + 2) % 4;
  }

  function superTwist2(ix, tw) {
    for (var i = 0; i < 4; i++) {
      var v = superTwistArr[ix][i];
      for (var j = v[0], n = 0; n < D; j += v[1], n++)
        scube[v[2]][j] = (scube[v[2]][j] + tw) % 4;
    }
  }

  var width;
  var height;
  // last position of mouse (for dragging the cube)
  var lastX;
  var lastY;
  // last position of mouse (when waiting for clear decision)
  var lastDragX;
  var lastDragY;
  // drag areas
  var dragAreas;
  var dragCornersX = [];
  var dragCornersY = [];
  var dragDirsX = [];
  var dragDirsY = [];
  var dragLayers = []; // which layers belongs to dragCorners
  // current drag directions
  var dragX;
  var dragY;
  // various sign tables for computation of directions of rotations
  var rotCos = [
    [[ 1,  0,  0], [ 0,  0,  0], [ 0,  0,  1]], // U-D
    [[ 1,  0,  0], [ 0,  1,  0], [ 0,  0,  0]], // F-B
    [[ 0,  0,  0], [ 0,  1,  0], [ 0,  0,  1]]  // L-R
  ];
  var rotSin = [
    [[ 0,  0,  1], [ 0,  0,  0], [-1,  0,  0]], // U-D
    [[ 0,  1,  0], [-1,  0,  0], [ 0,  0,  0]], // F-B
    [[ 0,  0,  0], [ 0,  0,  1], [ 0, -1,  0]]  // L-R
  ];
  var rotVec = [
    [[ 0,  0,  0], [ 0,  1,  0], [ 0,  0,  0]], // U-D
    [[ 0,  0,  0], [ 0,  0,  0], [ 0,  0,  1]], // F-B
    [[ 1,  0,  0], [ 0,  0,  0], [ 0,  0,  0]]  // L-R
  ];
  var rotSign = [1, -1, 1, -1, 1, -1]; // U, D, F, B, L, R
  // temporary eye vectors for twisted sub-cube rotation
  var tempEye = [];
  var tempEyeX = [];
  var tempEyeY = [];
  // temporary eye vectors for second twisted sub-cube rotation (antislice)
  var tempEye2 = [];
  var tempEyeX2 = [];
  var tempEyeY2 = [];
  // temporary vectors to compute visibility in perspective projection
  var perspEye = [];
  var perspEyeI = []
  var perspNormal = [];
  // eye arrays to store various eyes for various modes
  var eyeArray = [];
  var eyeArrayX = [];
  var eyeArrayY = [];
  var eyeOrder = [
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // u82 
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // t
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // c
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // s
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // a
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // u83
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // u84
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // u85
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // u86
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // u87
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // u88
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // u89
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // u8A
    [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // u8B
    [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // u8C
    [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // u8D
    [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // u8E
    [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // u8F
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // u90
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // u91
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // u92
  ];
  var blockArray = [];
  var blockMode = [
    [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],  // 
    [2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],  // u82
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],  // t
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],  // c
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],  // s
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],  // a
    [2, 2, 6, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],  // u83
    [2, 2, 2, 7, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],  // u84
    [2, 2, 2, 2, 8, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],  // u85
    [2, 2, 2, 2, 2, 9, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],  // u86
    [2, 2, 2, 2, 2, 2, 10, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], // u87
    [2, 2, 2, 2, 2, 2, 2, 11, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], // u88
    [2, 2, 2, 2, 2, 2, 2, 2, 12, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], // u89
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 13, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], // u8A
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],  // u8B
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],  // u8C
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],  // u8D
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],  // u8E
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],  // u8F
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],  // u90
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],  // u91
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],  // u92
  ];
  var sliceNormals = [];

  function initSliceNormals() {
    var copyvec = [], fracvec = [];
    for (var i = 0; i < 6; i++) {
      sliceNormals[i] = [];
      for (var j = 0; j < D; j++) {
        sliceNormals[i][j] = [];
        vCopy(copyvec, faceNormals[i]);
        vScale(vCopy(fracvec, copyvec), 2 / D);
        vScale(vSub(copyvec, vScale(fracvec, j)), scale);
        vCopy(sliceNormals[i][j], copyvec);
      }
    }
  }

  function paint() {
    graphics.save();
    graphics.fillStyle = bgColor;
    var h = (buttonBar == 1 && (progressHeight == 0 || demo || move[curMove].length == 0)) ? height - dpr : height;
    setClip(graphics, 0, 0, width, h);
    graphics.fillRect(0, 0, width, h); // cube background
    dragAreas = 0;
    if (natural) // compact cube
    {
      if (hint)
        fixBlock(eye, eyeX, eyeY, cubeBlocks, 3, 0, 1); // draw hint faces
      fixBlock(eye, eyeX, eyeY, cubeBlocks, 3, 0, 0);   // draw cube and fill drag areas
    }
    else { // in twisted state
      // compute top observer
      var cosA = Math.cos(originalAngle + currentAngle);
      var sinA = Math.sin(originalAngle + currentAngle) * rotSign[twistedLayer];
      for (var i = 0; i < 3; i++) {
        tempEye[i] = 0;
        tempEyeX[i] = 0;
        for (var j = 0; j < 3; j++) {
          var axis = Math.floor(twistedLayer / 2);
          tempEye[i] += eye[j] * (rotVec[axis][i][j] + rotCos[axis][i][j] * cosA + rotSin[axis][i][j] * sinA);
          tempEyeX[i] += eyeX[j] * (rotVec[axis][i][j] + rotCos[axis][i][j] * cosA + rotSin[axis][i][j] * sinA);
        }
      }
      vMul(tempEyeY, tempEye, tempEyeX);
      // compute bottom anti-observer
      var cosB = Math.cos(originalAngle - currentAngle);
      var sinB = Math.sin(originalAngle - currentAngle) * rotSign[twistedLayer];
      for (var i = 0; i < 3; i++) {
        tempEye2[i] = 0;
        tempEyeX2[i] = 0;
        for (var j = 0; j < 3; j++) {
          var axis = Math.floor(twistedLayer / 2);
          tempEye2[i] += eye[j] * (rotVec[axis][i][j] + rotCos[axis][i][j] * cosB + rotSin[axis][i][j] * sinB);
          tempEyeX2[i] += eyeX[j] * (rotVec[axis][i][j] + rotCos[axis][i][j] * cosB + rotSin[axis][i][j] * sinB);
        }
      }
      vMul(tempEyeY2, tempEye2, tempEyeX2);
      eyeArray[0] = eye;
      eyeArrayX[0] = eyeX;
      eyeArrayY[0] = eyeY;
      eyeArray[1] = tempEye;
      eyeArrayX[1] = tempEyeX;
      eyeArrayY[1] = tempEyeY;
      eyeArray[2] = tempEye2;
      eyeArrayX[2] = tempEyeX2;
      eyeArrayY[2] = tempEyeY2;
      blockArray[0] = topBlocks;
      blockArray[D-1] = botBlocks;
      for (var i=0; i < D-2; i++)
        blockArray[i+1] = midBlocks[i];
      // see AnimCube7.js for documentation of orderMode 
      var orderMode, Prod, memProd, copyvec = [];
      vScale(vCopy(copyvec, eye), 5.0 + persp);
      for (var i = 0; i < D; i++) {
        vSub(vCopy(perspEye, copyvec), sliceNormals[twistedLayer][i]);
        Prod = vProd(perspEye, faceNormals[twistedLayer]);
        if (i == 0)
          orderMode = (Prod < 0) ? 0 : D - 1;
        else {
          if ((Prod > 0 && memProd < 0) || (Prod < 0 && memProd > 0)) {
            orderMode = D - i;
            break;
          }
        }
        memProd = Prod;
      }
      if (hint) {
        for (var i=0; i < D; i++) {
          var j = drawOrder[orderMode][i];
          var k = eyeOrder[twistedMode][j];
          fixBlock(eyeArray[k], eyeArrayX[k], eyeArrayY[k], blockArray[j],
            blockMode[twistedMode][j], j, 1);
        }
      }
      for (var i=0; i < D; i++) {
        var j = drawOrder[orderMode][i];
        var k = eyeOrder[twistedMode][j];
        fixBlock(eyeArray[k], eyeArrayX[k], eyeArrayY[k], blockArray[j],
          blockMode[twistedMode][j], j, 0);
      }
    }
    if (!pushed && !animating) // no button should be deceased
      buttonPressed = -1;
    if (!(scramble > 0 && buttonBar == 2)) {
      // draw progress bar, move text and button (if more than one sequence)
      if (!demo && move.length > 0) {
        if (move[curMove].length > 0) { // some turns

          // draw progress bar
          if (progressHeight > 0) {
            graphics.lineWidth = lineWidth;
            graphics.strokeStyle = buttonBorderColor;

            var progress = (width - 2) * realMovePos(move[curMove], movePos) / realMoveLength(move[curMove]);

            // trough
            graphics.fillStyle = sliderBgColor;
            graphics.fillRect(dph, height - progressHeight - dph, width - dpr, progressHeight);

            // slider
            graphics.fillStyle = sliderColor;
            graphics.fillRect(dph, height - progressHeight - dph, progress, progressHeight);

            // border
            graphics.beginPath();
            graphics.rect(dph, height - progressHeight - dph, width - dpr, progressHeight);
            graphics.stroke();
          }

          // display move text
          graphics.font = "bold " + textHeight + "px helvetica";
          var s = "" + moveLength(move[curMove], movePos) + "/" + moveLength(move[curMove], -1) + metricChar[metric];
          var w = graphics.measureText(s).width;
          var x = width - w - 2;
          var y = height - progressHeight - Math.floor(4 * dpr);
          if (moveText > 0) {
            if (moveCounter)
              drawString(graphics, s, (outlined ? x - dpr : x), y - textHeight);
            drawMoveTextFunc(graphics, y);
          }
          else if (moveCounter)
            drawString(graphics, s, (outlined ? x - dpr : x), y);
        }
        if (move.length > 1) { // more sequences
          graphics.font = "bold " + textHeight + "px helvetica";
          var s = "" + (curMove + 1) + "/" + move.length;
          var w = graphics.measureText(s).width;
          var x = width - w - buttonHeight*2 - Math.floor(5 * dpr);
          drawString(graphics, s, x, adjTextHeight());
          drawButton(graphics, 7, width - buttonHeight*2, 0);
          drawButton(graphics, 8, width - buttonHeight, 0);
        }
      }
      if (curInfoText >= 0) {
        graphics.font = "bold " + textHeight + "px helvetica";
        drawString(graphics, infoText[curInfoText], outlined ? dpr : 0, adjTextHeight());
      }
    }
    graphics.restore();
    if (drawButtons && buttonBar != 0) // omit unneccessary redrawing
      drawButtonsFunc(graphics);
  } // paint()

  function adjTextHeight() {
    // size 14 font has enough padding for the top margin, smaller fonts
    // need space added so y value (as input to drawString) is increased
    if (utextHeight < 10)
      return (Math.floor(10 * dpr));
    else if (utextHeight < 12)
      return (Math.floor(12 * dpr));
    else if (utextHeight < 14)
      return (Math.floor(14 * dpr));
    else
      return textHeight;
  }

  // polygon co-ordinates to fill (cube faces or facelets)
  var fillX = [];
  var fillY = [];
  // projected vertex co-ordinates (to screen)
  var coordsX = [];
  var coordsY = [];
  var cooX = [[], [], [], [], [], []];
  var cooY = [[], [], [], [], [], []];
  var border = [[0.10, 0.10], [0.90, 0.10], [0.90, 0.90], [0.10, 0.90]];
  var factors = [[0, 0], [0, 1], [1, 1], [1, 0]];
  var tempNormal = [];

  function fixBlock(eye, eyeX, eyeY, blocks, mode, drawLayer, drawHint) {
    // project 3D co-ordinates into 2D screen ones
    for (var i = 0; i < 8; i++) {
      var min = width < height ? width : height - progressHeight;
      var x = min / 3.7 * vProd(cornerCoords[i], eyeX) * scale;
      var y = min / 3.7 * vProd(cornerCoords[i], eyeY) * scale;
      var z = min / (5.0 + persp) * vProd(cornerCoords[i], eye) * scale;
      x = x / (1 - z / min); // perspective transformation
      y = y / (1 - z / min); // perspective transformation
      coordsX[i] = width / 2.0 + x;
      if (align == 0)
        coordsY[i] = (height - progressHeight) / 2.0 * scale - y;
      else if (align == 1)
        coordsY[i] = (height - progressHeight) / 2.0 - y;
      else if (align == 2)
        coordsY[i] = height - progressHeight - (height - progressHeight) / 2.0 * scale - y;
      else {
        // either equation works for 3-99
        coordsY[i] = (height - progressHeight) * (align * (1 - scale) + scale / 2) - y;
        // coordsY[i] = (height - progressHeight) * (align - scale * (align - 1 / 2)) - y;
      }
    }
    // setup corner co-ordinates for all faces
    for (var i = 0; i < 6; i++) { // all faces
      for (var j = 0; j < 4; j++) { // all face corners
        cooX[i][j] = coordsX[faceCorners[i][j]];
        cooY[i][j] = coordsY[faceCorners[i][j]];
      }
    }
    if (hint && drawHint) { // draw hint hidden facelets
      for (var i = 0; i < 6; i++) { // all faces
        vSub(vScale(vCopy(perspEye, eye), 5.0 + persp), faceNormals[i]); // perspective correction
        if (vProd(perspEye, faceNormals[i]) < -(1-scale)) { // draw only hidden faces
          vScale(vCopy(tempNormal, faceNormals[i]), faceShift);
          var min = width < height ? width : height - progressHeight;
          var x = min / hintHoriz * vProd(tempNormal, eyeX);
          var y = min / hintVert * vProd(tempNormal, eyeY);
          var z = min / (5.0 + persp) * vProd(tempNormal, eye);
          x = x / (1 - z / min); // perspective transformation
          y = y / (1 - z / min); // perspective transformation
          var sideW = blocks[i][0][1] - blocks[i][0][0];
          var sideH = blocks[i][1][1] - blocks[i][1][0];
          if (sideW > 0 && sideH > 0) { // this side is not only black
            // draw colored facelets
            for (var n = 0, p = blocks[i][1][0]; n < sideH; n++, p++) {
              for (var o = 0, q = blocks[i][0][0]; o < sideW; o++, q++) {
                for (var j = 0; j < 4; j++) {
                  getCorners(i, j, fillX, fillY, q + border[j][0], p + border[j][1], mirrored);
                  fillX[j] = Math.floor(fillX[j] + (mirrored ? -x : x));
                  fillY[j] = Math.floor(fillY[j] - y);
                }
                if (superCube == true) {
                  /*
                  fillPolygon(graphics, fillX, fillY, "#fdfdfd");
                  if (hintBorder)
                    drawPolygon(graphics, fillX, fillY, darker("#fdfdfd"));
                  else
                    drawPolygon(graphics, fillX, fillY, "#fdfdfd");
                  */
                  drawSuperArrow(graphics, fillX, fillY, i, scube[i][p * D + q], colors[cube[i][p * D + q]]);
                }
                else {
                  fillPolygon(graphics, fillX, fillY, colors[cube[i][p * D + q]]);
                  if (hintBorder)
                    drawPolygon(graphics, fillX, fillY, darker(colors[cube[i][p * D + q]]));
                  else
                    drawPolygon(graphics, fillX, fillY, colors[cube[i][p * D + q]]);
                }
              }
            }
          }
        }
      }
      return;
    }
    // find and draw black inner faces
    for (var i = 0; i < 6; i++) { // all faces
      var sideW = blocks[i][0][1] - blocks[i][0][0];
      var sideH = blocks[i][1][1] - blocks[i][1][0];
      if (sideW <= 0 || sideH <= 0) { // this face is inner and only black
        var v = innerFacePosition(i, drawLayer);
        if (v != 0) {
          for (var j = 0; j < 4; j++) { // for all corners
            var k = oppositeCorners[i][j];
            fillX[j] = Math.floor(cooX[i][j] + (cooX[i ^ 1][k] - cooX[i][j]) * v);
            fillY[j] = Math.floor(cooY[i][j] + (cooY[i ^ 1][k] - cooY[i][j]) * v);
            if (mirrored)
              fillX[j] = width - fillX[j];
          }
          fillPolygon(graphics, fillX, fillY, cubeColor);
        }
      }
      else {
        // draw black face background (do not care about normals and visibility!)
        if (borderWidth > 0) {
          for (var j = 0; j < 4; j++) // corner co-ordinates 
            getCorners(i, j, fillX, fillY, blocks[i][0][factors[j][0]], blocks[i][1][factors[j][1]], mirrored);
          fillPolygon(graphics, fillX, fillY, cubeColor);
        }
      }
    }
    // draw all visible faces and get dragging regions
    for (var i = 0; i < 6; i++) { // all faces
      vSub(vScale(vCopy(perspEye, eye), 5.0 + persp), faceNormals[i]); // perspective correction
      if (vProd(perspEye, faceNormals[i]) > -(1-scale)) { // draw only faces towards us
        var sideW = blocks[i][0][1] - blocks[i][0][0];
        var sideH = blocks[i][1][1] - blocks[i][1][0];
        if (sideW > 0 && sideH > 0) { // this side is not only black
          // draw colored facelets
          for (var n = 0, p = blocks[i][1][0]; n < sideH; n++, p++) {
            for (var o = 0, q = blocks[i][0][0]; o < sideW; o++, q++) {
              for (var j = 0; j < 4; j++)
                getCorners(i, j, fillX, fillY, q + border[j][0], p + border[j][1], mirrored);
              if (superCube == true) {
                drawPolygon(graphics, fillX, fillY, "#fdfdfd");
                fillPolygon(graphics, fillX, fillY, "#fdfdfd");
                drawSuperArrow(graphics, fillX, fillY, i, scube[i][p * D + q], colors[cube[i][p * D + q]]);
              }
              else {
                drawPolygon(graphics, fillX, fillY, colors[cube[i][p * D + q]]);
                fillPolygon(graphics, fillX, fillY, colors[cube[i][p * D + q]]);
              }
            }
          }
        }
        if (!editable || animating) // no need of twisting while animating
          continue;
        // horizontal and vertical directions of face - interpolated
        var dxh = (cooX[i][1] - cooX[i][0] + cooX[i][2] - cooX[i][3]) / 6.0;
        var dyh = (cooX[i][3] - cooX[i][0] + cooX[i][2] - cooX[i][1]) / 6.0;
        var dxv = (cooY[i][1] - cooY[i][0] + cooY[i][2] - cooY[i][3]) / 6.0;
        var dyv = (cooY[i][3] - cooY[i][0] + cooY[i][2] - cooY[i][1]) / 6.0;
        var maxAreas = D * 2;
        if (mode == 3) { // just the normal cube
          for (var j = 0; j < maxAreas; j++) {
            for (var k = 0; k < 4; k++) // 4 points per area
              getCorners(i, k, dragCornersX[dragAreas], dragCornersY[dragAreas],
                dragBlocks[j][k][0], dragBlocks[j][k][1], false);
            var middleLayer = (D%2 && j >= maxAreas - 2) ? 1 : 0;
            var jm2 = (middleLayer) ? (j%2)+2 : j%2;
            var jm4 = j%4;
            dragDirsX[dragAreas] = (dxh * areaDirs[jm4][0] + dxv * areaDirs[jm4][1]) * twistDirs[i][jm2];
            dragDirsY[dragAreas] = (dyh * areaDirs[jm4][0] + dyv * areaDirs[jm4][1]) * twistDirs[i][jm2];
            dragLayers[dragAreas] = adjacentFaces[i][jm4];
            if (middleLayer)
              dragLayers[dragAreas] &= ~1;
            dragAreas++;
            if (dragAreas == D*6) {
              break;
            }
          }
          // twisting any layer sets dragModes[0-1] to the mode of that layer
          // so reset them here
          dragModes[0] = 0;
          dragModes[1] = 0;
        }
        else if (mode <= 1 || (mode >= 6 && mode <= maxSliceMode)) {  // layer is twisted
          var m = (mode > 1) ? mode - 4 : mode;
          if (i != twistedLayer && sideW > 0 && sideH > 0) {
            var j = sideW == D ? 
              (blocks[i][1][0] == m ? 0 : 2) : (blocks[i][0][0] == m ? 3 : 1);
            j += m * 4;
            if (D%2 && j >= maxAreas)
              j = maxAreas - 1;
            for (var k = 0; k < 4; k++)
              getCorners(i, k, dragCornersX[dragAreas], dragCornersY[dragAreas],
                dragBlocks[j][k][0], dragBlocks[j][k][1], false);
            var middleLayer = (D%2 && j >= maxAreas - 2) ? 1 : 0;
            var jm2 = (middleLayer) ? (j%2)+2 : j%2;
            var jm4 = j%4;
            dragDirsX[dragAreas] = (dxh * areaDirs[jm4][0] + dxv * areaDirs[jm4][1]) * twistDirs[i][jm2];
            dragDirsY[dragAreas] = (dyh * areaDirs[jm4][0] + dyv * areaDirs[jm4][1]) * twistDirs[i][jm2];
            dragLayers[dragAreas] = twistedLayer;
            dragModes[dragAreas] = mode;
            dragAreas++;
          }
        }
      }
    }
  } // fixblock

  function innerFacePosition(i, dl) {
    var tm = twistedMode;
    // slice moves
    if (tm < 2 || tm > 5 && tm <= maxSliceMode) {
      var m = (tm < 2) ? tm : tm - 4;
      return ((i%2 == twistedLayer%2) ?
        ((dl == m || dl == m+1) ? dl : 0) :
        ((dl == m || dl == m-1) ? D-1-dl : 0)) / D;
    }
    // wide moves
    else if (tm == 2 || tm > maxSliceMode) {
      var m = (tm > 2) ? tm-7: tm-1;
      return ((i == twistedLayer) ?
        ((dl == m+1) ? dl : 0) :
        ((dl == m) ? D-1-dl : 0)) / D;
    }
    // s & a moves
    else if (tm == 4 || tm == 5) {
      return ((i%2 == twistedLayer%2) ? 
        ((dl == 1 || dl == D-1) ? dl : 0) :
        ((dl == 0 || dl == D-2) ? D-1-dl : 0)) / D;
    }
    else
      return ((i == twistedLayer) ? dl : D-1 - dl) / D;
  }

  function getCorners(face, corner, cornersX, cornersY, factor1, factor2, mirror) {
    factor1 /= D;
    factor2 /= D;
    var x1 = cooX[face][0] + (cooX[face][1] - cooX[face][0]) * factor1;
    var y1 = cooY[face][0] + (cooY[face][1] - cooY[face][0]) * factor1;
    var x2 = cooX[face][3] + (cooX[face][2] - cooX[face][3]) * factor1;
    var y2 = cooY[face][3] + (cooY[face][2] - cooY[face][3]) * factor1;
    cornersX[corner] = Math.floor(0.5 + x1 + (x2 - x1) * factor2);
    cornersY[corner] = Math.floor(0.5 + y1 + (y2 - y1) * factor2);
    if (mirror)
      cornersX[corner] = width - cornersX[corner];
  }
  var textOffsetInit = [1, 1, -1, -1, -1, 1, 1, -1, -1, 0, 1, 0, 0, 1, 0, -1];
  var textOffset = [];

  function drawString(g, s, x, y) {
    if (outlined) {
      g.fillStyle = "black";
      for (var i = 0; i < textOffset.length; i += 2)
        g.fillText(s, x + textOffset[i], y + textOffset[i + 1]);
      g.fillStyle = "white";
    }
    else
      g.fillStyle = textColor;
    g.fillText(s, x, y);
  }

  function drawMoveTextFunc(g, y) {
    var pos = movePos == 0 ? arrayMovePos(move[curMove], movePos) : movePos;
    var s1 = moveTextFunc(move[curMove], 0, pos);
    var s2 = turnTextFunc(move[curMove], pos);
    var s3 = moveTextFunc(move[curMove], pos + 1, move[curMove].length);
    if (moveTextSpace) {
      if (s2 == '')
        s1 = s1.substr(0, s1.length - 1);
      if (s3 != '')
        s3 = ' ' + s3.substr(0, s3.length - 1);
    }
    var w1 = g.measureText(s1).width;
    var w2 = g.measureText(s2).width;
    var w3 = g.measureText(s3).width;
    var x = 1;
    if (x + w1 + w2 + w3 > width) {
      x = Math.min(1, width / 2 - w1 - w2 / 2);
      x = Math.max(x, width - w1 - w2 - w3 - 2);
    }
    if (w2 > 0) {
      g.fillStyle = hlColor;
      g.lineWidth = 2;
      g.strokeStyle = "black";
      g.beginPath();
      if (utextHeight <= 14)
        // make rectangle taller for smaller fonts
        g.fillRect(x + w1 - 1, height - progressHeight - textHeight - Math.floor(dpr * 4), w2 + 2, textHeight + Math.floor(dpr * 3));
      else
        g.fillRect(x + w1 - 1, height - progressHeight - textHeight - Math.floor(dpr * 2), w2 + 2, textHeight + Math.floor(dpr));
    }
    if (w1 > 0)
      drawString(g, s1, x, y);
    if (w2 > 0)
      drawString(g, s2, x + w1, y);
    if (w3 > 0)
      drawString(g, s3, x + w1 + w2, y);
  }

  function selectButton(x, y) {
    if (buttonBar == 0)
      return -1;
    if (move.length > 1 && x >= width - buttonHeight*2 && x < width-buttonHeight && y >= 0 && y < buttonHeight)
      return 7;
    if (move.length > 1 && x >= width - buttonHeight && x < width && y >= 0 && y < buttonHeight)
      return 8;
    if (buttonBar == 2) { // only clear (rewind) button present
      if (x >= 0 && x < buttonHeight && y >= height - buttonHeight && y < height)
        return 0;
      return -1;
    }
    if (y < height)
      return -1;
    var buttonX = 0;
    for (var i = 0; i < 7; i++) {
      var buttonWidth = (width - buttonX) / (7 - i);
      if (x >= buttonX && x < buttonX + buttonWidth && y >= height && y < height + buttonHeight)
        return i;
      buttonX += buttonWidth;
    }
    return -1;
  }

  var buttonAction = [-1, 3, 1, -1, 0, 2, 4, -1];

  // Various useful vector functions

  function vCopy(vector, srcVec) {
    vector[0] = srcVec[0];
    vector[1] = srcVec[1];
    vector[2] = srcVec[2];
    return vector;
  }

  function vNorm(vector) {
    var length = Math.sqrt(vProd(vector, vector));
    vector[0] /= length;
    vector[1] /= length;
    vector[2] /= length;
    return vector;
  }

  function vScale(vector, value) {
    vector[0] *= value;
    vector[1] *= value;
    vector[2] *= value;
    return vector;
  }

  function vProd(vec1, vec2) {
    return vec1[0] * vec2[0] + vec1[1] * vec2[1] + vec1[2] * vec2[2];
  }

  function vAdd(vector, srcVec) {
    vector[0] += srcVec[0];
    vector[1] += srcVec[1];
    vector[2] += srcVec[2];
    return vector;
  }

  function vSub(vector, srcVec) {
    vector[0] -= srcVec[0];
    vector[1] -= srcVec[1];
    vector[2] -= srcVec[2];
    return vector;
  }

  function vMul(vector, vec1, vec2) {
    vector[0] = vec1[1] * vec2[2] - vec1[2] * vec2[1];
    vector[1] = vec1[2] * vec2[0] - vec1[0] * vec2[2];
    vector[2] = vec1[0] * vec2[1] - vec1[1] * vec2[0];
    return vector;
  }

  function vRotX(vector, angle) {
    var sinA = Math.sin(angle);
    var cosA = Math.cos(angle);
    var y = vector[1] * cosA - vector[2] * sinA;
    var z = vector[1] * sinA + vector[2] * cosA;
    vector[1] = y;
    vector[2] = z;
    return vector;
  }

  function vRotY(vector, angle) {
    var sinA = Math.sin(angle);
    var cosA = Math.cos(angle);
    var x = vector[0] * cosA - vector[2] * sinA;
    var z = vector[0] * sinA + vector[2] * cosA;
    vector[0] = x;
    vector[2] = z;
    return vector;
  }

  function vRotZ(vector, angle) {
    var sinA = Math.sin(angle);
    var cosA = Math.cos(angle);
    var x = vector[0] * cosA - vector[1] * sinA;
    var y = vector[0] * sinA + vector[1] * cosA;
    vector[0] = x;
    vector[1] = y;
    return vector;
  }

  function rgbToHex(r, g, b) {
    return "#" +
      lpad(r.toString(16)) +
      lpad(g.toString(16)) +
      lpad(b.toString(16));
  }

  function lpad(s) {
    return (("00" + s).substring(s.length));
  }

  function validateColor(s) {
    if (s.length != 6)
      return false;
    var n = 0;
    for (var i = 0; i < 6; i++) {
      for (var j = 0; j < 16; j++) {
        if (s.charAt(i).toLowerCase() == "0123456789abcdef".charAt(j)) {
          n++;
          break;
        }
      }
    }
    return (n == 6) ? true : false;
  }

  function setClip(g, x, y, width, height) {
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + width, y);
    g.lineTo(x + width, y + height);
    g.lineTo(x, y + height);
    g.lineTo(x, y);
    g.closePath();
    g.clip();
  }

  function drawButtonsFunc(g) {
    var adj = ((buttonHeight % 2) == 0) ? 1 : 0;
    adj += Math.floor(dpr + .5) - 1;
    if (buttonBar == 2) { // only clear (rewind) button
      if (buttonPressed == 0 || (scramble > 0 && buttonPressed == 6))
        g.fillStyle = darker(buttonBgColor);
      else
        g.fillStyle = buttonBgColor;
      g.fillRect(dph, height - buttonHeight, buttonHeight, buttonHeight);
      g.lineWidth = lineWidth;
      g.strokeStyle = buttonBorderColor;
      g.beginPath();
      g.rect(dph, height - buttonHeight - dph, buttonHeight, buttonHeight);
      g.stroke();
      drawButton(g, 0, (buttonHeight / 2), height - (buttonHeight + 1) / 2 - adj);
      return;
    }
    if (buttonBar == 1) { // full buttonbar
      var buttonX = 0;
      for (var i = 0; i < 7; i++) {
        var buttonWidth = Math.floor((width - buttonX) / (7 - i));
        if (buttonPressed == i)
          g.fillStyle = darker(buttonBgColor);
        else
          g.fillStyle = buttonBgColor;
        g.fillRect(buttonX, height, buttonWidth, buttonHeight);
        g.lineWidth = lineWidth;
        g.strokeStyle = buttonBorderColor;
        g.beginPath();
        if (i == 0)
          g.rect(buttonX + dph, height - dph, buttonWidth - dpr, buttonHeight);
        else
          g.rect(buttonX - dph, height - dph, buttonWidth, buttonHeight);
        g.stroke();
        g.strokeStyle = "black";
        drawButton(g, i, buttonX + buttonWidth / 2, height + buttonHeight / 2 - adj);
        buttonX += buttonWidth;
      }
      drawButtons = false;
      return;
    }
  }

  var ds = []; // digits 1-9 scaled by dpr

  function drawButton(g, i, x, y) {
    x = Math.floor(x);
    y = Math.floor(y);
    switch (i) {
      case 0: // rewind
        drawRect(g, x - ds[4], y - ds[3], ds[3], ds[6] + 1);
        drawArrow(g, x + ds[4], y, -1); // left
        break;
      case 1: // reverse step
        drawRect(g, x + ds[1], y - ds[3], ds[3], ds[6] + 1);
        drawArrow(g, x - ds[1], y, -1); // left
        break;
      case 2: // reverse play
        drawArrow(g, x + ds[1], y, -1); // left
        break;
      case 3: // stop / mirror
        if (animating)
          drawRect(g, x - ds[4], y - ds[3], ds[7], ds[7]);
        else {
          drawRect(g, x - ds[4], y - ds[2], ds[7], ds[5]);
          drawRect(g, x - ds[2], y - ds[4], ds[3], ds[9]);
        }
        break;
      case 4: // play
        drawArrow(g, x - ds[2], y, 1); // right
        break;
      case 5: // step
        drawRect(g, x - ds[4], y - ds[3], ds[3], ds[6] + 1);
        drawArrow(g, x, y, 1); // right
        break;
      case 6: // fast forward
        drawRect(g, x + ds[1], y - ds[3], ds[3], ds[6] + 1);
        drawArrow(g, x - ds[4], y, 1); // right
        break;
      case 7: // prev sequence
        var c = (buttonPressed == 7) ? darker(buttonBgColor) : buttonBgColor;
        drawRect2(g, x-dpr*2, y+dpr, buttonHeight, y + buttonHeight, c);
        drawArrow(g, x+dpr*2 + buttonHeight/2 - dpr*3, y + buttonHeight/2+dph, -1);
        break;
      case 8: // next sequence
        var c = (buttonPressed == 8) ? darker(buttonBgColor) : buttonBgColor;
        drawRect2(g, x-dpr*2, y+dpr, buttonHeight, y + buttonHeight, c);
        drawArrow(g, x-dpr + buttonHeight/2 - dpr*3, y + buttonHeight/2+dph, 1);
        break;
    }
  }

  function drawArrow(g, x, y, dir) {
    var d3 = 3 * dpr;
    var fillX = [];
    var fillY = [];
    fillX[0] = x;
    fillX[1] = x + dir;
    fillX[2] = x + 4 * dpr * dir;
    fillX[3] = x + dir;
    fillX[4] = x;
    fillY[0] = y - d3;
    fillY[1] = y - d3;
    fillY[2] = y;
    fillY[3] = y + d3;
    fillY[4] = y + d3;
    drawArrow2(g, fillX, fillY);
  }

  function drawArrow2(g, x, y) {
    g.beginPath();
    g.moveTo(x[0] + dph, y[0] + dph);
    for (var i = 1; i < 5; i++)
      g.lineTo(x[i] + dph, y[i] + dph);
    g.closePath();
    g.fillStyle = "white";
    g.strokeStyle = "black";
    g.fill();
    g.lineWidth = lineWidth;
    g.stroke();
  }

  function drawRect(g, x, y, width, height) {
    g.lineWidth = lineWidth;
    g.beginPath();
    g.rect(x + dph, y + dph, width - 1, height - 1);
    g.fillStyle = "white";
    g.fill();
    g.strokeStyle = "black";
    g.stroke();
  }

  function drawRect2(g, x, y, width, height, color) {
    g.lineWidth = lineWidth;
    g.beginPath();
    g.rect(x + dph, y + dph, width - 1, height - 1);
    g.fillStyle = color;
    g.fill();
    g.strokeStyle = "black";
    g.stroke();
  }

  function drawPolygon(g, x, y, color) {
    g.beginPath();
    g.moveTo(x[0], y[0]);
    g.lineTo(x[1], y[1]);
    g.lineTo(x[2], y[2]);
    g.lineTo(x[3], y[3]);
    g.closePath();
    g.strokeStyle = color;
    g.lineWidth = ((borderWidth > 0) ? 0.7 : 0.2) * dpr;
    g.stroke();
  }

  function fillPolygon(g, x, y, color) {
    g.beginPath();
    g.moveTo(x[0], y[0]);
    g.lineTo(x[1], y[1]);
    g.lineTo(x[2], y[2]);
    g.lineTo(x[3], y[3]);
    g.closePath();
    g.fillStyle = color;
    g.fill();
  }

  var superRotate = [[0, 1, 2, 3], [3, 0, 1, 2], [2, 3, 0, 1], [1, 2, 3, 0]];

  function drawSuperArrow(g, xx, yy, face, superTwist, color) {
    var x = [];
    var y = [];
    var w = .26; // arrow width
    if (scw == 2 && color == "#ffffff")
      return;
    // scale down so there is a margin around the arrow
    for (var i = 0; i < 4; i++) {
      x[i] = Math.floor(xx[i] + (xx[superRotate[2][i]] - xx[i]) * .05);
      y[i] = Math.floor(yy[i] + (yy[superRotate[2][i]] - yy[i]) * .05);
    }
    if (face == 0)
      superTwist = (superTwist + 1) % 4;
    if (face == 4)
      superTwist = (superTwist + 3) % 4;
    var a = superRotate[superTwist][0];
    var b = superRotate[superTwist][1];
    var c = superRotate[superTwist][2];
    var d = superRotate[superTwist][3];
    var A = (x[c] - x[b]) * w;
    var B = (y[c] - y[b]) * w;
    var C = (x[a] - x[b]) / 2;
    var D = y[b] + (y[a] - y[b]) / 2;
    var E = y[c] + (y[d] - y[c]) / 2;
    var F = (x[d] - x[c]) / 2;
    var n = superTwist ^ 1;
    g.fillStyle = color;
    g.beginPath();
    g.moveTo(x[a] + (x[d] - x[a]) / 2, y[a] + (y[d] - y[a]) / 2);
    g.lineTo(x[n] + C, D);
    g.lineTo(x[n] + A + C, D + B);
    g.lineTo(x[n] + A, y[n] + B);
    n = (n + 1) % 4;
    g.lineTo(x[n] - A, y[n] - B);
    g.lineTo(x[n] - A + F, E - B);
    g.lineTo(x[n] + F, E);
    g.closePath();
    g.fill();
    g.lineWidth = 0.6 * dpr;
    g.strokeStyle = "black";
    g.stroke();
  }

  function colorToHex(s) {
    if (s == "white") return ("#FFFFFF");
    else if (s == "black") return ("#000000");
    else if (s == "gray") return ("#808080");
    else return ("#808080");
  }

  function colorAverage(s) {
    if (s.substring(0, 1) != "#")
      s = colorToHex(s);
    var r = parseInt(s.substring(1, 3), 16);
    var g = parseInt(s.substring(3, 5), 16);
    var b = parseInt(s.substring(5, 7), 16);
    return ((r * 299 + g * 587 + b * 114) / 1000);
  }

  function brighter(s) {
    if (s.substring(0, 1) != "#")
      s = colorToHex(s);
    var r = parseInt(s.substring(1, 3), 16);
    var g = parseInt(s.substring(3, 5), 16);
    var b = parseInt(s.substring(5, 7), 16);
    r = Math.floor(r * 1.3);
    g = Math.floor(g * 1.3);
    b = Math.floor(b * 1.3);
    return rgbToHex(r > 255 ? 255 : r, g > 255 ? 255 : g, b > 255 ? 255 : b);
  }

  function darker(s) {
    if (s.substring(0, 1) != "#")
      s = colorToHex(s);
    var r = parseInt(s.substring(1, 3), 16);
    var g = parseInt(s.substring(3, 5), 16);
    var b = parseInt(s.substring(5, 7), 16);
    r = Math.floor(r * .7);
    g = Math.floor(g * .7);
    b = Math.floor(b * .7);
    return rgbToHex(r, g, b);
  }

  function run(jobNum, dir) {
    if (jobNum > nowServing) {
      setTimeout(run, 0, jobNum, dir);
      return;
    }
    if (!demo && (move.length == 0 || move[curMove].length == 0)) {
      animating = false;
      drawButtons = true;
      paint();
      return;
    }
    if (!moveAnimated) { // fast-forward without using animation scheduler
      var mv = move[curMove];
      while (movePos < mv.length) {
        if (mv[movePos] >= 1000)
          curInfoText = mv[movePos] - 1000;
        else if (mv[movePos] != -1) {
          var num = mv[movePos] % 4 + 1;
          var mode = Math.floor(mv[movePos] / 4) % (modeChar.length + 1);
          var layer = Math.floor(mv[movePos] / 4 / (modeChar.length + 1));
          twistLayers(cube, layer, (num == 4) ? 2 : num, mode);
        }
        movePos++;
      }
      animating = false;
      drawButtons = true;
      paint();
      nowServing++;
      return;
    }
    var moveDir = dir;
    interrupted = false;
    requestAnimationFrame(callback);
    var layer, num, mode;
    var sTime, lTime;
    var d, phis, phit;
    var restart;
    var spin = false;
    var outerLoopTop = true;
    var innerLoopTop = true;
    var innerLoopBot = false;
    var outerLoopBot = false;
    var cont = false;
    var mv = demo ? demoMove[0] : move[curMove];

    function callback() {
      if (outerLoopTop) {
        outerLoopTop = false;
        restart = false;
        if (repeatable) {
          if (moveDir > 0) {
            if (movePos >= mv.length) {
              movePos = 0;
              initInfoText(mv);
            }
          }
          else {
            curInfoText = -1;
            if (movePos == 0)
              movePos = mv.length;
          }
        }
        else {
          if ((moveDir > 0 && movePos >= mv.length) ||
            (moveDir < 0 && movePos == 0)) {
            restarted = false;
            animating = false;
            nowServing++;
            drawButtons = true;
            paint();
            // cancel();
            return;
          }
        }
        animating = true;
        drawButtons = true;
      }
      if (innerLoopTop) {
        innerLoopTop = false;
        if (moveDir < 0) {
          cont = false;
          if (movePos == 0) {
            cont = true;
            outerLoopBot = true;
          }
          else
            movePos--;
        }
        if (!cont) {
          spin = false;
          if (mv[movePos] == -1) {
            paint();
            // dot in the move sequence means pause
            if (!moveOne) {
              // sleep(33 * speed);
              // no sleep command available so do a busy wait
              sTime = Date.now();
              while ((Date.now() - sTime) < 1000)
              ; // empty loop
            }
          }
          else if (mv[movePos] >= 1000)
            curInfoText = moveDir > 0 ? mv[movePos] - 1000 : -1;
          else
            spin = true;
          if (spin) {
            num = mv[movePos] % 4 + 1;
            mode = Math.floor(mv[movePos] / 4) % (modeChar.length + 1);
            var clockwise = num < 3;
            if (num == 4)
              num = 2;
            if (moveDir < 0) {
              clockwise = !clockwise;
              num = 4 - num;
            }
            layer = Math.floor(mv[movePos] / 4 / (modeChar.length + 1));
            twisting = false;
            natural = true;
            spinning = true;
            originalAngle = 0;
            if (faceTwistDirs[layer] > 0)
              clockwise = !clockwise;
            if (moveAnimated) {
              phit = Math.PI / 2; // target for currentAngle (default pi/2)
              phis = clockwise ? 1.0 : -1.0; // sign
              var turnTime = 67 * speed; // milliseconds to be used for one turn
              if (num == 2) {
                phit = Math.PI;
                turnTime = 67 * doubleSpeed; // double turn is usually faster than two quarter turns
              }
              twisting = true;
              twistedLayer = layer;
              twistedMode = mode;
              splitCube(layer); // start twisting
              sTime = Date.now();
              lTime = sTime;
              d = phis * phit / turnTime;
              currentAngle = 0;
            }
          } // if spin
          else
            innerLoopBot = true;
        } // if cont
      } // if innerLoopTop
      if (!cont) {
        if (spin) {
          if (moveAnimated) {
            if (currentAngle * phis < phit) {
              paint();
              if (interrupted || restarted)
                innerLoopBot = true;
              lTime = Date.now();
              currentAngle = d * (lTime - sTime);
            }
            else
              innerLoopBot = true;
          }
          else
            innerLoopBot = true;
        }
        if (innerLoopBot) {
          innerLoopBot = false;
          innerLoopTop = true;
          if (spin) {
            currentAngle = 0;
            twisting = false;
            natural = true;
            twistLayers(cube, layer, num, mode);
            spinning = false;
            if (moveAnimated)
              paint();
            if (moveOne)
              restart = true;
          }
          if (moveDir > 0) {
            movePos++;
            if (movePos < mv.length && mv[movePos] >= 1000) {
              curInfoText = mv[movePos] - 1000;
              movePos++;
            }
            if (movePos == mv.length) {
              if (!demo)
                outerLoopBot = true;
              else
                clearDemo(mv);
            }
          }
          else
            curInfoText = -1;
          if (interrupted || restarted || restart)
            outerLoopBot = true;
        } // innerLoopBot
      } // cont
      if (outerLoopBot) {
        outerLoopBot = false;
        outerLoopTop = true;
        if (jobNumber <= nowServing + 1)
          animating = false;
        drawButtons = true;
        if (buttonPressed == 0 || buttonPressed > 6)
          clear();
        paint();
        if (demo) {
          clear();
          demo = false;
        }
        restarted = false; // added (from stopAnimation)
        nowServing++;
        // cancel();
        if (movePos == 1 && mv[0] >= 1000)
          movePos--;
        return;
      }
      requestAnimationFrame(callback);
    }
  }

  function clearDemo(mv) {
    movePos = 0;
    for (var i = 0; i < 6; i++)
      for (var j = 0; j < D2; j++) {
        cube[i][j] = initialCube[i][j];
        scube[i][j] = initialSCube[i][j];
       }
    if (initialMove.length > 0 && typeof initialMove[curMove] != 'undefined')
      doMove(cube, initialMove[curMove], 0, initialMove[curMove].length, false);
    if (initialReversedMove.length > 0 && typeof initialReversedMove[curMove] != 'undefined')
       doMove(cube, initialReversedMove[curMove], 0, initialReversedMove[curMove].length, true);
    initInfoText(mv);
  }

  document.addEventListener('touchstart', mousedown);
  document.addEventListener('touchmove', mousemove, {passive: false});
  document.addEventListener('touchend', mouseup);
  document.addEventListener('mousedown', mousedown);
  document.addEventListener('mousemove', mousemove);
  document.addEventListener('mouseup', mouseup);
  document.addEventListener('contextmenu', contextmenu);

  var offsetX, offsetY;
  var mouseIsDown = false;
  var showContextMenu = true;
  var divs = document.getElementsByTagName('div');
  var wrapDiv = (divs.length > 0 && divs[0].className == 'wrap') ? true : false;

  function touchfunc(s) {
    if (wrapDiv)
      divs[0].style.overflow = s;
    else
      document.body.style.overflow = s;
  }

  function mouseup(e) {
    if (mouseIsDown && typeof e.touches != 'undefined') {
      e.preventDefault();
      touchfunc('auto');
    }
    if (mouseIsDown)
      setTimeout(function() {
        showContextMenu = true
      }, 100);
    else
      showContextMenu = true;
    mouseIsDown = false;
    dragging = false;
    if (pushed) {
      pushed = false;
      drawButtons = true;
      paint();
    }
    else if (twisting && !spinning) {
      twisting = false;
      originalAngle += currentAngle;
      currentAngle = 0.0;
      var angle = originalAngle;
      while (angle < 0.0)
        angle += 32.0 * Math.PI;
      var num = Math.floor(angle * 8.0 / Math.PI) % 16; // 2pi ~ 16
      if (snap || num % 4 == 0 || num % 4 == 3) { // close enough to a corner
        num = Math.floor((num + 2) / 4); // 2pi ~ 4
        if (faceTwistDirs[twistedLayer] > 0)
          num = (4 - num) % 4;
        originalAngle = 0;
        natural = true; // the cube in the natural state
        twistLayers(cube, twistedLayer, num, twistedMode); // rotate the facelets
      }
      paint();
    }
  }

  function mousedown(e) {
    var rect = canvas.getBoundingClientRect();
    var left = Math.floor(rect.left);
    var top = Math.floor(rect.top);
    if (typeof e.touches == 'undefined') {
      var x = e.clientX;
      var y = e.clientY;
    }
    else {
      var x = e.touches[0].clientX;
      var y = e.touches[0].clientY;
    }
    if (x < left || x > left + width / dpr || y < top || y > top + (height + buttonHeight) / dpr)
      return;
    e.preventDefault();
    mouseIsDown = true;
    showContextMenu = false;
    if (typeof e.touches != 'undefined')
      touchfunc('hidden');
    offsetX = left;
    offsetY = top;
    lastDragX = lastX = getX(e);
    lastDragY = lastY = getY(e);
    toTwist = false;
    buttonPressed = selectButton(lastX, lastY);
    if (buttonPressed >= 0)
      button();
    else if (progressHeight > 0 && move.length > 0 && move[curMove].length > 0 && lastY > height - progressHeight && lastY <= height) {
      if (clickProgress) {
        stopAnimation();
        progress(jobNumber++);
      }
    }
    else {
      if (mirrored)
        lastDragX = lastX = width - lastX;
      if (typeof e.touches == 'undefined') {
        if (editable && !animating && e.button == 0 && !e.shiftKey)
          toTwist = true;
      }
      else {
        if (editable && !animating)
          toTwist = true;
      }
    }
  }

  function button() {
    pushed = true;
    if (buttonPressed == 3) {
      if (!animating) // special feature
        mirrored = !mirrored;
      else
        stopAnimation();
    }
    else if (buttonPressed == 0) { // clear everything to the initial setup
      if (scramble > 0 && buttonBar == 2) {
        if (scrambleToggle == true) {
          scrambleToggle = false;
          stopAnimation();
          clear();
        }
        else {
          scrambleToggle = true;
          buttonPressed = 6;
          startAnimation(buttonAction[buttonPressed]);
        }
      }
      else {
        stopAnimation();
        clear();
      }
    }
    else if (buttonPressed == 7 || buttonPressed == 8) { // next sequence
      stopAnimation();
      setTimeout(clear, 0);
      if (buttonPressed == 7)
        curMove = curMove > 0 ? curMove - 1 : move.length - 1;
      else
        curMove = curMove < move.length - 1 ? curMove + 1 : 0;
    }
    else
      startAnimation(buttonAction[buttonPressed]);
    drawButtons = true;
    paint();
  }

  function progress(jobNum) {
    if (jobNum > nowServing) {
      setTimeout(progress, 0, jobNum);
      return;
    }
    var len = realMoveLength(move[curMove]);
    var pos = Math.floor(((lastX - 1) * len * 2 / (width - 2) + 1) / 2);
    pos = Math.max(0, Math.min(len, pos));
    if (pos > 0)
      pos = arrayMovePos(move[curMove], pos);
    if (pos > movePos)
      doMove(cube, move[curMove], movePos, pos - movePos, false);
    if (pos < movePos)
      doMove(cube, move[curMove], pos, movePos - pos, true);
    movePos = pos;
    dragging = true;
    paint();
    animating = false;
    nowServing++;
  }

  var eyeD = [];

  function mousemove(e) {
    if (!mouseIsDown)
      return;
    if (pushed)
      return;
    if (typeof e.touches != 'undefined')
      e.preventDefault();
    if (dragging) {
      stopAnimation();
      var len = realMoveLength(move[curMove]);
      var pos = Math.floor(((getX(e) - 1) * len * 2 / (width - 2) + 1) / 2);
      pos = Math.max(0, Math.min(len, pos));
      if (pos > 0)
        pos = arrayMovePos(move[curMove], pos);
      if (pos > movePos)
        doMove(cube, move[curMove], movePos, pos - movePos, false);
      if (pos < movePos)
        doMove(cube, move[curMove], pos, movePos - pos, true);
      movePos = pos;
      paint();
      return;
    }
    var x = mirrored ? width - getX(e) : getX(e);
    var y = getY(e);
    var dx = x - lastX;
    var dy = y - lastY;
    if (editable && toTwist && !twisting && !animating) { // we do not twist but we can
      lastDragX = x;
      lastDragY = y;
      for (var i = 0; i < dragAreas; i++) { // check if inside a drag area
        var d1 = dragCornersX[i][0];
        var x1 = dragCornersX[i][1] - d1;
        var y1 = dragCornersX[i][3] - d1;
        var d2 = dragCornersY[i][0];
        var x2 = dragCornersY[i][1] - d2;
        var y2 = dragCornersY[i][3] - d2;
        var a = (y2 * (lastX - d1) - y1 * (lastY - d2)) / (x1 * y2 - y1 * x2);
        var b = (-x2 * (lastX - d1) + x1 * (lastY - d2)) / (x1 * y2 - y1 * x2);
        if (a > 0 && a < 1 && b > 0 && b < 1) { // we are in
          if (dx * dx + dy * dy < 144) // delay the decision about twisting
            return;
          dragX = dragDirsX[i];
          dragY = dragDirsY[i];
          var d = Math.abs(dragX * dx + dragY * dy) / Math.sqrt((dragX * dragX + dragY * dragY) * (dx * dx + dy * dy));
          if (d > 0.75) {
            twisting = true;
            twistedLayer = dragLayers[i];
            twistedMode = dragModes[i];
            break;
          }
        }
      }
      toTwist = false;
      lastX = lastDragX;
      lastY = lastDragY;
    }
    dx = (x - lastX) / dpr;
    dy = (y - lastY) / dpr;
    if (!twisting || animating) { // whole cube rotation
      if (rotateAllowed) {
        vNorm(vAdd(eye, vScale(vCopy(eyeD, eyeX), dx * -0.016)));
        vNorm(vMul(eyeX, eyeY, eye));
        vNorm(vAdd(eye, vScale(vCopy(eyeD, eyeY), dy * 0.016)));
        vNorm(vMul(eyeY, eye, eyeX));
        lastX = x;
        lastY = y;
      }
    }
    else {
      if (natural)
        splitCube(twistedLayer);
      currentAngle = 0.03 * (dragX * dx + dragY * dy) / Math.sqrt(dragX * dragX + dragY * dragY); // dv * cos a
    }
    paint();
  }

  function getX(e) {
    return (typeof e.touches == 'undefined') ?
      (e.clientX - offsetX) * dpr :
      (e.touches[0].clientX - offsetX) * dpr;
  }

  function getY(e) {
    return (typeof e.touches == 'undefined') ?
      (e.clientY - offsetY) * dpr :
      (e.touches[0].clientY - offsetY) * dpr;
  }

  function contextmenu(e) {
    if (!showContextMenu)
      e.preventDefault();
  }

  window.addEventListener('resize', resize);
  var timer;

  function resize() {
    clearTimeout(timer);
    timer = setTimeout(resize2, 20);

    function resize2() {
      scaleCanvas();
      drawButtons = true;
      paint();
    }
  }

  var canvas;
  var graphics;
  var dpr, dph;
  var lineWidth;
  var ubuttonHeight;
  var uprogressHeight;
  var utextHeight;

  function init2() {
    graphics = canvas.getContext("2d");
    ubuttonHeight = buttonHeight;
    uprogressHeight = progressHeight;
    utextHeight = textHeight;
    scaleCanvas();
    parNode.appendChild(canvas);
    initSliceNormals();
    initCube();
    paint();
    // console.log(moveTextFunc(move[0], 0, move[0].length));
  }

  function scaleCanvas() {
    height = parNode.clientHeight - 1;
    width = parNode.clientWidth - 1;
    setCanvasCssSize();
    dpr = devicePixelRatio;
    dph = dpr / 2;
    height = Math.floor(height * dpr);
    width = Math.floor(width * dpr);
    setCanvasSize();
    lineWidth = dpr;
    buttonHeight = Math.floor(ubuttonHeight * dpr);
    progressHeight = Math.floor(uprogressHeight * dpr);
    textHeight = Math.floor(utextHeight * dpr);
    for (var i = 1; i < 10; i++)
      ds[i] = i * dpr;
    for (var i = 0; i < textOffsetInit.length; i++)
      textOffset[i] = textOffsetInit[i] * dpr;
    if (buttonBar == 1)
      height -= buttonHeight;
  }

  function setCanvasCssSize() {
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
  }

  function setCanvasSize() {
    canvas.width = width;
    canvas.height = height;
  }

  function randMoves(s, n) {
    // param 1 is cube size (3 = 3x3, 4 = 4x4, etc)
    // param 2 is #moves, 0 defaults to 10x cube size
    var face = ['R', 'L', 'F', 'B', 'U', 'D'];
    var slice = [''];
    var twist = ['', '2', '\''];
    var r1 = -1, prev = -1, prev2 = -1, r2, r3;
    var randmoves = "";
    for (var i=0; i < Math.floor(s/2); i++)
      slice[i+1] = ua[i];
    if (n == 0) n = s * 10;
    for (var i = 0; i < n; i++) {
      while (r1 == prev || (Math.floor(r1 / 2) == Math.floor(prev / 2) && r1 == prev2))
        r1 = Math.floor(Math.random() * 6);
      prev2 = prev;
      prev = r1;
      r2 = Math.floor(Math.random() * 3);
      if (s <= 3)
        randmoves += "" + face[r1] + twist[r2] + " ";
      else {
        r3 = Math.floor(Math.random() * Math.ceil(s/2));
        if (s&1 == 1 && r3 == Math.floor(s/2)) r3 = 0;
        randmoves += "" + face[r1] + slice[r3] + twist[r2] + " ";
      }
    }
    return randmoves;
  }

  var parNode;
  var searchParams = [];

  function parseSearchParams() {
    var lines = params.split('&');
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].split('=');
      if (typeof line[1] != 'undefined')
        searchParams[line[0]] = decodeURIComponent(line[1].trim());
    }
  }

  function removeListeners() {
    stopAnimation();
    document.removeEventListener('touchstart', mousedown);
    document.removeEventListener('touchmove', mousemove);
    document.removeEventListener('touchend', mouseup);
    document.removeEventListener('mousedown', mousedown);
    document.removeEventListener('mousemove', mousemove);
    document.removeEventListener('mouseup', mouseup);
    document.removeEventListener('contextmenu', contextmenu);
    window.removeEventListener('resize', resize);
  }

  function init0() {
    canvas = document.createElement('canvas');
    if (typeof params != 'undefined')
      parseSearchParams();
    var param = getParameter('dim');
    if (param != null) {
      if (param >= 2 && param <= 20) {
        D = parseInt(param);
        D2 = D * D;
      }
    }
    var param = getParameter('id');
    if (param != null) {
      parNode = document.getElementById(param);
      parNode.innerHTML = '';
    }
    else {
      if (document.currentScript != null)
        parNode = document.currentScript.parentNode;
      else {
        var scripts = document.getElementsByTagName("script");
        var thisScript = scripts[scripts.length - 1]
        parNode = thisScript.parentNode;
      }
    }
    for (var i = 0; i < 6; i++) {
      cube[i] = [];
      scube[i] = [];
      initialCube[i] = [];
      initialSCube[i] = [];
    }
    for (var i = 0; i < D*6; i++) {
      dragCornersX[i] = [];
      dragCornersY[i] = [];
    }
    curMove = 0;
    originalAngle = 0;
    initModeChar();
    initMoveModes();
    initCycles();
    initSuperTwist();
    onModuleLoad();
    if (parNode.id != null)
      init_direct_access(parNode.id);
  }

  function init_direct_access(id) {
    for (var s in window)
      if (s.substr(0, 5) == 'acjs_') {
        var g = eval(s);     // global
        var l = s.substr(5); // local
        if (Array.isArray(g)) {
          if (exists(l))
            g[id] = eval(l);
          else
            console.log(l + ' does not exist in animcube');
        }
        else
          console.log(s + ' is not an array');
      }
  }
  function get_var(v) {
    if (exists(v))
      return eval(v)
    else
      console.log(v + ' does not exist in animcube');
  }
  function put_var(v, val, type) {
    if(exists(v)) {
      if (type == 's')
        eval(v + "='" + val + "'");
      else if (type == 'n')
        eval(v + '=' + Number(val));
    }
  }
  function exists(s){
    try {return typeof eval(s)} catch {return false}
  }

  // -------------------------------------------------------------------------
  // Arrays/functions for NxN cube
  // -------------------------------------------------------------------------

  // cube dimensions in number of facelets (mincol, maxcol, minrow, maxrow) for compact cube
  var cubeBlocks = [];
  // subcube dimensions
  var topBlocks = [];
  var midBlocks = [];
  var botBlocks = [];
  // all possible subcube dimensions for top and bottom layers
  var topBlockTable = [];
  // indices to topBlockTable[] and botBlockTable[] for each twistedLayer value
  var topBlockFaceDim = [
  // U  D  F  B  L  R
    [1, 0, 3, 3, 2, 3], // U
    [0, 1, 5, 5, 4, 5], // D
    [2, 3, 1, 0, 3, 2], // F
    [4, 5, 0, 1, 5, 4], // B
    [3, 2, 2, 4, 1, 0], // L
    [5, 4, 4, 2, 0, 1]  // R
  ];
  var botBlockFaceDim = [
    [0, 1, 5, 5, 4, 5],
    [1, 0, 3, 3, 2, 3], 
    [4, 5, 0, 1, 5, 4],
    [2, 3, 1, 0, 3, 2],
    [5, 4, 4, 2, 0, 1],
    [3, 2, 2, 4, 1, 0]
  ];
  // subcube dimensions for middle layers
  var midBlockTable = [];
  var midBlockFaceDim = [[
    [0, 0, 2, 2, 1, 2],
    [0, 0, 4, 4, 3, 4],
    [1, 2, 0, 0, 2, 1],
    [3, 4, 0, 0, 4, 3],
    [2, 1, 1, 3, 0, 0],
    [4, 3, 3, 1, 0, 0]
  ]];
  var dragBlocks = [];
  var dragModes = [];
  var areaDirs = [[1, 0], [0, 1], [-1, 0], [0, -1]];
  var twistDirs = [
    [ 1,  1,  1, -1], // U
    [ 1,  1,  1, -1], // D
    [ 1, -1,  1,  1], // F
    [ 1, -1, -1,  1], // B
    [-1,  1, -1, -1], // L
    [ 1, -1,  1,  1]  // R
  ];
  var drawOrder = [];

  function initCube() {
    initTopBlockTable(); 
    initMidBlockTable();
    initMidBlockFaceDim();
    initDragBlocks(D * 2);
    initDragModes();
    for (var i=0; i < 6; i++)
      cubeBlocks[i] = [[0, D], [0, D]];
    for (var i=0; i < D-2; i++)
      midBlocks[i] = [];
    eyeOrder[4][D-1] = 1; // mode s
    eyeOrder[5][D-1] = 2; // mode a
    initDrawOrder();
    initTurnSymbol();
  }

  function initTopBlockTable() {
    var d = D - 1;
    topBlockTable = [
      [[0, 0],[0, 0]], [[0, D],[0, D]], [[0, D],[0, 1]],
      [[0, 1],[0, D]], [[0, D],[d, D]], [[d, D],[0, D]]
    ];
  }

  function initMidBlockTable() {
    var m = [];
    for (var i=1, ix=0; i < D/2; i++) {
      var d = D-i;
      m[ix++] = [i, i+1]; 
      if (i < D/2-1 || D%2 == 0)
        m[ix++] = [d-1, d];
    }
    midBlockTable[0] = [[0, 0], [0, 0]];
    for (var i=1, j=0; i <= (D-2)*2; i+=2, j++) {
      midBlockTable[i]   = [[0, D], m[j]];
      midBlockTable[i+1] = [m[j], [0, D]];
    }
  }

  function initMidBlockFaceDim() {
    if (D == 3) {
      f2(0);
      return;
    }
    var n = D - 2;
    for (var i=1; i < n; i++)
      midBlockFaceDim[i] = [[],[],[],[],[],[]];
    for (var i=1; i <= (n-2)/2; i++)
      f1(i);
    if ((D&1) == 1)
      f2(i++);
    for (; i < n; i++)
      f3((n-1)-i, i);
    function f1(n) {
      for (var i=0; i < 6; i++) {
        var p = midBlockFaceDim[n-1][i];
        var r = midBlockFaceDim[n][i];
        for (var j=0; j < 6; j++)
          r[j] = p[j] ? p[j]+4 : p[j];
      }
    }
    function f2(n) {
      for (var i=0; i < 6; i++) {
        var p = midBlockFaceDim[0][Math.floor(i/2)*2];
        var r = midBlockFaceDim[n][i];
        for (var j=0; j < 6; j++)
          r[j] = p[j] ? p[j] + n*4 : p[j];
        if (i > 3)
          r[3] = r[2];
      }
    }
    function f3(n1, n2) {
      for (var i=0; i < 6; i++) {
        var p = midBlockFaceDim[n1][i];
        var r = midBlockFaceDim[n2][i^1];
        for (var j=0; j < 6; j++)
          r[j] = p[j] ? p[j] : p[j];
      }
    }
  }

  function initDragBlocks(n) {
    var d = D - 1;
    dragBlocks = [
      [[0, 0], [D, 0], [D, 1], [0, 1]],
      [[D, 0], [D, D], [d, D], [d, 0]],
      [[D, D], [0, D], [0, d], [D, d]],
      [[0, D], [0, 0], [1, 0], [1, D]]
    ];
    var a = [[0, 1], [-1, 0], [0, -1], [1, 0]];
    for (var i=4; i < n; i++) {
      dragBlocks[i] = [[],[],[],[]];
      var r = dragBlocks[i];
      var p = dragBlocks[i-4];
      for (var j=0; j < 4; j++) {
        r[j][0] = p[j][0] + a[i%4][0];
        r[j][1] = p[j][1] + a[i%4][1];
      }
    }
  }

  function initDragModes() {
    var n = Math.floor((D+1)/2);
    for (var i=0, ix=0; i < 3; i++)
      for (var j=0; j < n; j++) {
        for (var k=0; k < 4; k++) {
          if (D%2 && j == n-1 && k > 1)
            continue;
          dragModes[ix++] = (j > 1) ? j+4 : j;
        }
      }
  }

  function initDrawOrder() {
    var n = D - 1;
    for (var i=0; i < D; i++) {
      drawOrder[i] = [];
      for (var j=0; j < D; j++)
        drawOrder[i][j] = (j < n - i) ? j : n*2 - i - j;
    }
  }

  function convertNotation(s) {
    for (var i=0; i < 9; i++) // slice moves
      s = replaceMoves(s, i+2, ua[i], 0);
    for (var i=0; i < 8; i++) // wide moves 
      s = replaceMoves(s, i+3, ua[uw+i], 1);
    return s;
  }

  // top facelet cycle
  var cycleOrder = [];
  // side facelet cycle offsets
  var cycleFactors;
  var cycleOffsets;

  function initCycles() { 
    cycleFactors = [1, D, -1, -D, 1, D, -1, -D];
    initCycleOffsets();
    initCycleOrder();
  }

  function initCycleOffsets() {
    var c = [0, D-1, D*D-1, D*D-D];
    for (var i=0, ix=4; i < Math.ceil(D/2)-1; i++, ix+=4) {
      c[ix]   = c[ix-4] + D;
      c[ix+1] = c[ix-3] - 1;
      c[ix+2] = c[ix-2] - D;
      c[ix+3] = c[ix-1] + 1;
    }
    cycleOffsets = c;
  }

  function initCycleOrder() {
    var a=[];
    for (var i=0; i < D; i++)
      a[i] = [];
    for (var i=0; i < D; i++) {
      for (var j=0; j < D; j++)
        a[j][i] = i*D + j;
    }
    for (var i=0; i < Math.floor(D/2); i++) {
      cycleOrder[i] = [];
      var ix = 0;
      var c = cycleOrder[i];
      var n = D - 1 - i;
      for (j=i; j < n; j++) c[ix++] = a[j][i];
      for (j=i; j < n; j++) c[ix++] = a[n][j];
      for (j=n; j > i; j--) c[ix++] = a[j][n];
      for (j=n; j > i; j--) c[ix++] = a[i][j];
    }
  }

  function initTurnSymbol() {
    if (D%2) {
      var esm = ["~E", "E", "S", "~S", "M", "~M"];
      var n = (D == 3) ? 1 : Math.ceil(D/2)+3;
      // update for sign & wca
      turnSymbol[0][n] = esm; 
      turnSymbol[1][n] = esm;
    }       
  }

  var ua = [];  // unicode array
  var us = 130; // unicode starting number
  var uw = 9;   // ua sarting index for wide moves

  function initUnicode() {
    for (var i=0; i <= 18; i++)
      ua[i] =  String.fromCharCode(us+i);
  }

  var modeChar = [];
  var maxSliceMode;

  function initModeChar() {
    initUnicode();

    // first inner layer (slice) is in modeChar[0]
    modeChar = [ua[0], '', '', '', ''];

    // remaining slices start at modeChar[5]
    for(var i=0; i < 8; i++)
      modeChar[i+5] = (i < Math.ceil(D/2)-2) ? ua[i+1] : '';

    // wide moves start after slice moves
    // double wide moves are handled by moveModes (start with 3 wide)
    var n = modeChar.length;
    for(var i=0; i < 8; i++)
      modeChar[n+i] = (i < Math.floor(D/2)-2) ? ua[uw+i] : '';

    // set maxSliceMode to the max mode used for slices
    // (it is the row index in eyeOrder/blockMode that corresponds to 
    // modeChar+1)
    maxSliceMode = Math.ceil(D/2) + 3;
  }

  function initMoveModes() {
    // set mode for ESM  moves
    if (D%2)
      for (var i=6; i <= 8; i++)
        moveModes[i] = (D == 3) ? 1 : Math.ceil(D/2)+3;
  }

  init0();
}
