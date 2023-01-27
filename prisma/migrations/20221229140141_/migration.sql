INSERT INTO "User" ("id", "email", "firstName", "lastName", "online", "createdAt", "updatedAt", "password") VALUES
	('47bbd0c9-8852-4e5b-9895-ab0e6092549b', 'admin@test.fr', 'admin', 'admin', 'false', '2022-12-29 13:59:54.573', '2022-12-29 13:59:54.573', '$2b$10$jDJXqSu2NQilSswBTR8/oOIc4Fu2hWA9o.KwQVm2nDK22d2JX2bBu');

INSERT INTO "_RoleToUser" ("A", "B") VALUES
	('0d517c9a-3635-47bb-9680-215eb717c1e2', '47bbd0c9-8852-4e5b-9895-ab0e6092549b'),
	('779faa9a-4745-450a-8338-47e2293062b2', '47bbd0c9-8852-4e5b-9895-ab0e6092549b');