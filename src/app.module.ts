import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MedicosModule } from './medicos/medicos.module';
import { PacientesModule } from './pacientes/pacientes.module';
import { HistoriaClinicaModule } from './historia-clinica/historia-clinica.module';
import { EntradasModule } from './entradas/entradas.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import database from './config/database';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnfermedadesModule } from './enfermedades/enfermedades.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.development.local',
      isGlobal: true,
      load: [database],
    }),
    TypeOrmModule.forRootAsync({
      imports:[ConfigModule],
      useFactory: (configService : ConfigService)=>({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database') || 'patients',

        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],

    }),

    MedicosModule, PacientesModule, HistoriaClinicaModule, EntradasModule, EnfermedadesModule, AuthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
