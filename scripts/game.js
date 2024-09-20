"use strict";

/**
 * global variable used in the function incrMoves as a movement counter
 *  and in initLevel when it initializes the movements
 */
let moves = 0;

/**
 * globale variable used as a level counter.
 */
let initL = 0;

/**@type Array<State> board with all the states of the player */
const states = [];

/**
 * Displays the level by each character in the console
 * @param {number} level is the number of the level
 *
 */
function buildLevel(level) {
    $("#world").addClass("lignes");
    const map = levels[level].map;
    for (let i = 0; i < map.length; i++) {
        const ligne = $("<div>").addClass("ligne");
        $("#world").append(ligne);

        for (const char of map[i]) {
            if (char === "🧍") {
                ligne.append(
                    $("<div>")
                        .addClass("square")
                        .addClass("joueur")
                );
            } else if (char === "x") {
                ligne.append(
                    $("<div>")
                        .addClass("square")
                        .addClass("cible")
                );
            } else if (char === "#") {
                ligne.append(
                    $("<div>")
                        .addClass("square")
                        .addClass("boite")
                );
            } else if (char === "@") {
                ligne.append(
                    $("<div>")
                        .addClass("square")
                        .addClass("boite cible")
                );
            } else if (char === " ") {
                ligne.append(
                    $("<div>")
                        .addClass("square")
                        .addClass("sol")
                );
            } else {
                ligne.append(
                    $("<div>")
                        .addClass("square")
                        .addClass("mur")
                );
            }
        }
    }
}

/**
 *returns the actual position of the player in the page.
 * @returns position x and y of the Player.
 */
function getPlayerPosition() {
    //index = avoir la positon donc <> <> balises de la fonction d'affichage ".index" pr selectionner balise
    //parent = idem mais pour selectionner ligne
    const x = $(".joueur").index();
    const y = $(".joueur").parent()
        .index();
    return {x, y};
}
/**
 *returns the square of the page that is on the given position.
 * @param {{x:number,y:number}} position
 * @returns the square at the position given
 */
function getSquareAt(position) {
    //eq retourne div qu'il ya dans la position
    //children car world vient au dessus de parent
    return $("#world").children()
        .eq(position.y)
        .children()
        .eq(position.x); //pas au dernier car c'est le + petit donc pas d'enfants
}
/**
 * moves the player from square to another with the arrow touches.
 * @param {JQuery.KeyDownEvent} event
 */
