import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NoteModule } from './note/note.module';
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from "./auth/jwt/jwt.strategy";


@Module({
  imports: [
      NoteModule,
      ConfigModule.forRoot(),
      MongooseModule.forRoot(process.env.DATABASE_HOST, { dbName: 'todolist', useNewUrlParser: true,
        useUnifiedTopology: true }),
      UserModule,
      AuthModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [
    JwtStrategy,
    AppService
  ],
})
export class AppModule {}
