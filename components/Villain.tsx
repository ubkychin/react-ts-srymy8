import * as React from 'react';
import { useState, useEffect } from 'react';
import { Villain } from '../models/IHero';
import * as _ from 'lodash';
import { Game } from '../models/IGame';

interface VillainProps {
  villain: Villain;
  onClick;
}

export const VillainComponent: React.FC<VillainProps> = (props) => {
  const [villain, setVillain] = useState(props.villain);

  useEffect(()=>{setVillain(props.villain)}, [props.villain]);

  return (
    <div  className={`villain-div ${villain.selected == true ? "selected" : ''} ${!villain.active ? 'disabled' : ''}`} 
          onClick={() => props.onClick(villain.name)}
    >
      <img src={villain.pic} />
      <h4>{villain.name}</h4>
      <p>{villain.hitpoints}</p>
      <p>{villain.selected.toString()}</p>
    </div>
  );

  
}


interface VillainsProps {
  game: Game;
  onClick;
}

export const Villains: React.FC<VillainsProps> = (props) => {
  const [game, setGame] = useState(props.game);

  useEffect(() => {setGame(props.game)}, [props.game]);

  return (
    <div className="villains-div">
      {game.villains.map(villain => (
          <VillainComponent villain={villain} onClick={props.onClick}/>

      ))}
    </div>
  );
};