function move(event) { //event pour les touches
    const k = event.key;
    if (!["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(k)) { //include renvoie vrai si il s'y trouve dedant.
        return; //bloque ici si l'utilisateur entre autre chose que les fleches.
    }

    let dx = 0;
    let dy = 0;
    let dx2 = 0;
    let dy2 = 0;

    let classeJ = "";
    const posed = getPlayerPosition();

    switch (k) { //fleches
    case "ArrowRight": // right arrow
        // hasclass savoir si il a la classe
        dx = +1;
        dy = 0;
        dx2 = +2;
        dy2 = 0;
        classeJ = "joueurR";
        break;
    case "ArrowLeft":
        dx = -1;
        dx2 = -2;
        dy = 0;
        dy2 = 0;
        classeJ = "joueurL";
        break;
    case "ArrowDown":
        dx = 0;
        dy = +1;
        dx2 = 0;
        dy2 = +2;
        classeJ = "joueurDown";
        break;
    case "ArrowUp":
        dx = 0;
        dy = -1;
        dx2 = 0;
        dy2 = -2;
        classeJ = "joueurUp";
        break;
    }
    const dest = {x: posed.x + dx, y: posed.y + dy}; //pas besoin de créer une classe , fait direct avec accolades.
    const dest2 = {x: posed.x + dx2, y: posed.y + dy2};

    let stateMov = undefined;

    if (allOnTaret()) {
        if (initL < 6) {
            $(".finNiveau").removeClass("hidden");
        } else {
            $(".finJeu").removeClass("hidden");
        }
        $(document).off("keydown");
        $(document).on("keydown", finishLevel);
    } else { //si !allontaret()
        if (getSquareAt(dest).hasClass("boite")) {
            stateMov = new State(posed, dest);
        } else {
            stateMov = new State(posed);
        }
        states.push(stateMov);
    }
    applyMove(posed, dest, classeJ);
    boxMove(posed, dest, dest2, classeJ);
    incrMoves();

    //states.push(new State(posed));
}
/**
 * animates the moves of the player
 * @param {{x:number, y:number}} posed
 * @param {{x:number, y:number}} dest
 * @param {String} classeJ
 */
function animation(posed, dest, classeJ) {
    getSquareAt(posed)
        .removeClass("joueur")
        .addClass("sol")
        .removeClass("joueurL")
        .removeClass("joueurR")
        .removeClass("joueurUp")
        .removeClass("joueurDown");

    getSquareAt(dest)
        .addClass("joueur")
        .addClass(classeJ);
}
//pos depart pos arrivé et la classe doit bouger
/**
* applies the move to the player.
 * @param {{x:number, y:number}} posed
 * @param {{x:number, y:number}} dest
 * @param {String} classeJ
 */
function applyMove(posed, dest, classeJ) {
    if (!getSquareAt(dest).hasClass("mur") && !getSquareAt(dest).hasClass("boite")) { // pas oublier hasclass boite sinn il va les bouffer
        animation(posed, dest, classeJ);
    }
}
/**
 * moves the box.
 * @param {{x:number, y:number}} posed
 * @param {{x:number, y:number}} dest
 * @param {{x:number, y:number}} dest2
 * @param {String} classeJ
 */
function boxMove(posed, dest, dest2, classeJ) {
    if (getSquareAt(dest).hasClass("boite")) {
        if (!getSquareAt(dest2).hasClass("boite") && !getSquareAt(dest2).hasClass("mur")) {
            animation(posed, dest, classeJ);
            getSquareAt(dest2)
                .addClass("boite");
            getSquareAt(dest)
                .removeClass("boite");
        }
    }
}
/**
 * counter of movements.
 */
function incrMoves() {
    moves++;
    $(".incrMoves").text(moves);
}
/**
 * verifies if all the boxes are on all targets, returns true when they are
 * and false otherwise.
 * @returns {boolean}
 */
function allOnTaret() {
    const taret = $(".cible"); //je recupere cible.
    for (const element of taret) { //je parcours la const
        if (!$(element).hasClass("boite")) { //si un des elements n'a pas classe boite = faux
            return false;
        }
    }
    return true;
}

/**
 * Allows to go to the next level with the space key
 * @param {JQuery.KeyDownEvent} event
 */
function finishLevel(event) {
    const k = event.key;
    if (k === " ") { //espace
        $(document).off("keydown");
        initL++;
        initLevel();
    }
}
/**
 * initializes the level so it can be replayed with the button "replay".
 */
function initLevel() {
    $("#world").children()
        .remove();
    buildLevel(initL);

    moves = 0; //0 mouvements
    $(".incrMoves").text(moves);

    $(".niveau").text(`niveau : ${initL + 1}`);
    $(".finNiveau").addClass("hidden");
    $(".finjeu").addClass("hidden");

    $(document).off("keydown");
    $(document).on("keydown", move);
}
/**
 * cancels movements in the game.
 */
function cancel() {
    const nbStates = states.length - 1;
    if (moves > 0 && !allOnTaret()) {
        moves -= 1;
        $(".incrMoves").text(moves);

        const oldPosed = states[nbStates].playerPosition;

        const annuler = {x: getPlayerPosition().x - oldPosed.x, //getPlayerPosition() = posed
            y: getPlayerPosition().y - oldPosed.y};//(getplayerposition - states[states.length - 1]); poisition du joueur - derniere etat

        const oldBox = states[nbStates].boxPosition;
        const newBox = {x: getPlayerPosition().x + annuler.x, y: getPlayerPosition().y + annuler.y};

        animation(getPlayerPosition(), states[nbStates].playerPosition, "down");

        if (oldBox && newBox !== undefined) {
            getSquareAt(oldBox).addClass("boite");
            getSquareAt(newBox).removeClass("boite");
        }
        states.pop();
        //const annulation = states.pop(); //prendre pos ancienne -nvx calcul
    }
}
$(() => {
    initLevel();
    $("#replay").on("click", initLevel);
    $("#cancel").on("click", cancel);
});
