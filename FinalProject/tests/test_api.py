import unittest
import requests

print("Starting the test")
BASE_URL = "http://localhost:3000/api"

class TestCostTrackerAPI(unittest.TestCase):
    def test_add_cost(self):
        response = requests.post(f"{BASE_URL}/add", json={
            "description": "Python Book",
            "category": "education",
            "userid": 123123,
            "sum": 120
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["description"], "Python Book")

    def test_get_report(self):
        response = requests.get(f"{BASE_URL}/report", params={
            "id": 123123,
            "year": "2025",
            "month": "5"
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["userid"], 123123)

    def test_get_user_details(self):
        response = requests.get(f"{BASE_URL}/users/123123")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["first_name"], "mosh")
        self.assertIn("total", response.json())

    def test_get_about(self):
        response = requests.get(f"{BASE_URL}/about")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(isinstance(response.json(), list))
        self.assertIn("first_name", response.json()[0])

if __name__ == "__main__":
    unittest.main()