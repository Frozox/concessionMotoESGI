INSERT INTO "Role" ("id", "name", "createdAt", "updatedAt") VALUES
	('0d517c9a-3635-47bb-9680-215eb717c1e2', 'ADMIN', '2022-12-28 17:50:49.39', '2022-12-28 17:50:49.39'),
	('779faa9a-4745-450a-8338-47e2293062b2', 'USER', '2022-12-28 17:50:49.39', '2022-12-28 17:50:49.39');

INSERT INTO "BotStep" ("id", "question", "isRoot", "createdAt", "updatedAt") VALUES
	('f548c3ba-f810-4f62-a2f5-4b9584033faa', 'Bonjour je suis amin, votre assistant virtuel, comment puis-je vous aider ?', 'true', '2022-12-27 22:03:38.683', '2022-12-27 22:03:38.683'),
	('9cdd0a64-66bd-4593-b57a-3c2f97af1e45', 'Quand avez vous pris pour la dernière fois un rendez-vous pour l''entretient de votre véhicule ?', 'false', '2022-12-28 16:52:54.301', '2022-12-28 16:57:44.288'),
	('339ea80c-f736-4762-98cf-d931c9d67d30', 'Combien de kilomètres avez vous parcouru depuis votre dernier entretien ?', 'false', '2022-12-28 16:59:51.479', '2022-12-28 16:59:51.479'),
	('0ab37c66-10dd-4773-9b4a-45a9e62b3832', 'Souhaitez vous faire réviser votre véhicule ?', 'false', '2022-12-28 17:04:18.328', '2022-12-28 17:04:18.328'),
	('5b352c6b-72b1-4dfc-8a85-48ec6cbbee83', 'Je vous propose les rendez-vous suivants', 'false', '2022-12-28 17:05:52.177', '2022-12-28 17:05:52.177'),
	('d529c678-f4ae-4f28-81b1-7d32b28f1f4e', 'Comment utilisez vous votre véhicule ?', 'false', '2022-12-28 17:18:36.461', '2022-12-28 17:18:36.461'),
	('f5b8d1be-c42a-45af-b447-1d29f6e79197', 'Je vous propose un essaie sur route, quel horaire vous intéresse ?', 'false', '2022-12-28 17:22:57.593', '2022-12-28 17:24:43.167'),
	('e2809124-f96a-4fcf-ae52-09429350a87b', 'Je vous propose un essaie sportif, quel horaire vous intéresse ?', 'false', '2022-12-28 17:24:43.167', '2022-12-28 17:27:09.57'),
	('8b6cf80d-5dea-4f27-b9f5-6ada7b814cfc', 'Je vous propose un essaie tout-terrain, quel horaire vous intéresse ?', 'false', '2022-12-28 17:24:43.167', '2022-12-28 17:28:55.365'),
	('757028d2-ab96-4b6b-a139-042fe04a47f8', 'Quelle information de contact voulez vous ?', 'false', '2022-12-28 17:30:53.306', '2022-12-28 17:30:53.306'),
	('3bf0e1f5-1e18-4937-9b23-55163bde555c', '0666666666', 'false', '2022-12-28 17:33:08.649', '2022-12-28 17:33:08.649'),
	('d384dfd8-0439-4b24-bc46-ef15450b7f0a', 'concession-moto@test.fr', 'false', '2022-12-28 17:33:08.649', '2022-12-28 17:33:08.649');

