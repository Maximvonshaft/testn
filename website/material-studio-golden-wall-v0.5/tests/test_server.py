import unittest

from server import LeadValidationError, validate_lead


class LeadValidationTests(unittest.TestCase):
    def test_rejects_missing_required_fields(self):
        with self.assertRaises(LeadValidationError):
            validate_lead({'name': 'Max'})

    def test_normalizes_valid_lead(self):
        lead = validate_lead({
            'name': ' Max ',
            'company': ' Studio ',
            'email': 'MAX@example.com ',
            'requestType': 'quote',
            'configurationCode': 'MS-TEST',
        })
        self.assertEqual(lead['name'], 'Max')
        self.assertEqual(lead['company'], 'Studio')
        self.assertEqual(lead['email'], 'max@example.com')
        self.assertEqual(lead['requestType'], 'quote')


if __name__ == '__main__':
    unittest.main()
