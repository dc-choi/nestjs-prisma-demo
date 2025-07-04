# nestjs-prisma-demo
NestJS와 Prisma를 사용해서 Demo Server를 제작합니다.

### tips
- app도 컨테이너, db도 컨테이너로 실행하면 다음 설정처럼 해야함.
- host.docker.internal

```dotenv
DATABASE_URL={db}://{id}:{password}@host.docker.internal:{port}/{schema}
```