import { useState } from 'react';
import { User, Shield, HandHeart, Users, ShieldAlert, ArrowLeft, Loader2 } from 'lucide-react';
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import './index.css';

function App() {
  const [activeView, setActiveView] = useState('selection');
  
  // State for forms and feedback
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const navTo = (view) => {
    setFormData({}); // Reset form
    setActiveView(view);
  };

  const handleLogin = async (e, type) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      navTo('dashboard');
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  };

  const handleSignup = async (e, type) => {
    e.preventDefault();
    if(formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const uid = userCredential.user.uid;
      
      const { password, confirmPassword, agreeTerms, ...dataToSave } = formData;
      await set(ref(db, `${type}s/${uid}`), { ...dataToSave, role: type });
      
      navTo('dashboard');
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="app-container">
      <div className="background-overlay"></div>

      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="logo-container">
          <ShieldAlert className="logo-icon" size={28} />
          <span className="logo-text">CRISIS<span className="logo-text-bold">CONNECT</span></span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="login-card">
          
          {/* Main Login Selection */}
          {activeView === 'selection' && (
            <>
              <h1 className="title">WELCOME TO<br/>CRISIS CONNECT</h1>
              <p className="subtitle">SELECT YOUR ACCESS LEVEL</p>

              <div className="login-options">
                <button className="login-option" onClick={() => navTo('userLogin')}>
                  <div className="option-icon-container">
                    <User className="option-icon" size={24} />
                    <Shield className="option-icon-badge" size={14} />
                  </div>
                  <div className="option-text">
                    <h2>LOGIN AS USER</h2>
                    <p>Access personal aid, resources, and local alerts</p>
                  </div>
                </button>

                <button className="login-option" onClick={() => navTo('volunteerLogin')}>
                  <div className="option-icon-container">
                    <HandHeart className="option-icon" size={24} />
                  </div>
                  <div className="option-text">
                    <h2>LOGIN AS VOLUNTEER</h2>
                    <p>Respond to requests, collaborate, and volunteer efforts</p>
                  </div>
                </button>

                <button className="login-option" onClick={() => navTo('ngoLogin')}>
                  <div className="option-icon-container">
                    <Users className="option-icon" size={24} />
                  </div>
                  <div className="option-text">
                    <h2>LOGIN AS NGO</h2>
                    <p>Manage response teams, analyze data, and coordinate aid</p>
                  </div>
                </button>
              </div>

              <div className="card-footer">
                <p className="help-links">
                  <a href="#" onClick={(e) => { e.preventDefault(); navTo('help'); }}>Need help logging in?</a>
                </p>
                <p className="signup-link">
                  New? <a href="#" className="signup-text" onClick={(e) => { e.preventDefault(); navTo('signupSelection'); }}>SIGN UP</a>
                </p>
              </div>
            </>
          )}

          {/* Signup Selection */}
          {activeView === 'signupSelection' && (
            <>
              <button className="back-btn" onClick={() => navTo('selection')}>
                <ArrowLeft size={18} />
                <span>Back to Login</span>
              </button>
              
              <h1 className="title" style={{marginTop: '0.5rem'}}>CREATE AN<br/>ACCOUNT</h1>
              <p className="subtitle">SELECT YOUR REGISTRATION TYPE</p>

              <div className="login-options">
                <button className="login-option" onClick={() => navTo('userSignup')}>
                  <div className="option-icon-container">
                    <User className="option-icon" size={24} />
                    <Shield className="option-icon-badge" size={14} />
                  </div>
                  <div className="option-text">
                    <h2>REGISTER AS USER</h2>
                    <p>Sign up to request aid and receive alerts</p>
                  </div>
                </button>

                <button className="login-option" onClick={() => navTo('volunteerSignup')}>
                  <div className="option-icon-container">
                    <HandHeart className="option-icon" size={24} />
                  </div>
                  <div className="option-text">
                    <h2>REGISTER AS VOLUNTEER</h2>
                    <p>Join the force to help those in need</p>
                  </div>
                </button>

                <button className="login-option" onClick={() => navTo('ngoSignup')}>
                  <div className="option-icon-container">
                    <Users className="option-icon" size={24} />
                  </div>
                  <div className="option-text">
                    <h2>REGISTER AS NGO</h2>
                    <p>Register your organization to coordinate aid</p>
                  </div>
                </button>
              </div>
            </>
          )}

          {/* User Login Form */}
          {activeView === 'userLogin' && (
            <div className="form-container">
              <button className="back-btn" onClick={() => navTo('selection')}>
                <ArrowLeft size={18} />
                <span>Back</span>
              </button>
              <h1 className="title">User Login</h1>
              <form className="login-form scrollable-form" onSubmit={(e) => handleLogin(e, 'user')}>
                <div className="form-group">
                  <label>Email / Mobile Number</label>
                  <input name="email" type="email" placeholder="Enter your email" onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input name="password" type="password" placeholder="Enter password" onChange={handleChange} required />
                </div>
                <div className="form-row">
                  <label className="remember-me">
                    <input name="rememberMe" type="checkbox" onChange={handleChange} />
                    <span>Remember Me</span>
                  </label>
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </button>
                <div className="form-footer">
                  <a href="#" className="forgot-link">Forgot Password?</a>
                  <p className="signup-link">
                    <a href="#" className="signup-text" style={{borderBottom: 'none'}} onClick={(e) => { e.preventDefault(); navTo('userSignup'); }}>Create New Account</a>
                  </p>
                </div>
              </form>
            </div>
          )}

          {/* User Signup Form */}
          {activeView === 'userSignup' && (
            <div className="form-container">
              <button className="back-btn" onClick={() => navTo('signupSelection')}>
                <ArrowLeft size={18} />
                <span>Back</span>
              </button>
              <h1 className="title">User Registration</h1>
              <form className="login-form scrollable-form" onSubmit={(e) => handleSignup(e, 'user')}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input name="fullName" type="text" placeholder="Enter full name" onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input name="email" type="email" placeholder="Enter email address" onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Mobile Number</label>
                  <input name="mobile" type="tel" placeholder="Enter mobile number" onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input name="password" type="password" placeholder="Enter password" onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input name="confirmPassword" type="password" placeholder="Confirm password" onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <div className="radio-group">
                    <label className="radio-label"><input type="radio" name="gender" value="male" onChange={handleChange} /> Male</label>
                    <label className="radio-label"><input type="radio" name="gender" value="female" onChange={handleChange} /> Female</label>
                    <label className="radio-label"><input type="radio" name="gender" value="other" onChange={handleChange} /> Other</label>
                  </div>
                </div>
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input name="dob" type="date" onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input name="address" type="text" placeholder="Enter street address" onChange={handleChange} required />
                </div>
                <div className="form-row-group" style={{display: 'flex', gap: '1rem'}}>
                  <div className="form-group" style={{flex: 1}}>
                    <label>City</label>
                    <input name="city" type="text" placeholder="City" onChange={handleChange} required />
                  </div>
                  <div className="form-group" style={{flex: 1}}>
                    <label>State</label>
                    <input name="state" type="text" placeholder="State" onChange={handleChange} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Pincode</label>
                  <input name="pincode" type="text" placeholder="Enter pincode" onChange={handleChange} required />
                </div>
                <div className="form-row" style={{marginTop: '0.5rem'}}>
                  <label className="remember-me">
                    <input name="agreeTerms" type="checkbox" onChange={handleChange} required />
                    <span>Agree to Terms & Conditions</span>
                  </label>
                </div>
                <button type="submit" className="submit-btn" style={{marginTop: '0'}} disabled={loading}>
                  {loading ? 'Registering...' : 'Register'}
                </button>
                <div className="form-footer">
                  <p className="signup-link">
                    Already have an account? <a href="#" className="signup-text" style={{borderBottom: 'none'}} onClick={(e) => { e.preventDefault(); navTo('userLogin'); }}>Login here</a>
                  </p>
                </div>
              </form>
            </div>
          )}

          {/* Volunteer Login Form */}
          {activeView === 'volunteerLogin' && (
            <div className="form-container">
              <button className="back-btn" onClick={() => navTo('selection')}>
                <ArrowLeft size={18} />
                <span>Back</span>
              </button>
              <h1 className="title">Volunteer Login</h1>
              <form className="login-form scrollable-form" onSubmit={(e) => handleLogin(e, 'volunteer')}>
                <div className="form-group">
                  <label>Volunteer ID / Email</label>
                  <input name="email" type="email" placeholder="Enter ID or email" onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input name="password" type="password" placeholder="Enter password" onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Select Area / Department <span className="optional-text">(optional)</span></label>
                  <select name="department" className="form-select" onChange={handleChange}>
                    <option value="">Select an area...</option>
                    <option value="medical">Medical Aid</option>
                    <option value="rescue">Rescue Operations</option>
                    <option value="logistics">Logistics & Supply</option>
                    <option value="support">General Support</option>
                  </select>
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>Login</button>
                <div className="form-footer">
                  <a href="#" className="forgot-link">Forgot Password?</a>
                  <p className="signup-link">
                    <a href="#" className="signup-text" style={{borderBottom: 'none'}} onClick={(e) => { e.preventDefault(); navTo('volunteerSignup'); }}>Register as Volunteer</a>
                  </p>
                </div>
              </form>
            </div>
          )}

          {/* Volunteer Signup Form */}
          {activeView === 'volunteerSignup' && (
            <div className="form-container">
              <button className="back-btn" onClick={() => navTo('signupSelection')}>
                <ArrowLeft size={18} />
                <span>Back</span>
              </button>
              <h1 className="title">Volunteer Registration</h1>
              <form className="login-form scrollable-form" onSubmit={(e) => handleSignup(e, 'volunteer')}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input name="fullName" type="text" placeholder="Enter full name" onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input name="email" type="email" placeholder="Enter email address" onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Mobile Number</label>
                  <input name="mobile" type="tel" placeholder="Enter mobile number" onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input name="password" type="password" placeholder="Enter password" onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input name="confirmPassword" type="password" placeholder="Confirm password" onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Age</label>
                  <input name="age" type="number" placeholder="Enter your age" onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <div className="radio-group">
                    <label className="radio-label"><input type="radio" name="gender" value="male" onChange={handleChange} /> Male</label>
                    <label className="radio-label"><input type="radio" name="gender" value="female" onChange={handleChange} /> Female</label>
                    <label className="radio-label"><input type="radio" name="gender" value="other" onChange={handleChange} /> Other</label>
                  </div>
                </div>
                <div className="form-group">
                  <label>Skills</label>
                  <select name="skills" className="form-select" onChange={handleChange} required>
                    <option value="">Select Primary Skill...</option>
                    <option value="teaching">Teaching</option>
                    <option value="medical">Medical Support</option>
                    <option value="event">Event Management</option>
                    <option value="fundraising">Fundraising</option>
                    <option value="disaster">Disaster Relief</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Availability</label>
                  <div className="radio-group" style={{flexWrap: 'wrap'}}>
                    <label className="radio-label"><input type="radio" name="availability" value="weekdays" onChange={handleChange} /> Weekdays</label>
                    <label className="radio-label"><input type="radio" name="availability" value="weekends" onChange={handleChange} /> Weekends</label>
                    <label className="radio-label"><input type="radio" name="availability" value="fulltime" onChange={handleChange} /> Full Time</label>
                    <label className="radio-label"><input type="radio" name="availability" value="parttime" onChange={handleChange} /> Part Time</label>
                  </div>
                </div>
                <div className="form-group">
                  <label>Preferred Location</label>
                  <input name="location" type="text" placeholder="Enter preferred serving location" onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Emergency Contact Number</label>
                  <input name="emergencyContact" type="tel" placeholder="Enter emergency contact" onChange={handleChange} required />
                </div>
                <div className="form-row" style={{marginTop: '0.5rem'}}>
                  <label className="remember-me">
                    <input name="agreeTerms" type="checkbox" onChange={handleChange} required />
                    <span>Agree to Terms & Conditions</span>
                  </label>
                </div>
                <button type="submit" className="submit-btn" style={{marginTop: '0'}} disabled={loading}>
                  {loading ? 'Processing...' : 'Register as Volunteer'}
                </button>
                <div className="form-footer">
                  <p className="signup-link">
                    Already a volunteer? <a href="#" className="signup-text" style={{borderBottom: 'none'}} onClick={(e) => { e.preventDefault(); navTo('volunteerLogin'); }}>Login here</a>
                  </p>
                </div>
              </form>
            </div>
          )}

          {/* NGO Login Form */}
          {activeView === 'ngoLogin' && (
            <div className="form-container">
              <button className="back-btn" onClick={() => navTo('selection')}>
                <ArrowLeft size={18} />
                <span>Back</span>
              </button>
              <h1 className="title">NGO Login</h1>
              <form className="login-form scrollable-form" onSubmit={(e) => handleLogin(e, 'ngo')}>
                <div className="form-group">
                  <label>Organization Email</label>
                  <input name="email" type="email" placeholder="Enter organization email" onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input name="password" type="password" placeholder="Enter password" onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>NGO Registration Number</label>
                  <input name="regNumber" type="text" placeholder="Enter registration number" onChange={handleChange} required />
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>Login</button>
                <div className="form-footer">
                  <a href="#" className="forgot-link">Forgot Password?</a>
                  <p className="signup-link">
                    <a href="#" className="signup-text" style={{borderBottom: 'none'}} onClick={(e) => { e.preventDefault(); navTo('ngoSignup'); }}>Register NGO</a>
                  </p>
                </div>
              </form>
            </div>
          )}

          {/* NGO Signup Form */}
          {activeView === 'ngoSignup' && (
            <div className="form-container">
              <button className="back-btn" onClick={() => navTo('signupSelection')}>
                <ArrowLeft size={18} />
                <span>Back</span>
              </button>
              <h1 className="title">NGO Registration</h1>
              <form className="login-form scrollable-form" onSubmit={(e) => handleSignup(e, 'ngo')}>
                <div className="form-group">
                  <label>Organization Name</label>
                  <input name="orgName" type="text" placeholder="Enter organization name" onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>NGO Email Address</label>
                  <input name="email" type="email" placeholder="Enter official email" onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Contact Number</label>
                  <input name="mobile" type="tel" placeholder="Enter contact number" onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input name="password" type="password" placeholder="Enter password" onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input name="confirmPassword" type="password" placeholder="Confirm password" onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>NGO Registration Number</label>
                  <input name="registrationId" type="text" placeholder="Enter registration ID" onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Year Established</label>
                  <input name="yearEstablished" type="number" placeholder="YYYY" onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Organization Type</label>
                  <select name="orgType" className="form-select" onChange={handleChange} required>
                    <option value="">Select operations type...</option>
                    <option value="education">Education</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="environment">Environment</option>
                    <option value="animal">Animal Welfare</option>
                    <option value="women">Women Empowerment</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input name="address" type="text" placeholder="Organization headquarters address" onChange={handleChange} required />
                </div>
                <div className="form-row-group" style={{display: 'flex', gap: '1rem'}}>
                  <div className="form-group" style={{flex: 1}}>
                    <label>City</label>
                    <input name="city" type="text" placeholder="City" onChange={handleChange} required />
                  </div>
                  <div className="form-group" style={{flex: 1}}>
                    <label>State</label>
                    <input name="state" type="text" placeholder="State" onChange={handleChange} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Pincode</label>
                  <input name="pincode" type="text" placeholder="Enter pincode" onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Website <span className="optional-text">(Optional)</span></label>
                  <input name="website" type="url" placeholder="https://..." onChange={handleChange} />
                </div>
                <div className="form-row" style={{marginTop: '0.5rem'}}>
                  <label className="remember-me">
                    <input name="agreeTerms" type="checkbox" onChange={handleChange} required />
                    <span>Agree to Terms & Conditions</span>
                  </label>
                </div>
                <button type="submit" className="submit-btn" style={{marginTop: '0'}} disabled={loading}>
                  {loading ? 'Processing...' : 'Register NGO'}
                </button>
                <div className="form-footer">
                  <p className="signup-link">
                    Already registered? <a href="#" className="signup-text" style={{borderBottom: 'none'}} onClick={(e) => { e.preventDefault(); navTo('ngoLogin'); }}>Login here</a>
                  </p>
                </div>
              </form>
            </div>
          )}

          {/* Help / Support Form */}
          {activeView === 'help' && (
            <div className="form-container">
              <button className="back-btn" onClick={() => navTo('selection')}>
                <ArrowLeft size={18} />
                <span>Back</span>
              </button>
              <h1 className="title">Login Support</h1>
              <p className="subtitle" style={{marginBottom: '1rem', textAlign: 'center'}}>Having trouble accessing your account?</p>
              <form className="login-form scrollable-form" onSubmit={(e) => { e.preventDefault(); alert("Support message sent!"); navTo('selection'); }}>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" placeholder="Enter your registered email" required />
                </div>
                <div className="form-group">
                  <label>Describe Your Issue</label>
                  <textarea placeholder="Tell us what's happening..." rows="4" style={{
                    padding: '1rem 1.25rem',
                    background: 'rgba(11, 17, 32, 0.6)',
                    border: '1px solid rgba(0, 210, 255, 0.3)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '1rem',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }} required></textarea>
                </div>
                <button type="submit" className="submit-btn" style={{marginTop: '0.5rem'}}>Send to Support</button>
              </form>
            </div>
          )}

          {/* Dashboard View */}
          {activeView === 'dashboard' && (
            <div className="form-container" style={{textAlign: 'center', padding: '2rem 0'}}>
              <h1 className="title" style={{color: '#00d2ff'}}>SUCCESSFULLY<br/>LOGGED IN</h1>
              <p className="subtitle" style={{marginBottom: '2rem'}}>Welcome to your centralized portal!</p>
              
              <div style={{background: 'rgba(0, 210, 255, 0.1)', border: '1px solid rgba(0, 210, 255, 0.4)', borderRadius: '12px', padding: '2rem', marginBottom: '2rem'}}>
                <Shield size={48} color="#00d2ff" style={{marginBottom: '1rem'}} />
                <h3 style={{fontSize: '1.2rem', marginBottom: '0.5rem', color: 'white'}}>Status: Active Session</h3>
                <p style={{color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem'}}>Your data is securely authenticated via Firebase and synced to the Realtime Database.</p>
              </div>

              <button className="submit-btn" onClick={() => { auth.signOut(); navTo('selection'); }}>
                Log Out Securely
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default App;
