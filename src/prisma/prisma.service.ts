
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    
    private logger = new Logger("Prisma Client")
    
    async onModuleInit() {
        try {
            this.logger.log("Contectado a Mongo Atlas")
            await this.$connect();
            
        } catch (error) {
            console.log(error)
        }

    }
}
