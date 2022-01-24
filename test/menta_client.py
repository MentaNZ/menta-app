import requests
import json


class MentaClient():
    def __init__(self, endpoint):
        self.endpoint = endpoint

    # User ops
    def create_user(self, email, pwd):
        url = "{}/user/create".format(self.endpoint)

        payload = json.dumps({
            "email": email,
            "pwd": pwd
        })
        headers = {
            'Content-Type': 'application/json'
        }

        response = requests.request("PUT", url, headers=headers, data=payload)
        return (response.text)

    def login_user(self, email, pwd):
        url = "{}/user/login".format(self.endpoint)

        payload = json.dumps({
            "email": email,
            "pwd": pwd
        })
        headers = {
            'Content-Type': 'application/json'
        }

        response = requests.request("POST", url, headers=headers, data=payload)

        return (response.text)

    def update_user(self, email, newPwd):

        url = "{}/user/update".format(self.endpoint)

        payload = json.dumps({
            "email": email,
            "pwd": newPwd
        })
        headers = {
            'Content-Type': 'application/json'
        }

        response = requests.request("POST", url, headers=headers, data=payload)

        return (response.text)

    def delete_user(self, email):

        url = "{}/user/delete".format(self.endpoint)

        payload = json.dumps({
            "email": email
        })
        headers = {
            'Content-Type': 'application/json'
        }

        response = requests.request("POST", url, headers=headers, data=payload)

        return (response.text)

    # Flashcard ops
    def get_deck(self, deck):

        url = "{}/flashcard/deck".format(self.endpoint)
        payload = json.dumps({
            "deck": deck
        })
        headers = {
            'Content-Type': 'application/json'
        }
        response = requests.request(
            "POST", url, headers=headers, data=payload)

        return json.loads(response.text)

    def get_log(self, deck):

        url = "{}/decklog/last-changed".format(self.endpoint)

        payload = json.dumps({
            "deck":  deck
        })
        headers = {
            'Content-Type': 'application/json'
        }

        response = requests.request("POST", url, headers=headers, data=payload)

        return json.loads(response.text)


def test():
    test = MentaClient("http://localhost:5000/api/v1")
    deck = "NZ-year_10-maths"
    print(test.get_deck(deck))
    print(test.get_log(deck))