INSERT INTO "BotAnswer" ("id", "answer", "createdAt", "updatedAt", "nextStepId", "stepId") VALUES
	('a1f85db6-0353-465e-aa88-1c365d7afc7e', 'en compétition', '2022-12-28 17:20:15.623', '2022-12-28 17:26:35.367', 'e2809124-f96a-4fcf-ae52-09429350a87b', 'd529c678-f4ae-4f28-81b1-7d32b28f1f4e'),
	('7e805567-5fda-4ef1-b461-57980dcdb5d6', 'sur route principalement', '2022-12-28 17:20:15.623', '2022-12-28 17:27:45.504', 'f5b8d1be-c42a-45af-b447-1d29f6e79197', 'd529c678-f4ae-4f28-81b1-7d32b28f1f4e'),
	('699167a1-53a5-4974-810d-b583ebcf6cf0', 'en tout-terrain', '2022-12-28 17:20:15.623', '2022-12-28 17:29:08.438', '8b6cf80d-5dea-4f27-b9f5-6ada7b814cfc', 'd529c678-f4ae-4f28-81b1-7d32b28f1f4e'),
	('42306300-11bb-4a0d-99a1-e8df8c522c16', 'Notre e-mail', '2022-12-28 17:33:27.629', '2022-12-28 17:33:27.629', 'd384dfd8-0439-4b24-bc46-ef15450b7f0a', '757028d2-ab96-4b6b-a139-042fe04a47f8'),
	('dcc2dcd3-3d72-49ea-b3ae-ea38cc17eb00', 'Notre numéro de téléphone', '2022-12-28 17:33:27.629', '2022-12-28 17:33:27.629', '3bf0e1f5-1e18-4937-9b23-55163bde555c', '757028d2-ab96-4b6b-a139-042fe04a47f8'),
	('1623c8f4-e4ed-4aeb-b3c6-3600a457f396', 'J''aimerai prendre contact', '2022-12-28 16:48:34.261', '2022-12-28 17:33:56.309', '757028d2-ab96-4b6b-a139-042fe04a47f8', 'f548c3ba-f810-4f62-a2f5-4b9584033faa'),
	('d2045ebf-0ab0-4cfb-8f11-0d261af1cee2', 'Je souhaite clôturer la conversation', '2022-12-28 16:48:34.261', '2022-12-28 16:48:34.261', NULL, 'f548c3ba-f810-4f62-a2f5-4b9584033faa'),
	('3e652550-a036-4466-9d49-0c5fb3cd06a9', 'Je souhaite vérifier l''entretien de mon véhicule', '2022-12-28 16:48:34.261', '2022-12-28 16:55:04.943', '9cdd0a64-66bd-4593-b57a-3c2f97af1e45', 'f548c3ba-f810-4f62-a2f5-4b9584033faa'),
	('b701d700-c70b-4fe1-8cd6-75792fb7af93', 'Cette année', '2022-12-28 16:55:04.943', '2022-12-28 17:00:00.808', '339ea80c-f736-4762-98cf-d931c9d67d30', '9cdd0a64-66bd-4593-b57a-3c2f97af1e45'),
	('e81ecf83-b6ee-497a-94fa-cc92904271b7', 'Moins de 10000 km', '2022-12-28 17:02:40.13', '2022-12-28 17:04:28.186', '0ab37c66-10dd-4773-9b4a-45a9e62b3832', '339ea80c-f736-4762-98cf-d931c9d67d30'),
	('30061520-9734-413e-82f6-1e97eaae3f1c', 'Je ne veux pas faire réviser mon véhicule', '2022-12-28 17:07:57.283', '2022-12-28 17:07:57.283', NULL, '0ab37c66-10dd-4773-9b4a-45a9e62b3832'),
	('596e9191-1e7e-477d-9334-f9e2678725e8', 'Je souhaite faire réviser mon véhicule', '2022-12-28 17:07:57.283', '2022-12-28 17:12:30.5', '5b352c6b-72b1-4dfc-8a85-48ec6cbbee83', '0ab37c66-10dd-4773-9b4a-45a9e62b3832'),
	('9b71223a-cb03-4f7a-ae8a-0379447a049c', 'Plus de 10000 km', '2022-12-28 17:02:40.13', '2022-12-28 17:14:28.894', '5b352c6b-72b1-4dfc-8a85-48ec6cbbee83', '339ea80c-f736-4762-98cf-d931c9d67d30'),
	('1b04e9d4-fc19-4eb1-9af5-477ba48694ad', 'Il y a plus d''un an', '2022-12-28 16:55:04.943', '2022-12-28 17:17:21.206', '5b352c6b-72b1-4dfc-8a85-48ec6cbbee83', '9cdd0a64-66bd-4593-b57a-3c2f97af1e45'),
	('5a09b7d0-71c6-47f8-b836-14d5ef41b88b', 'J''aimerai avoir plus d''informations sur un véhicule', '2022-12-28 16:48:34.261', '2022-12-28 17:21:04.689', 'd529c678-f4ae-4f28-81b1-7d32b28f1f4e', 'f548c3ba-f810-4f62-a2f5-4b9584033faa');