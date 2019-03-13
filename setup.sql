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
  name VARCHAR(255) NOT NULL,
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
  full_name VARCHAR(255) NOT NULL,
  prefix_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_digest CHAR(128) NOT NULL,
  salt CHAR(128) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=INNODB;

CREATE TABLE subjects (
  id INT NOT NULL AUTO_INCREMENT, 
  name VARCHAR(255) UNIQUE NOT NULL,
  PRIMARY KEY (id)
) ENGINE=INNODB;

CREATE TABLE categories (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) UNIQUE NOT NULL,
  PRIMARY KEY (id)
) ENGINE=INNODB;

CREATE TABLE tasks ( 
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  due DATETIME,
  tasklist_id INT NOT NULL,
  student_id INT,
  teacher_id INT, 
  subject_id INT,
  category_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY fk_task_parent_tasklist(tasklist_id)
  REFERENCES tasklists(id)
  ON UPDATE CASCADE
  ON DELETE CASCADE,
  FOREIGN KEY fk_task_parent_student(student_id)
  REFERENCES students(id)
  ON UPDATE CASCADE
  ON DELETE SET NULL,
  FOREIGN KEY fk_task_parent_teacher(teacher_id)
  REFERENCES teachers(id)
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

-- Create dummy items
-- Remove these items from production 
INSERT INTO tasklists (id, name, description)
  VALUES (1, 'Test Cohort', 'Dummy test group');

INSERT INTO students (id, name, email, year, tasklist_id) 
  VALUES (1, 'John Doe', 'johndoe@example.com', 2020, 1);

INSERT INTO teachers (id, full_name, prefix_name, email, password_digest, salt)
  VALUES (1, 'Jane Doe', 'Mrs. Doe', 'janedoe@example.com', 'e722db6d714b4de78d557b7d6bf667091ded4491a96e8ec15961cdac5ae5a1b9333648153d7c6a65236ce093e6a78df40cd26be5c05000d23c7d21e950574916', 'c76c4296c780c9af8ec0fa1774882dfadbb1024b564ac00a141101e75996c7d626a3c911bdb7d106109f54d4c41711ed242d7e0f5a7de3dbafa42526d6075b4b');
-- original password: password1234

INSERT INTO subjects (id, name) 
  VALUES (1, 'Programming');

INSERT INTO categories (id, name)
  VALUES (1, 'Assignment');

INSERT INTO tasks (id, name, description, due, tasklist_id, student_id, subject_id, category_id) 
  VALUES (1, 'Program Sardonyx', 'Implement programs.', '2019-04-01 12:00', 1, 1, 1, 1);