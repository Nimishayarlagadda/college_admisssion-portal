import requests
import sys
import json
from datetime import datetime

class CollegeAdmissionAPITester:
    def __init__(self, base_url="https://admission-portal-22.preview.emergentagent.com"):
        self.base_url = base_url
        self.session = requests.Session()
        self.tests_run = 0
        self.tests_passed = 0
        self.admin_token = None
        self.student_token = None
        self.student_id = None
        self.application_id = None

    def log_test(self, name, success, details=""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        return success

    def make_request(self, method, endpoint, data=None, files=None, cookies=None, headers=None):
        """Make HTTP request with error handling"""
        url = f"{self.base_url}/api/{endpoint}"
        default_headers = {'Content-Type': 'application/json'}
        if headers:
            default_headers.update(headers)
        
        try:
            if method == 'GET':
                response = self.session.get(url, headers=default_headers, cookies=cookies)
            elif method == 'POST':
                if files:
                    # Remove Content-Type for file uploads
                    default_headers.pop('Content-Type', None)
                    response = self.session.post(url, data=data, files=files, headers=default_headers, cookies=cookies)
                else:
                    response = self.session.post(url, json=data, headers=default_headers, cookies=cookies)
            elif method == 'PATCH':
                response = self.session.patch(url, json=data, headers=default_headers, cookies=cookies)
            
            return response
        except Exception as e:
            print(f"Request error: {str(e)}")
            return None

    def test_admin_login(self):
        """Test admin login functionality"""
        print("\n🔍 Testing Admin Login...")
        
        response = self.make_request('POST', 'auth/login', {
            "email": "admin@college.edu",
            "password": "admin123"
        })
        
        if not response:
            return self.log_test("Admin Login", False, "Request failed")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('role') == 'admin':
                # Store cookies for future requests
                self.session.cookies.update(response.cookies)
                return self.log_test("Admin Login", True)
            else:
                return self.log_test("Admin Login", False, f"Wrong role: {data.get('role')}")
        else:
            return self.log_test("Admin Login", False, f"Status {response.status_code}: {response.text}")

    def test_student_registration(self):
        """Test student registration"""
        print("\n🔍 Testing Student Registration...")
        
        # Use timestamp to ensure unique email
        timestamp = datetime.now().strftime("%H%M%S")
        test_email = f"teststudent{timestamp}@test.com"
        
        response = self.make_request('POST', 'auth/register', {
            "email": test_email,
            "password": "student123",
            "name": "Test Student",
            "phone": "+1234567890"
        })
        
        if not response:
            return self.log_test("Student Registration", False, "Request failed")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('role') == 'student':
                self.student_id = data.get('id')
                # Store cookies for future requests
                self.session.cookies.update(response.cookies)
                return self.log_test("Student Registration", True)
            else:
                return self.log_test("Student Registration", False, f"Wrong role: {data.get('role')}")
        else:
            return self.log_test("Student Registration", False, f"Status {response.status_code}: {response.text}")

    def test_student_login(self):
        """Test student login with existing credentials"""
        print("\n🔍 Testing Student Login...")
        
        response = self.make_request('POST', 'auth/login', {
            "email": "student@test.com",
            "password": "student123"
        })
        
        if not response:
            return self.log_test("Student Login", False, "Request failed")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('role') == 'student':
                self.student_id = data.get('id')
                # Store cookies for future requests
                self.session.cookies.update(response.cookies)
                return self.log_test("Student Login", True)
            else:
                return self.log_test("Student Login", False, f"Wrong role: {data.get('role')}")
        else:
            return self.log_test("Student Login", False, f"Status {response.status_code}: {response.text}")

    def test_auth_me(self):
        """Test getting current user info"""
        print("\n🔍 Testing Auth Me...")
        
        response = self.make_request('GET', 'auth/me')
        
        if not response:
            return self.log_test("Auth Me", False, "Request failed")
        
        if response.status_code == 200:
            data = response.json()
            if 'email' in data and 'role' in data:
                return self.log_test("Auth Me", True)
            else:
                return self.log_test("Auth Me", False, "Missing required fields")
        else:
            return self.log_test("Auth Me", False, f"Status {response.status_code}: {response.text}")

    def test_create_application(self):
        """Test creating a student application"""
        print("\n🔍 Testing Create Application...")
        
        application_data = {
            "first_name": "Test",
            "last_name": "Student",
            "email": "teststudent@test.com",
            "phone": "+1234567890",
            "date_of_birth": "2000-01-01",
            "address": "123 Test St",
            "city": "Test City",
            "state": "TS",
            "zip_code": "12345",
            "country": "USA",
            "high_school": "Test High School",
            "gpa": 3.8,
            "graduation_year": 2024,
            "intended_major": "Computer Science",
            "essay": "This is a test essay for my college application. I am passionate about computer science and want to pursue my dreams at this institution."
        }
        
        response = self.make_request('POST', 'applications', application_data)
        
        if not response:
            return self.log_test("Create Application", False, "Request failed")
        
        if response.status_code == 200:
            data = response.json()
            if 'id' in data and data.get('status') == 'submitted':
                self.application_id = data.get('id')
                return self.log_test("Create Application", True)
            else:
                return self.log_test("Create Application", False, "Missing required fields or wrong status")
        else:
            return self.log_test("Create Application", False, f"Status {response.status_code}: {response.text}")

    def test_get_my_application(self):
        """Test getting student's own application"""
        print("\n🔍 Testing Get My Application...")
        
        response = self.make_request('GET', 'applications/me')
        
        if not response:
            return self.log_test("Get My Application", False, "Request failed")
        
        if response.status_code == 200:
            data = response.json()
            if data and 'id' in data:
                return self.log_test("Get My Application", True)
            elif data is None:
                return self.log_test("Get My Application", True, "No application found (expected)")
            else:
                return self.log_test("Get My Application", False, "Invalid response format")
        else:
            return self.log_test("Get My Application", False, f"Status {response.status_code}: {response.text}")

    def test_admin_get_all_applications(self):
        """Test admin getting all applications"""
        print("\n🔍 Testing Admin Get All Applications...")
        
        # First login as admin
        admin_response = self.make_request('POST', 'auth/login', {
            "email": "admin@college.edu",
            "password": "admin123"
        })
        
        if not admin_response or admin_response.status_code != 200:
            return self.log_test("Admin Get All Applications", False, "Admin login failed")
        
        # Update session with admin cookies
        self.session.cookies.update(admin_response.cookies)
        
        response = self.make_request('GET', 'applications')
        
        if not response:
            return self.log_test("Admin Get All Applications", False, "Request failed")
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                return self.log_test("Admin Get All Applications", True)
            else:
                return self.log_test("Admin Get All Applications", False, "Response is not a list")
        else:
            return self.log_test("Admin Get All Applications", False, f"Status {response.status_code}: {response.text}")

    def test_admin_update_application_status(self):
        """Test admin updating application status"""
        print("\n🔍 Testing Admin Update Application Status...")
        
        if not self.application_id:
            return self.log_test("Admin Update Application Status", False, "No application ID available")
        
        response = self.make_request('PATCH', f'applications/{self.application_id}', {
            "status": "under_review"
        })
        
        if not response:
            return self.log_test("Admin Update Application Status", False, "Request failed")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('status') == 'under_review':
                return self.log_test("Admin Update Application Status", True)
            else:
                return self.log_test("Admin Update Application Status", False, f"Status not updated: {data.get('status')}")
        else:
            return self.log_test("Admin Update Application Status", False, f"Status {response.status_code}: {response.text}")

    def test_document_upload_without_application(self):
        """Test document upload without application (should fail)"""
        print("\n🔍 Testing Document Upload Without Application...")
        
        # Login as a new student without application
        timestamp = datetime.now().strftime("%H%M%S")
        test_email = f"nodocstudent{timestamp}@test.com"
        
        reg_response = self.make_request('POST', 'auth/register', {
            "email": test_email,
            "password": "student123",
            "name": "No Doc Student",
            "phone": "+1234567890"
        })
        
        if not reg_response or reg_response.status_code != 200:
            return self.log_test("Document Upload Without Application", False, "Student registration failed")
        
        # Update session with new student cookies
        self.session.cookies.update(reg_response.cookies)
        
        # Try to upload document
        files = {'file': ('test.txt', 'Test document content', 'text/plain')}
        response = self.make_request('POST', 'documents/upload?document_type=transcript', 
                                   data={}, files=files, headers={})
        
        if not response:
            return self.log_test("Document Upload Without Application", False, "Request failed")
        
        if response.status_code == 400:
            return self.log_test("Document Upload Without Application", True, "Correctly rejected upload without application")
        else:
            return self.log_test("Document Upload Without Application", False, f"Expected 400, got {response.status_code}")

    def test_logout(self):
        """Test logout functionality"""
        print("\n🔍 Testing Logout...")
        
        response = self.make_request('POST', 'auth/logout')
        
        if not response:
            return self.log_test("Logout", False, "Request failed")
        
        if response.status_code == 200:
            return self.log_test("Logout", True)
        else:
            return self.log_test("Logout", False, f"Status {response.status_code}: {response.text}")

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting College Admission Portal API Tests")
        print(f"Testing against: {self.base_url}")
        print("=" * 60)
        
        # Test authentication flows
        self.test_admin_login()
        self.test_student_registration()
        self.test_auth_me()
        
        # Test application flows
        self.test_create_application()
        self.test_get_my_application()
        
        # Test admin functions
        self.test_admin_get_all_applications()
        self.test_admin_update_application_status()
        
        # Test document upload restrictions
        self.test_document_upload_without_application()
        
        # Test logout
        self.test_logout()
        
        # Test existing student login
        self.test_student_login()
        
        # Print summary
        print("\n" + "=" * 60)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print("⚠️  Some tests failed!")
            return 1

def main():
    tester = CollegeAdmissionAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())