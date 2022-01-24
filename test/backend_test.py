import os
import sys
import time
import json
import requests
import subprocess
from concurrent.futures import ThreadPoolExecutor
from testserver import TestServer, abs_dbpath, abs_apipath
import random
import string
from menta_client import MentaClient


class TestUser():
    def __init__(self, email, pwd, client):
        self.email = email
        self.pwd = pwd
        self.client = client

    def __str__(self):
        return str(self.email)


def random_string(len):
    return ''.join(random.choice(string.ascii_letters) for _ in range(len))


def day_sim(new_users, client):
    """
    Simulate a typical heavy day
    x new users, .6x logins, .1x updates, .1x deletes
    """

    NEW_USERS = new_users
    testPool = []
    for i in range(NEW_USERS):
        testPool.append(TestUser(random_string(
            8) + '@gmail.com', random_string(8), client))

    for user in testPool:
        print(user.client.create_user(user.email, user.pwd))

    for login in range(int(NEW_USERS * .6)):
        user = random.choice(testPool)
        print(user.client.login_user(user.email, user.pwd))

    for update in range(int(NEW_USERS * .1)):
        user = random.choice(testPool)
        user.pwd = random_string(8)
        print(user.client.update_user(user.email, user.pwd))

    for delete in range(int(NEW_USERS * .1)):
        user = random.choice(testPool)
        print(user.client.delete_user(user.email))
        testPool.remove(user)

    # Cleanup
    for user in testPool:
        print(user.client.delete_user(user.email))


start = time.time()
new_users = 1000
client = MentaClient("http://localhost:5000/api/v1")
day_sim(new_users, client)
finish = time.time()
print("{} user day took {} client seconds".format(new_users, finish - start))
