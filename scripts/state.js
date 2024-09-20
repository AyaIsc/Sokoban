"use strict";

/**
 * Sauvegarde l'état du jeu avant que le joueur se déplace.
 */
class State {
    /**
     *
     * @param {{x:number, y: number}} playerPosition
     * @param {{x:number, y: number} | undefined} boxPosition
     */
    constructor(playerPosition, boxPosition = undefined) {
        /**@private */
        this._playerPosition = {...playerPosition};
        /** @private */
        this._boxPosition = boxPosition !== undefined ? {...boxPosition} : undefined;
    }

    /**@returns {{x: number , y : number}} */
    get playerPosition() {
        return {...this._playerPosition};
    }

    /**@returns {{x:number, y : number} | undefined} */
    get boxPosition() {
        if (this._boxPosition !== undefined) { //cas où boxPosition est définie (comme pr annuler la place de la boxe)
            return {...this._boxPosition};
        } else { //sinon = undefined
            return undefined;
        }
    }
}

/*const s = new State({x: 1, y: 2});

const pos = s.playerPosition;
pos.x = 20;
console.log(s.playerPosition);

s.playerPosition.y = 50;
console.log(s.playerPosition); */

//const states = [new State(getPlayerPosition())];
