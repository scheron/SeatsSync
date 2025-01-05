auth/
├── user/                      # Все, что связано с пользователями
│   ├── model.ts               # Работа с базой данных (CRUD для пользователей)
│   ├── service.ts             # Бизнес-логика для пользователей (login, updateUser)
│   └── types.ts               # Типы, относящиеся к пользователям
├── candidate/                 # Все, что связано с кандидатами
│   ├── model.ts               # Работа с "кандидатами" в памяти
│   ├── service.ts             # Логика валидации и регистрации кандидатов
│   └── types.ts               # Типы, относящиеся к кандидатам
├── shared/                    # Общие функции и типы
│   ├── jwt.ts                 # Работа с JWT токенами
│   ├── validators.ts          # Общие функции валидации
│   ├── types.ts               # Общие типы для `auth`
│   └── utils.ts               # Утилиты для работы с auth
├── http/                      # HTTP-обработчики и роуты
│   ├── controller.ts          # HTTP-контроллеры для auth
│   ├── routes.ts              # Роуты HTTP для auth
├── ws/                        # WebSocket-обработчики
│   ├── handlers.ts            # WebSocket-обработчики для auth
│   ├── middleware.ts          # Проверка токенов и контекста WebSocket
│   └── types.ts               # WebSocket-типизация для auth
└── index.ts                   # Баррель файл