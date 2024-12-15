/*
GET: cinemas.get_all
RESPONSE:
[
    {
        id: 1,
        name: "Cinema 1",
        color: "#a1aa50",
        halls: [
            {
                id: 1,
                name: "Hall 1",
                seatsCount: 15
            },
            {...},
            {...},
            {...}
        ]
    }
]

GET: halls.get_hall_plan/1
{
    id: 1,
    name: "Hall 1",
    canvas: {
        width: 100,
        height: 100,
    },
    rows: 3,
    places: 5,
    seats: [
        {
            id: 1,
            seatType: 1,
            row: 1,
            place: 1,
            x: 1,
            y: 1,
            width: 30,
            height: 30,
            rotation: 0,
            status: "free",
        },
        {...},
        {...},
    ]
}

GET: seat_types.get_all
[
{
    "id": 342,
    "name": "Место",
    "ticketTypes": [
        {
            "id": 1,
            "name": "Взрослый",
            "price": 610
        }
    ]
    },
    {
    "id": 2542,
    "name": "Комфорт",
    "ticketTypes": [
        {
            "id": 1,
            "name": "Взрослый",
            "price": 640
        }
    ]
}
]
*/
