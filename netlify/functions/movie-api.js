// netlify/functions/movie-api.js

exports.handler = async (event, context) => {
    const { query } = JSON.parse(event.body);  // Получаем запрос из тела POST-запроса

    if (!query) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Query is required!' })
        };
    }

    try {
        // Получаем ключ из переменных окружения
        const apiKey = process.env.API_KEY;

        // Отправляем запрос на API
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`  // Используем API-ключ
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "user",
                        content: `Find me a movie based on this description: ${query}`
                    }
                ]
            })
        });

        const data = await response.json();
        
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error fetching data from API', error: error.message })
        };
    }
};
