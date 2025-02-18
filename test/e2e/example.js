const stockRaceCondition = () => {
    const orderApi = 'http://localhost:3000/api/v2/orders';
    const orderData = {
        headers: {
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZW1iZXJJZCI6IjEiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3Mzk4NTc2MjQsImV4cCI6MTczOTg2NDgyNH0.O84C7affMgXmI2Z-XIgld9Ca-pi84IxzeoF31ucW3xk`,
            'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
            data: [
                {
                    itemId: '1',
                    quantity: 1,
                },
            ],
        }),
    };

    const requests = [];
    for (let i = 0; i < 300; i++) {
        const request = fetch(orderApi, orderData);
        requests.push(request);
    }
    const results = Promise.all(requests);

    results.then(async (results) => {
        const responses = await Promise.all(results.map((result) => result.json()));
        console.log(responses);
    });
};

stockRaceCondition();
