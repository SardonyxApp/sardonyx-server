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

CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  tasklist_id INT NOT NULL, -- default tasklist 
  password_digest CHAR(60) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY fk_teacher_tasklist(tasklist_id)
  REFERENCES tasklists(id)
  ON UPDATE CASCADE
) ENGINE=INNODB;

CREATE TABLE subjects (
  id INT NOT NULL AUTO_INCREMENT, 
  name VARCHAR(255) NOT NULL,
  color CHAR(7),
  tasklist_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY fk_subject_tasklist(tasklist_id)
  REFERENCES tasklists(id)
  ON UPDATE CASCADE
  ON DELETE CASCADE 
) ENGINE=INNODB;

CREATE TABLE categories (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  color CHAR(7),
  tasklist_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY fk_category_tasklist(tasklist_id)
  REFERENCES tasklists(id)
  ON UPDATE CASCADE
  ON DELETE CASCADE
) ENGINE=INNODB;

CREATE TABLE tasks ( 
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  due DATETIME,
  tasklist_id INT NOT NULL,
  user_id INT, 
  subject_id INT,
  category_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY fk_task_parent_tasklist(tasklist_id)
  REFERENCES tasklists(id)
  ON UPDATE CASCADE
  ON DELETE CASCADE,
  FOREIGN KEY fk_task_parent_user(user_id)
  REFERENCES users(id)
  ON UPDATE CASCADE 
  ON DELETE SET NULL,
  FOREIGN KEY fk_task_subject(subject_id)
  REFERENCES subjects(id)
  ON UPDATE CASCADE
  ON DELETE SET NULL,
  FOREIGN KEY fk_task_category(category_id)
  REFERENCES categories(id)
  ON UPDATE CASCADE
  ON DELETE SET NULL
) ENGINE=INNODB;

CREATE TABLE user_labels (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT,
  subject_id INT,
  category_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY fk_user_label(user_id)
  REFERENCES users(id)
  ON UPDATE CASCADE
  ON DELETE CASCADE,
  FOREIGN KEY fk_user_subject(subject_id)
  REFERENCES subjects(id)
  ON UPDATE CASCADE
  ON DELETE CASCADE,
  FOREIGN KEY fk_user_category(category_id)
  REFERENCES categories(id)
  ON UPDATE CASCADE 
  ON DELETE CASCADE
) ENGINE=INNODB;

-- Create dummy items
-- Remove these items from production 
INSERT INTO tasklists (id, name, description)
  VALUES (1, 'Test Cohort', 'Dummy test group');

INSERT INTO users (id, name, email, tasklist_id, password_digest)
  VALUES (1, 'Jane Doe', 'janedoe@example.com', 1, '$2b$12$15V8udm1P6wMx86h5ymRw.1oXgqBBghTzLsEhFR0c8suz3FOFkPci');
-- original password: password1234

INSERT INTO subjects (id, name, color, tasklist_id) 
  VALUES (1, 'Programming', '#4b249a', 1);

INSERT INTO categories (id, name, color, tasklist_id)
  VALUES (1, 'Assignment', '#da9104', 1);

INSERT INTO tasks (id, name, description, due, tasklist_id, user_id, subject_id, category_id) 
  VALUES (1, 'Program Sardonyx', 'Implement programs.', '2019-04-01 12:00', 1, 1, 1, 1);

INSERT INTO user_labels (user_id, category_id)
  VALUES (1, 1);
