import { Module } from "@nestjs/common";
import { PingController } from "./ping.controller";
import { PingService } from "./ping.service";

@Module({
  controllers: [PingController],
})
export class PingModule {}