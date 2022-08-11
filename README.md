`npm start`

```
curl --location --request POST 'localhost:8080' \
--header 'Content-Type: application/json' \
--data-raw '[
    {
        "image": "https://cataas.com/cat?type=sq",
        "name": "Cat"
    },
    {
        "image": "https://cataas.com/cat?type=sq",
        "name": "Cat"
    },
    {
        "image": "https://cataas.com/cat?type=sq",
        "name": "Cat"
    },
    {
        "image": "https://cataas.com/cat?type=sq",
        "name": "Cat"
    },
    {
        "image": "https://cataas.com/cat?type=sq",
        "name": "Cat"
    }
]'
```
