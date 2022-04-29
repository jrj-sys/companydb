INSERT INTO department (name)
VALUES 
    ('Engineering'),
    ('Finance'),
    ('Legal'),
    ('Management');

INSERT INTO role (title, salary, department_id)
VALUES
    ('Lead Software Engineer', 150000, 1),
    ('Software Engineer', 100000, 1),
    ('Junior Engineer', 75000, 1),
    ('Account Manager', 130000, 2),
    ('Accountant', 125000, 2),
    ('Junior Accountant', 85000, 2),
    ('Senior Associate', 175000, 3),
    ('Lawyer', 130000, 3),
    ('Clerk', 75000, 3),
    ('Director', 250000, 4),
    ('Assistant Director', 200000, 4),
    ('Department Manager', 150000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Doe', 1, null),
    ('Lexi', 'Howard', 2, 1),
    ('Michael', 'Reeves', 3, 1),
    ('Justin', 'James', 4, null),
    ('Marcy', 'Rodriguez', 5, 4),
    ('Patricia', 'Soliz', 6, 5),
    ('Matthew', 'Jones', 7, null),
    ('Lucy', 'Brocato', 8, 7),
    ('Tim', 'Allen', 9, 7),
    ('Whitney', 'Banks', 10, null),
    ('Kimberly', 'Fields', 11, 10),
    ('Kunal', 'Singh', 12, 10);
    