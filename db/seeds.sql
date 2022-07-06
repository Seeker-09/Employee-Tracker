INSERT INTO departments(name)
VALUES
    ("Engineering"),
    ("Marketing"),
    ("Sales");

INSERT INTO roles(title, salary, department_id)
VALUES 
    ("Engineering Manager", 100000.00, 1),
    ("Markeging Manager", 90000.00, 2),
    ("Sales Manager", 80000.00, 3),
    ("Engineer", 70000.00, 1),
    ("Marketer", 60000.00, 2),
    ("Sales", 50000.00, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
    ("Alfar", "Vijay", 1, NULL),
    ("Alishar", "Marian", 2, NULL),
    ("Sarah", "Dijana", 3, NULL),
    ("Dipaka", "Diana", 4, 1),
    ("Peri", "Iovita", 5, 2),
    ("Mneme", "Romuald", 6, 3);
