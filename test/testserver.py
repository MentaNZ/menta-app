import os
import sys
import time
import json
import subprocess
from concurrent.futures import ThreadPoolExecutor
import requests

dbpath = "../../TEMPDB"
apipath = "../backend"
abs_dbpath = os.path.abspath(dbpath)
abs_apipath = os.path.abspath(apipath)


class TestServer():
    def __init__(self, db, api):
        setup_commands = [
            "mongod --dbpath {}".format(db),
            "(cd {} && nodemon src/index.js)".format(api)
        ]

        with ThreadPoolExecutor(max_workers=12) as executor:
            executor.map(self.exe_cmd, setup_commands)

    def exe_cmd(self, command):
        subprocess.run(command, shell=True)


def main():
    TestServer(abs_dbpath, abs_apipath)


if __name__ == "__main__":
    main()
