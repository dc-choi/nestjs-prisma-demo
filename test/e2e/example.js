const stockRaceCondition = () => {
    const orderApi = 'http://localhost:3000/api/v3/orders';
    const orderData = {
        headers: {
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZW1iZXJJZCI6IjEiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NTE4ODMzNDQsImV4cCI6MTc1MTg5MDU0NH0.lRk3zIFY6iYY8jnLDoG0gSTm3hinIKiDhPB8wnhE6yw`,
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
