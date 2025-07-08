type Task<T> = () => Promise<T>;

export class PQueue {
    private readonly concurrency: number;
    private activeCount = 0;
    private queue: (() => void)[] = [];

    constructor(options: { concurrency: number }) {
        this.concurrency = options.concurrency;
    }

    public async add<T>(task: Task<T>): Promise<T> {
        if (this.activeCount >= this.concurrency) {
            await new Promise<void>((resolve) => this.queue.push(resolve));
        }

        this.activeCount++;

        try {
            return await task();
        } finally {
            this.activeCount--;
            this._next();
        }
    }

    private _next() {
        if (this.queue.length > 0 && this.activeCount < this.concurrency) {
            const resolve = this.queue.shift();
            if (resolve) resolve();
        }
    }

    public get pending(): number {
        return this.queue.length;
    }

    public get isIdle(): boolean {
        return this.activeCount === 0 && this.queue.length === 0;
    }
}
