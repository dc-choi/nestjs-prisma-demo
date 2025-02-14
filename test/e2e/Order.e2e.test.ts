const stockRaceCondition = () => {
    const orderApi = "http://localhost:3000/v1/orders";

    const request1 = fetch(orderApi);
    const request2 = fetch(orderApi);
    const request3 = fetch(orderApi);
    const request4 = fetch(orderApi);
    const results = Promise.all([request1, request2, request3, request4]);

    results.then(async (results) => {
        const resource1 = await results[0].json();
        const resource2 = await results[1].json();
        const resource3 = await results[2].json();
        const resource4 = await results[3].json();

        console.log(resource1);
        console.log(resource2);
        console.log(resource3);
        console.log(resource4);
    });
};

stockRaceCondition();
