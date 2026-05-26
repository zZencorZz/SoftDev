from fastapi import status

class MainException(Exception):
    status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR
    default_message: str = "Ошибка"

    def __init__(self, message: str = None):
        if message:
            self.message = message
        else:
            self.message = self.default_message
        super().__init__(self.message)

class DatabaseException(MainException):
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    default_message = "Ошибка базы данных"

class UniqueException(DatabaseException):
    status_code = status.HTTP_409_CONFLICT
    default_message = "Такая запись уже существует"
    MAPPING = {
        "users.username": "Этот логин уже занят",
        "users.email": "Пользователь с такой почтой уже есть",
    }

    def __init__(self, constraint_name: str = None):
        message = self.MAPPING.get(constraint_name, self.default_message)
        super().__init__(message)

class AuthException(MainException):
    status_code = status.HTTP_401_UNAUTHORIZED
    default_message = "Неавторизованный доступ"

class NotFoundException(MainException):
    status_code = status.HTTP_404_NOT_FOUND
    default_message = "Ресурс не найден"
    MAPPING = {
        "User": "Пользователь не найден",
        "Project": "Проект не найден",
        "Review": "Отзыв не найден",
        "Transaction": "Транзакция не найдена",
        "Message": "Сообщение не найдено",
    }

    def __init__(self, model_name: str = None):
        message = self.MAPPING.get(model_name, self.default_message)
        super().__init__(message)

class ForbiddenException(AuthException):
    status_code = status.HTTP_403_FORBIDDEN
    default_message = "У вас недостаточно прав"