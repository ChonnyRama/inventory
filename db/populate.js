#! /usr/bin/env node

const { Client } = require('pg')
require("dotenv").config();

const CREATE_MONSTERS = `
CREATE TABLE IF NOT EXISTS monsters (
  monster_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR ( 50 ) NOT NULL,
  type_id INTEGER NOT NULL
);

INSERT INTO monsters (name, type_id)
VALUES
  ('goblin', 10),
  ('wolf', 2),
  ('ghost', 13);
`;

const CREATE_ABILITY_SCORES = `
CREATE TABLE IF NOT EXISTS ability_scores (
  ability_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  monster_id INT REFERENCES monsters(monster_id),
  ability_type VARCHAR (20) NOT NULL,
  score INT CHECK (score between 1 and 30) NOT NULL
);

INSERT INTO ability_scores (monster_id, ability_type, score)
VALUES
  (1, 'strength',8),
  (1, 'dexterity',14),
  (1,'constitution',10),
  (1,'intelligence',10),
  (1,'wisdom',8),
  (1,'charisma',8);
`;

const CREATE_TYPES = `
CREATE TABLE IF NOT EXISTS types (
  type_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  type_name VARCHAR ( 50 ),
  type_description VARCHAR ( 500)
);

INSERT INTO types (type_name, type_description)
VALUES
('aberration','Goals usually make no sense to humans. Behaviour should be weird.'),
('beast','Possess animal like intelligence and/or instict. Prioritizes food and the establishment and defense of territory.'),
('celestial','Concerned with cosmic order and purifying. Goal is to purge evil influences.'),
('construct','Only follow the instructions that they were programmed with. When instructions become impossible, they can go haywire.'),
('dragon', 'Want food and territory, but crave treasure and domination as well. Possess desire to demonstrate superiority. '),
('elemental', 'Forces of nature that are difficult to redirect once they have chosen a path. Defined by the temperaments associated with their elements.'),
('fey','Goals have a clear emotional or aesthetic aspect that might not make logical sense. Always personal regardless of the scale of their goals.'),
('fiend','Concerned with cosmic order and corruption. Goal is to introduce evil influences.'),
('giant','Goals usually revolve around rivalries with other giants. Interests are tightly dictated by species and place in hierarchy. Status is gained by claiming territory, wealth, rulership... etc.'),
('humanoid','Social creatures driven by politics and religion. Interested in territory, wealth, and domination.'),
('monstrosity','Possess animal like intelligence and/or instict. Prioritizes food and the establishment and defense of territory.'),
('ooze','Only interested in food.'),
('plant','Goals are only survival, self-propogation, and protection of its environment.'),
('undead','Driven by compulsions generated by event that caused them to rise from the dead.');
`;

const CREATE_SCORE_DESCRIPTIONS = `
CREATE TABLE IF NOT EXISTS score_descriptions (
  score_desc_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  ability_type VARCHAR ( 20 ) NOT NULL,
  min_score INT NOT NULL,
  max_score INT NOT NULL,
  stat_type VARCHAR (20),
  tier VARCHAR (20),
  range_description VARCHAR ( 500) NOT NULL
);

INSERT INTO score_descriptions (ability_type, min_score,max_score,stat_type,tier,range_description)
VALUES
  ('strength', 1, 8,'offense', 'low',''),
  ('strength', 9, 13, 'offense', 'medium',''),
  ('strength', 14, 17,'offense', 'high',''),
  ('strength', 18, 20,'offense', 'extraordinary',''),
  ('dexterity', 1, 8,'hybrid', 'low',''),
  ('dexterity', 9, 13, 'hybrid', 'medium',''),
  ('dexterity', 14, 17,'hybrid', 'high',''),
  ('dexterity', 18, 20,'hybrid', 'extraordinary',''),
  ('constitution', 1, 8,'defense', 'low',''),
  ('constitution', 9, 13, 'defense', 'medium',''),
  ('constitution', 14, 17,'defense', 'high',''),
  ('constitution', 18, 20,'defense', 'extraordinary',''),
  ('intelligence', 1, 8,'offense', 'low',''),
  ('intelligence', 9, 13, 'offense', 'medium',''),
  ('intelligence', 14, 17,'offense', 'high',''),
  ('intelligence', 18, 20,'offense', 'extraordinary',''),
  ('wisdom', 1, 8,'offense', 'low',''),
  ('wisdom', 9, 13, 'offense', 'medium',''),
  ('wisdom', 14, 17,'offense', 'high',''),
  ('wisdom', 18, 20,'offense', 'extraordinary',''),
  ('charisma', 1, 8,'offense', 'low',''),
  ('charisma', 9, 13, 'offense', 'medium',''),
  ('charisma', 14, 17,'offense', 'high',''),
  ('charisma', 18, 20,'offense', 'extraordinary','');
`;

async function main() {
  console.log("seeding...")
  const client = new Client()
  await client.connect();
  await client.query(CREATE_TYPES)
  await client.query(CREATE_MONSTERS)
  await client.query(CREATE_ABILITY_SCORES)
  await client.query(CREATE_SCORE_DESCRIPTIONS)
  await client.end();
  console.log("done")
}

main()