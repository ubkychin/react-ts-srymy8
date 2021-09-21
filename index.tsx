import * as React from 'react';
import 'bootstrap/dist/css/bootstrap.css'
import { render } from 'react-dom';
import * as  ReactDOM from 'react-dom';
import { Observable, of, Subject } from 'rxjs';
import { HeroComponent, Heroes } from './components/Hero';
import { Hero, Villain } from './models/IHero';
import { Game } from './models/IGame';
import './style.css';
import { useState, useEffect } from 'react';
import { catchError, reduce, take } from 'rxjs/operators';
import { Villains } from './components/Villain';
import * as _ from 'lodash';
import api from './services/api';
import { Button } from 'react-bootstrap';

export const useObservable = () => {
  const subj = new Subject<boolean>();

  const next = (value:boolean): void => {
      subj.next(value) };

  return { change: subj.asObservable() , next};
};

interface AppProps { 
  heroes: Hero[];
  game: Game;
}
interface AppState {
  name: string;
}

const gameSource: Game = new Game(new Date(), [], null, null);
const source: Hero[]  = [

                        ];
                        
const num: number = 0;

const App: React.FC<AppProps> = (props) => {
  
  const [heroes, setHeroes] = useState(props.heroes);
  const [numm, setNum] = useState(num);
  const [game, setGame] = useState(props.game);
  const [response, setResponse] = useState<Hero[]>([]);
  const [rollBtnDisabled, setRollBtnDisabled] = useState<Boolean>(true);
  const [currentRoll, setCurrentRoll] = useState<number>(null);
  const [attackDisp, setAttackDisp] = useState<string>('No attacks played');
 
  const getHeroes = <Hero,> (url: string): Observable<Hero[]> => {
    return api.get<Hero[]>(url)
         .pipe(
             take(1),
             catchError(err => of(console.log(err)))
         ) as Observable<Hero[]>;
  };

  const getData = <T,> (url: string): Observable<T[]> => {
    return api.get<T[]>(url)
         .pipe(
             take(1),
             catchError(err => of(console.log(err)))
         ) as Observable<T[]>;
  };

  const startBtnHandler = (e): void => {
    e.currentTarget.disabled = true;
    let villains: Villain[] = [];

    getData('villains').subscribe((resp => { 
      let villains:Villain[] = [];
      let villainsData:Villain[] = resp as Villain[];
      let namesUsedIndexes: number[] = [];

      for(let i = 0; i < 3; i++) {
        let nameIndex = -1;
        while (nameIndex < 0 || namesUsedIndexes.findIndex((index)=> index == nameIndex) > -1) {
          nameIndex = Math.floor(Math.random() * villainsData.length);
        }
        namesUsedIndexes.push(nameIndex);
        let hitPoints = Math.floor(Math.random() * 10) + 1;
        villains.push(new Villain(villainsData[nameIndex].name, hitPoints, false, true));
      }


      let updatedGame = _.cloneDeep(game);
      updatedGame.villains = villains;
      setGame(updatedGame);

    }));


    getHeroes('heroes').subscribe((resp => {
      setResponse(resp as Hero[]);
      let newHeroes:Hero[] = []
      
      for(let h of resp as Hero[]) {
        newHeroes.push(new Hero(h.name, h.minDice, h.maxDice, h.initialUses, h.initialUses, false, true));
      }

      setHeroes(newHeroes);
    }));

  }

  const setRollDisabled = () => {
    let button = document.getElementById('roll-btn');

    if (game.selectedHero && game.selectedVillain) {
      setRollBtnDisabled(false);
      return;
    }

    setRollBtnDisabled(true);

  }

  const resetSelected = (updatedGame: Game, mode: string) => {
    if (mode == "heroes") {
      for(let hero of heroes) {
        hero.selected = false;
      }
    }

    if (mode == "villains") {
      for(let villain of updatedGame.villains) {
        villain.selected = false;
      }
    }
  }

  const heroClickHandler = (heroName) => {
    let updatedGame: Game = _.cloneDeep(game);

    resetSelected(updatedGame, "heroes");

    if(updatedGame.selectedHero && updatedGame.selectedHero.name == heroName) {
      updatedGame.selectedHero = null;
    }  else { 
      updatedGame.selectedHero = heroes.find((hero)=> hero.name == heroName);
      updatedGame.selectedHero.selected = true;
    }

    setGame(updatedGame);

  }

  const villainClickHandler = (villainName) => {
    let updatedGame: Game = _.cloneDeep(game);

    resetSelected(updatedGame, "villains");

    if(updatedGame.selectedVillain && updatedGame.selectedVillain.name == villainName) {
      updatedGame.selectedVillain = null;
    }  else { 
      updatedGame.selectedVillain = game.villains.find((villain)=> villain.name == villainName);
      updatedGame.selectedVillain.selected = true;
      updatedGame.villains.find((villain)=> villain.name == updatedGame.selectedVillain.name).selected = true;
    }

    
    setGame(updatedGame);

  }

  const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }

  const checkEndGame = (updatedGame:Game) => {
    let heroWin: Boolean = false;
    let villainsActive = 0;
    for(let villain of updatedGame.villains) {
      if (villain.active) {
        villainsActive++;
        break;
      }
    }

    if (villainsActive == 0) {
      setAttackDisp('HEROES WIN!');
      return;
    }
    
    let activeHeroes = 0;
    for(let hero of heroes) {
      if (hero.active) {
        activeHeroes++;
        break;
      }
    }

    if (activeHeroes == 0) {
      setAttackDisp('VILLAINS WIN!');
      return;
    }
    
  }

  const rollClickHandler = () => {
    let updatedGame = _.cloneDeep(game);
    
    if (updatedGame.selectedHero.name == 'Rick') {
      openInNewTab('https://rebrand.ly/r1ckr0l13r');
    }
  
    let roll = heroes.find((hero) => hero.name == updatedGame.selectedHero.name).useHero();
    setCurrentRoll(roll);
    updatedGame.villains.find((villain)=>updatedGame.selectedVillain.name == villain.name).damage(roll);
    updatedGame.selectedVillain.damage(roll);
    setAttackDisp(`${ updatedGame.selectedHero.name } rolled ${roll} and attacked ${ updatedGame.selectedVillain.name }`)
    resetSelected(updatedGame, 'heroes');
    updatedGame.selectedHero = null;
    resetSelected(updatedGame, 'villains');
    updatedGame.selectedVillain = null;
    setGame(updatedGame);
    
    checkEndGame(updatedGame);
  
  }

  useEffect( () => { setRollDisabled() }, [game]);

  return (
    <div className="App">
      <button id="start-btn" onClick={(e) =>{ startBtnHandler(e) }}>Start</button>
      <div className="game-div">
      <h3>Selected Hero: {game.selectedHero ? game.selectedHero.name: ""} </h3>
      
      <Heroes heroes={heroes} onClick={heroClickHandler} />
      <hr />
      <Villains game={game} onClick={villainClickHandler} />
      <h3>Selected Villain: {game.selectedVillain ? game.selectedVillain.name: ""} {game.selectedVillain ? game.selectedVillain.hitpoints: ""}</h3>
      </div>
      <hr />
      <div>
        {game.selectedHero ? game.selectedHero.name: ""} attacks {game.selectedVillain ? game.selectedVillain.name: ""}
      <br />
        { attackDisp }
        <br />
        <Button id="roll-btn" Variant="Primary" onClick={()=> rollClickHandler()} disabled={rollBtnDisabled}>Roll</Button>
      </div>
      
    </div>
  );
}


render(<App game={gameSource} heroes={source}/>, document.getElementById('root'));

