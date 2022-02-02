## My register API

### Project made for training my typescript and backend habilities

I am _(trying to)_ use

- TDD
- Clean Code Pratices
- Clean Architecture

Techs: 

- Jest
- Express
- Postgres
- Prisma

## How to run project

### Development

Clone the project
```
git clone https://github.com/abnerpersio/my-register.git
```

Get inside the project folder
```
cd my-register
```

Configure `.env` file based on `.env.example` with your settings

Run prisma migrations in your database
```
npm run db:migrate
```

Run the project locally
```
npm run dev
```

### Testing

Configure `.env.test` file based on `.env.example` with your settings

Run prisma migrations in your test database
```
npm run test:migrate
```

Run all tests with jest
```
npm run test
```