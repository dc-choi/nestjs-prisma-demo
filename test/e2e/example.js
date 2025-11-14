const stockRaceCondition = () => {
    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZW1iZXJJZCI6IjEiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NjMwOTE3MDIsImV4cCI6MTc2MzA5ODkwMn0.FdT7OB7iqC3zHZC_CosuT_v8B8aCda_1dp7cLDkUE-c`;
    const orderApi = 'http://localhost:3000/api/v2/orders';
    const orderData = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
            data: [
                {
                    itemId: '56',
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
