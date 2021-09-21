import { Villain, Hero } from './IHero';

export interface IGame {
  date: Date;
  villains: Villain[];

}

export class Game {

  constructor(public date:Date, public villains: Villain[], public selectedVillain: Villain, public selectedHero: Hero) {}
}