export interface IHero {
  name: string;
  minDice: number;
  maxDice: number;
  uses: number;

  useHero(): number;

  rollDice(): number;
}


export class Hero implements IHero {

  constructor(public name: string, public minDice: number, public maxDice: number, public initialUses, public uses: number, public selected: Boolean, public active: Boolean, public pic:string) {
    this.uses = initialUses;
    this.selected = false;
  }

  public useHero(): number {
    
    if (this.uses > 0) {
      this.uses--;

      if (this.uses == 0) {
        this.active = false;
      }

      return this.rollDice();
    }
    
  }

  public rollDice(): number {
    return  Math.floor(Math.random() * (this.maxDice - this.minDice + 1) + this.minDice);
  }
}

export interface IVillain {
  name:string;

  damage(amount: number): void;
}

export class Villain implements IVillain {

  constructor(public name: string, public hitpoints: number, public selected: Boolean, public active: Boolean, public pic:string) {}

  damage(amount: number): void {
    this.hitpoints -= Math.abs(amount);

    this.hitpoints < 0 ? this.hitpoints = 0 : this.hitpoints = this.hitpoints;
    this.active = !(this.hitpoints == 0);

  }
}