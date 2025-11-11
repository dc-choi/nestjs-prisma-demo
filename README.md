# nestjs-prisma-demo
NestJS와 Prisma를 사용해서 Demo Server를 제작합니다.

## 사용 기술
- NestJS
- Prisma
- MySQL
- Docker
- Redis
- Redlock
- BullMQ

## Redis & Redlock 설정 가이드

### Redis Cluster vs Redlock의 차이

#### 1. Redis Cluster (`type: 'cluster'`)
- **데이터를 키 해싱 기반으로 여러 노드에 파티셔닝**
- 같은 키는 항상 같은 노드로 라우팅됨
- **주 목적**: 데이터 분산과 고가용성

#### 2. Redlock (여러 독립 Redis 인스턴스)
- **N개의 완전히 독립적인 Redis 마스터 필요**
- 각 인스턴스는 서로 복제되지 않고 독립적
- N개 인스턴스에서 순차적으로 락 획득 시도
- **과반수((N+1)/2) 이상에서 획득해야 성공**
- **주 목적**: 분산 락의 안정성과 내결함성

### 주의사항: Redis Cluster는 Redlock과 호환되지 않음

Redis Cluster를 사용하면 Redlock의 분산 락 목적을 달성할 수 없습니다:

```typescript
// ❌ 잘못된 방법 - 이렇게 하면 안됨
RedisModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (configService: ConfigService<EnvConfig, true>) => ({
        type: 'cluster',  // ❌ 모든 락 키가 같은 노드로 라우팅됨
        nodes: [
            { url: configService.get<string>('REDIS_URL_1') },
            { url: configService.get<string>('REDIS_URL_2') },
            { url: configService.get<string>('REDIS_URL_3') },
        ],
    }),
})
```

**문제점**:
- 모든 락 키가 클러스터 내 같은 노드로 라우팅됨
- Redlock의 분산 락 목적을 달성할 수 없음
- 단일 실패점(Single Point of Failure) 문제 발생

### 올바른 Redlock 설정 방법

3개의 독립적인 Redis 인스턴스를 사용하는 경우:

```typescript
import Redis from 'ioredis';

// 환경변수에 3개의 Redis URL 추가
// REDIS_URL_1=redis://localhost:6379
// REDIS_URL_2=redis://localhost:6380
// REDIS_URL_3=redis://localhost:6381

// 1. 독립적인 Redis 인스턴스 생성을 위한 Provider들
const REDIS_CLIENT_1 = 'REDIS_CLIENT_1';
const REDIS_CLIENT_2 = 'REDIS_CLIENT_2';
const REDIS_CLIENT_3 = 'REDIS_CLIENT_3';

// providers 배열에 추가:
{
    provide: REDIS_CLIENT_1,
    inject: [ConfigService],
    useFactory: (configService: ConfigService<EnvConfig, true>) => {
        return new Redis(configService.get<string>('REDIS_URL_1'));
    },
},
{
    provide: REDIS_CLIENT_2,
    inject: [ConfigService],
    useFactory: (configService: ConfigService<EnvConfig, true>) => {
        return new Redis(configService.get<string>('REDIS_URL_2'));
    },
},
{
    provide: REDIS_CLIENT_3,
    inject: [ConfigService],
    useFactory: (configService: ConfigService<EnvConfig, true>) => {
        return new Redis(configService.get<string>('REDIS_URL_3'));
    },
},

// 2. Redlock provider - 3개 모두 주입
{
    provide: RED_LOCK,
    inject: [REDIS_CLIENT_1, REDIS_CLIENT_2, REDIS_CLIENT_3],
    useFactory: (redis1: Redis, redis2: Redis, redis3: Redis) => {
        return new Redlock([redis1, redis2, redis3], {
            retryCount: DEFAULT_LOCK_MAX_RETRIES,
            retryDelay: DEFAULT_LOCK_BASE_DELAY,
        });
    },
}
```

### 단일 Redis 인스턴스 사용 (현재 설정)

단순히 효율성 목적으로만 락을 사용하는 경우:

```typescript
// ✅ 현재 프로젝트 설정
RedisModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (configService: ConfigService<EnvConfig, true>) => ({
        type: 'single',  // 단일 Redis 인스턴스
        url: configService.get<string>('REDIS_URL'),
    }),
}),

// Redlock provider
{
    provide: RED_LOCK,
    inject: [getRedisConnectionToken()],  // 기본 Redis 인스턴스 주입
    useFactory: (redis: Redis) => {
        return new Redlock([redis], {
            retryCount: DEFAULT_LOCK_MAX_RETRIES,
            retryDelay: DEFAULT_LOCK_BASE_DELAY,
        });
    },
},
```

**단일 인스턴스가 적절한 경우**:
- 효율성 목적으로만 락을 사용
- Redlock의 복잡성과 비용이 불필요
- 필요시 비동기 복제를 통한 백업으로 충분

### 결론

- **Redis Cluster**로 변경하면 Redlock이 제대로 작동하지 않음
- **독립적인 여러 Redis 인스턴스**를 따로 설정해야 Redlock의 분산 락 목적 달성 가능
- 단순한 사용 사례에서는 **단일 인스턴스**가 더 효율적

## tips
- app도 컨테이너, db도 컨테이너로 실행하면 다음 설정처럼 해야함.
- host.docker.internal

```dotenv
DATABASE_URL={db}://{id}:{password}@host.docker.internal:{port}/{schema}
```