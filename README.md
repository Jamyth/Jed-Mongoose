# **Jed-Mongoose**

A Utility library built for mongoose

## **Installation**

```bash
> npm install --save jed-mongoose
// or
> yarn add jed-mongoose
```

## **Feature**

-   **SequenceUtil**

    -   **createAutoIncrementFactory**

-   **QueryUtil**
    -   **safeAssign**
    -   **searchByFilter**

## **Usage**

### **NestJS**

```ts
import { Module } from '@nestjs/common';
import { SequenceUtil } from 'jed-mongoose';
// Game = Object Class
// GameSchema = Schema created with Game
import { Game, GameSchema } from './game.schema';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            {
                name: Game.name,
                useFactory: SequenceUtil.createAutoIncrementFactory(GameSchema, 'gameId'),
                inject: [getConnectionToken],
            },
        ]),
    ],
})
export class GameModule {}
```

```ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Game } from './game.schema';
import type { GameDocument } from './game.schema';
import type { Model } from 'mongoose';
import { QueryUtil } from 'jed-mongoose';

interface Request {
    pageIndex: 1;
    pageSize: 10;
    // other fields
}

@Injectable()
export class GameService {
    constructor(
        @InjectModel(Game.name)
        private readonly gameModel: Model<GameDocument>,
    ) {}

    async searchGame(request: Request) {
        const { data, totalCount, totalPage } = await QueryUtil.searchByFilter(this.gameModel, request);

        return {
            games: data,
            totalCount,
            totalPage,
        };
    }
}
```
