# Бэкенд сайта для бронирования котов

В этой ветке репозитория реализован сервер сайта. Сервер реализует REST API для управления котами, пользователями и бронированиями. Большинство функциональных кнопок на сайте требуют запросов к серверу и базе данных.

**Технологический стек:**
- C++17
- Drogon
- SQLite3
- OpenSSL
- JSON

## Требования

- CMake 3.10+
- C++ 17
- SQLite3
- OpenSSL
- Drogon
- Jsoncpp

## Пример установки зависимостей

### Windows

```bash
git clone https://github.com/microsoft/vcpkg.git
cd vcpkg
.\bootstrap-vcpkg.bat
.\vcpkg install drogon sqlite3 openssl jsoncpp
```
### Linux
```bash
sudo apt-get update
sudo apt-get install build-essential cmake libsqlite3-dev libssl-dev libjsoncpp-dev
git clone https://github.com/drogonframework/drogon.git
cd drogon
mkdir build && cd build
cmake .. && make && sudo make install
```

## Сборка
```bash
mkdir build
cd build
cmake ..
cmake --build . --config Release
```
## Запуск
```bash
#Windows
cd build
SPO_1.exe

#linux
cd build
./SPO_1
```

## API Endpoints

### Взаимодействие с пользователем

| Метод | Endpoint | Описание |
|-------|----------|----------|
| POST | `/register` | Регистрация пользователя |
| POST | `/login` | Авторизация |
| GET | `/profile` | Получение профиля |
| POST | `/logout` | Выход из системы |

### Действия с котами

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/cats` | Получить всех котов |
| POST | `/cats` | Создать кота |
| PUT | `/cats/{id}` | Обновить данные кота |

### Действия с бронированиями

| Метод | Endpoint | Описание |
|-------|----------|----------|
| POST | `/bookings` | Создать бронирование |

### Действия в Админ панели

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/bookings/admin` | Получить все бронирования |
| POST | `/bookings/admin` | Создать бронирование для пользователя |
| PUT | `/bookings/admin` | Подтвердить бронирование |
| DELETE | `/bookings/admin` | Отклонить бронирование |
| PUT | `/bookings/admin/edit` | Редактировать бронирование |
| GET | `/admin/users` | Получить всех пользователей |
| POST | `/admin/register` | Создать пользователя вручную |