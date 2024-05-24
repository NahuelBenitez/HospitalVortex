// export default () => ({
//     type: 'postgres',
//     host: process.env.DB_HOST,
//     port: parseInt(process.env.DB_PORT),
//     username: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     entities: [__dirname + '/**/*.entity{.ts,.js}'],
//     synchronize: true,
//   });
export default () => ({
    port: 3000,
    database: {
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      // entities: [__dirname + '/**/*.entity{.ts,.js}'],
    },
  });
  