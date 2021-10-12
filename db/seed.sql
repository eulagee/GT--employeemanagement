INSERT INTO employees.department (id, name)
VALUES (1, "Manegement");

INSERT INTO employees.role (title, salary, department_id)
VALUES ("CEO", 0,  1);

INSERT INTO employees.employee (first_name, last_name, role_id, manager_id)
VALUES ("Atsuko", "Manager",  1, 1);
