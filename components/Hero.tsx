import * as React from 'react';
import { useState, useEffect } from 'react';
import { Hero } from '../models/IHero';
import * as _ from 'lodash';
import { Game } from '../models/IGame';

interface HeroProps {
  hero: Hero;
  onClick;
}

export const HeroComponent: React.FC<HeroProps> = (props) => {
  const [hero, setHero] = useState(props.hero);
  const [disabled, setDisabled] = useState(props.hero.active);
  
  useEffect(() => {setHero(props.hero)}, [props.hero]);

  return (
    <div  className={`hero-div ${hero.selected == true ? 'selected' : ''} ${!hero.active ? 'disabled' : ''}`} 
          onClick={() => props.onClick(hero.name)}
             
    >
      <h4>{hero.name}</h4>
      <p>Dice: {hero.minDice} - {hero.maxDice}</p>
      <p>Uses Left: {hero.uses}</p>
    </div>
  );

  
}


interface HeroesProps {
  heroes: Hero[];
  onClick;
}

export const Heroes: React.FC<HeroesProps> = (props) => {
  const [heroes, setHeroes] = useState(props.heroes);

  useEffect(() => setHeroes(props.heroes), [props.heroes]);

  const setSelected = () => {

  }

  return (
    <div className="heroes-div">
      {heroes.map(hero => (
          <HeroComponent hero={hero} onClick={props.onClick}/>    
      ))}
    </div>
  );
};