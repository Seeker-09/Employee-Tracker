INSERT INTO departments(name)
VALUES
    ("Engineering"),
    ("Marketing"),
    ("Sales");

INSERT INTO roles(title, salary, department_id)
VALUES 
    ("Manager", 100000.00, 1),
    ("Manager", 90000.00, 2),
    ("Manager", 80000.00, 3),
    ("Worker", 70000.00, 1),
    ("Worker", 60000.00, 2),
    ("Worker", 50000.00, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
    ("Alfar", "Vijay", 1, NULL),
    ("Alishar", "Marian", 2, NULL),
    ("Sarah", "Dijana", 3, NULL),
    ("Dipaka", "Diana", 4, 1),
    ("Peri", "Iovita", 5, 2),
    ("Mneme", "Romuald", 6, 3);
