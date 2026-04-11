users = {}


def create_user(username, password):
    users[username] = {"password": password}
    return True


def authenticate(username, password):
    user = users.get(username)
    if not user or user["password"] != password:
        return False
    return True
