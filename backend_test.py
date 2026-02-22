import requests
import json
import sys
from datetime import datetime, timezone, timedelta

class SpectrumUniteAPITester:
    def __init__(self, base_url="https://spectrum-unite.preview.emergentagent.com"):
        self.base_url = f"{base_url}/api"
        self.token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def log_test(self, name, success, response_data=None, error=None):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            self.failed_tests.append({
                'name': name,
                'error': error,
                'response': response_data
            })
            print(f"❌ {name} - FAILED: {error}")

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}{endpoint}"
        request_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            request_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            request_headers.update(headers)

        try:
            if method == 'GET':
                response = requests.get(url, headers=request_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=request_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=request_headers, timeout=10)

            success = response.status_code == expected_status
            response_data = None
            
            try:
                response_data = response.json()
            except:
                response_data = response.text

            self.log_test(name, success, response_data, 
                         f"Expected {expected_status}, got {response.status_code}")

            return success, response_data

        except Exception as e:
            self.log_test(name, False, None, str(e))
            return False, {}

    def test_health_check(self):
        """Test basic API health"""
        return self.run_test("API Health Check", "GET", "/", 200)

    def test_stats(self):
        """Test stats endpoint"""
        return self.run_test("Get Stats", "GET", "/stats", 200)

    def test_user_registration(self):
        """Test user registration"""
        timestamp = datetime.now().strftime("%H%M%S")
        test_user = {
            "email": f"testuser{timestamp}@example.com",
            "password": "TestPass123!",
            "name": "Test User",
            "user_type": "individual",
            "disability_categories": ["physical", "cognitive"],
            "location": "Test City, Test Country"
        }
        
        success, response = self.run_test("User Registration", "POST", "/auth/register", 200, test_user)
        
        if success and 'token' in response:
            self.token = response['token']
            self.user_id = response['user']['id']
            return True
        return False

    def test_user_login(self):
        """Test login with existing test user"""
        login_data = {
            "email": "test@example.com",
            "password": "password123"
        }
        
        success, response = self.run_test("User Login", "POST", "/auth/login", 200, login_data)
        
        if success and 'token' in response:
            self.token = response['token']
            self.user_id = response['user']['id']
            return True
        return False

    def test_auth_me(self):
        """Test get current user"""
        return self.run_test("Get Current User", "GET", "/auth/me", 200)

    def test_users_list(self):
        """Test get users list"""
        return self.run_test("Get Users List", "GET", "/users", 200)

    def test_forum_operations(self):
        """Test forum CRUD operations"""
        # Create post
        post_data = {
            "title": "Test Forum Post",
            "content": "This is a test post content for API testing",
            "category": "general",
            "tags": ["test", "api"]
        }
        
        success, post_response = self.run_test("Create Forum Post", "POST", "/forums", 200, post_data)
        
        if success and 'id' in post_response:
            post_id = post_response['id']
            
            # Get posts
            self.run_test("Get Forum Posts", "GET", "/forums", 200)
            
            # Get specific post
            self.run_test("Get Specific Post", "GET", f"/forums/{post_id}", 200)
            
            # Like post
            self.run_test("Like Post", "POST", f"/forums/{post_id}/like", 200)
            
            # Create comment
            comment_data = {"content": "Test comment on the post"}
            success, comment_response = self.run_test("Create Comment", "POST", f"/forums/{post_id}/comments", 200, comment_data)
            
            # Get comments
            self.run_test("Get Comments", "GET", f"/forums/{post_id}/comments", 200)
            
            return True
        return False

    def test_service_provider_operations(self):
        """Test service provider CRUD"""
        provider_data = {
            "name": "Test Provider Organization",
            "description": "A test service provider for API testing",
            "services": ["Healthcare", "Therapy", "Support Groups"],
            "disability_focus": ["physical", "cognitive"],
            "location": "Test City, Test Country",
            "website": "https://testprovider.com",
            "email": "contact@testprovider.com",
            "phone": "+1-555-0123"
        }
        
        success, provider_response = self.run_test("Create Provider", "POST", "/providers", 200, provider_data)
        
        if success and 'id' in provider_response:
            provider_id = provider_response['id']
            
            # Get providers
            self.run_test("Get Providers", "GET", "/providers", 200)
            
            # Get specific provider
            self.run_test("Get Specific Provider", "GET", f"/providers/{provider_id}", 200)
            
            return True
        return False

    def test_event_operations(self):
        """Test event CRUD operations"""
        future_date = (datetime.now(timezone.utc) + timedelta(days=7)).isoformat()
        
        event_data = {
            "title": "Test Community Event",
            "description": "A test event for API testing",
            "event_type": "workshop",
            "location": "Test Venue, Test City",
            "is_virtual": False,
            "start_date": future_date,
            "accessibility_features": ["Wheelchair Accessible", "Sign Language Interpreter"]
        }
        
        success, event_response = self.run_test("Create Event", "POST", "/events", 200, event_data)
        
        if success and 'id' in event_response:
            event_id = event_response['id']
            
            # Get events
            self.run_test("Get Events", "GET", "/events", 200)
            
            # Get specific event
            self.run_test("Get Specific Event", "GET", f"/events/{event_id}", 200)
            
            # Attend event
            self.run_test("Attend Event", "POST", f"/events/{event_id}/attend", 200)
            
            return True
        return False

    def test_resource_operations(self):
        """Test resource CRUD operations"""
        resource_data = {
            "title": "Test Resource",
            "description": "A test resource for API testing",
            "category": "guides",
            "url": "https://example.com/test-resource",
            "tags": ["test", "api", "guide"]
        }
        
        success, resource_response = self.run_test("Create Resource", "POST", "/resources", 200, resource_data)
        
        if success and 'id' in resource_response:
            resource_id = resource_response['id']
            
            # Get resources
            self.run_test("Get Resources", "GET", "/resources", 200)
            
            # Get specific resource
            self.run_test("Get Specific Resource", "GET", f"/resources/{resource_id}", 200)
            
            return True
        return False

    def test_message_operations(self):
        """Test messaging functionality"""
        # First, get users to find someone to message
        success, users_response = self.run_test("Get Users for Messaging", "GET", "/users?limit=5", 200)
        
        if success and isinstance(users_response, list) and len(users_response) > 0:
            # Find a user that's not the current user
            recipient = None
            for user in users_response:
                if user['id'] != self.user_id:
                    recipient = user
                    break
            
            if recipient:
                message_data = {
                    "recipient_id": recipient['id'],
                    "content": "Test message for API testing"
                }
                
                success, message_response = self.run_test("Send Message", "POST", "/messages", 200, message_data)
                
                if success:
                    # Get conversations
                    self.run_test("Get Conversations", "GET", "/messages/conversations", 200)
                    
                    # Get messages with user
                    self.run_test("Get Messages with User", "GET", f"/messages/{recipient['id']}", 200)
                    
                    return True
        return False

    def run_comprehensive_test(self):
        """Run all tests in sequence"""
        print("🚀 Starting Spectrum Unite API Comprehensive Test")
        print("=" * 60)
        
        # Basic health checks
        self.test_health_check()
        self.test_stats()
        
        # Authentication tests
        if not self.test_user_login():
            print("❌ Cannot continue without authentication")
            return False
            
        self.test_auth_me()
        self.test_users_list()
        
        # Feature tests
        self.test_forum_operations()
        self.test_service_provider_operations()
        self.test_event_operations()
        self.test_resource_operations()
        self.test_message_operations()
        
        # Print results
        print("=" * 60)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        
        if self.failed_tests:
            print("\n❌ Failed Tests:")
            for test in self.failed_tests:
                print(f"  - {test['name']}: {test['error']}")
        
        success_rate = (self.tests_passed / self.tests_run) * 100 if self.tests_run > 0 else 0
        print(f"✨ Success Rate: {success_rate:.1f}%")
        
        return success_rate > 80

def main():
    tester = SpectrumUniteAPITester()
    success = tester.run_comprehensive_test()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())