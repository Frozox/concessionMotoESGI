# Concession moto | ESGI

## Authors

- [Loan CLERIS](https://github.com/TheHikuro)
- [Tom Cuillandre](https://github.com/Frozox)

## Init DB

From your terminal clone the repository and type the following instrucitons.
We are using an ORM [Prisma](https://www.prisma.io/) to handle migration of table and data. It's comonly used to handle typescript error and auto-completion.

- `cd concessionMotoESGI`

- `make install`

if the database has no data :

- `make migrate`

## ChatBot

[Strapi](https://strapi.io/) is a libraire used for chatbot, it's offering an interactive interface to configure our chatbot's workflow.
To init type `make start-chatbot`

## Start frontend

- `yarn dev`

## Packages

- [Tailwindcss](https://tailwindcss.com/)
- [Framer motion](https://www.framer.com/motion/)
- [Socket IO](https://socket.io/)
- [React Hook Form](https://react-hook-form.com/)
- [PG](https://www.npmjs.com/package/pg)
- [React Query](https://react-query-v3.tanstack.com/)
