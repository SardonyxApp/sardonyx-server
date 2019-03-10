-- After creating and selecting a database using 
-- CREATE DATABASE name_of_database;
-- USE name_of_database;
-- execute this SQL file using 
-- source /path/to/this/file 
-- in the mysql prompt to set up the database 

-- Create tables 
CREATE TABLE tasklists (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  PRIMARY KEY (id)
) ENGINE=INNODB;

CREATE TABLE students (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  year INT NOT NULL,
  tasklist_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY fk_tasklist(tasklist_id)
  REFERENCES tasklists(id)
  ON UPDATE CASCADE
) ENGINE=INNODB;

CREATE TABLE teachers (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  PRIMARY KEY (id)
) ENGINE=INNODB;

-- Create dummy items
INSERT INTO tasklists (id, name, description)
  VALUES (1, 'Test Cohort', 'Dummy test group');

INSERT INTO students (id, first_name, last_name, email, year, tasklist_id) 
  VALUES (1, 'John', 'Doe', 'johndoe@example.com', 2020, 1);

INSERT INTO teachers (id, first_name, last_name, email) 
  VALUES (1, 'Jane', 'Doe', 'janedoe@example.com');