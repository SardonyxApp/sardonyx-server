-- This migration is for databases that were constructed using setup.sql prior to v1.3.0
-- Log into MySQL, select the database, then execute:
-- source /path/to/this/file

-- NOTICE: this action is irreversible
-- NOTICE: some parts of this migration will not run on MariaDB, depending on the name of the foreign key constraints.
-- If the DROP FOREIGN KEY statements fail, check the name of the constraints using SHOW CREATE TABLE table_name 
-- and replace the foreign key constraint

-- Drop the foreign key and column in tasks associated with students
ALTER TABLE tasks DROP FOREIGN KEY tasks_ibfk_2;
ALTER TABLE tasks DROP COLUMN student_id;

-- Drop the foreign key and column in user_labels associated with students
-- User labels contains the user's default label preferences
ALTER TABLE user_labels DROP FOREIGN KEY user_labels_ibfk_1;
ALTER TABLE user_labels DROP COLUMN student_id;

-- Drop students, as Managebac integration is deprecated.
DROP TABLE students;

-- Rename the column in tasks
ALTER TABLE tasks CHANGE COLUMN teacher_id user_id INT;

-- Rename the column in user_labels
ALTER TABLE user_labels CHANGE COLUMN teacher_id user_id INT;

-- The foreign keys will be updated automatically. 
-- The name will still contain the word teacher instead of user

-- All accounts will now be the same type, having the same functionality as teacher accounts
RENAME TABLE teachers TO users;

-- Remove related managebac page link
-- This was used by managebacLoader to examine whether an assignment was already added
-- This does not remove any links in the task's description
ALTER TABLE tasks DROP COLUMN managebac;

-- Remove the related managebac class link
ALTER TABLE subjects DROP COLUMN managebac;
