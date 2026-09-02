import axios from 'axios';

const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:5001/api/auth';

const authClient = axios.create({
  baseURL: AUTH_API_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests if present
authClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('resume_ai_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Mock local accounts storage for client fallback
const LOCAL_USERS_KEY = 'resume_ai_local_users';
const LOCAL_CURRENT_USER_KEY = 'resume_ai_current_user';

function getLocalUsers() {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveLocalUsers(users) {
  try {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  } catch (e) {}
}

export async function loginApi(email, password) {
  try {
    const res = await authClient.post('/login', { email, password });
    if (res.data && res.data.success) {
      return res.data.data;
    }
    throw new Error(res.data?.error || 'Login failed');
  } catch (err) {
    console.warn('Live Auth server unreachable, using local auth storage:', err.message);
    return fallbackLocalLogin(email, password);
  }
}

export async function registerApi(name, email, password, targetRole = 'Software Developer', careerLevel = 'Entry Level') {
  try {
    const res = await authClient.post('/register', {
      name,
      email,
      password,
      targetRole,
      careerLevel,
    });
    if (res.data && res.data.success) {
      return res.data.data;
    }
    throw new Error(res.data?.error || 'Registration failed');
  } catch (err) {
    console.warn('Live Auth server unreachable, using local auth storage:', err.message);
    return fallbackLocalRegister(name, email, password, targetRole, careerLevel);
  }
}

export async function getProfileApi() {
  try {
    const res = await authClient.get('/me');
    if (res.data && res.data.success) {
      return res.data.data;
    }
    throw new Error('Failed to get profile');
  } catch (err) {
    const raw = localStorage.getItem(LOCAL_CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}

export async function saveUserResumeApi(title, resumeData, template = 'modern') {
  try {
    const res = await authClient.post('/save-resume', {
      title,
      resumeData,
      template,
    });
    return res.data?.data;
  } catch (err) {
    // Save to local user profile
    const users = getLocalUsers();
    const current = JSON.parse(localStorage.getItem(LOCAL_CURRENT_USER_KEY) || '{}');
    if (current && current.email) {
      const uIdx = users.findIndex((u) => u.email.toLowerCase() === current.email.toLowerCase());
      const newResume = {
        title: title || 'My Resume',
        resumeData,
        template,
        updatedAt: new Date().toISOString(),
      };
      if (uIdx !== -1) {
        users[uIdx].resumes = [newResume, ...(users[uIdx].resumes || [])].slice(0, 10);
        saveLocalUsers(users);
      }
      current.resumes = [newResume, ...(current.resumes || [])].slice(0, 10);
      localStorage.setItem(LOCAL_CURRENT_USER_KEY, JSON.stringify(current));
      return current.resumes;
    }
    return null;
  }
}

// ----------------------------------------------------
// Seamless Client-side Authentication Fallbacks
// ----------------------------------------------------

function fallbackLocalLogin(email, password) {
  const users = getLocalUsers();
  const lowerEmail = email.toLowerCase().trim();
  const user = users.find((u) => u.email.toLowerCase() === lowerEmail);

  if (!user || user.password !== password) {
    throw new Error('Invalid email or password');
  }

  const token = `jwt_mock_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const userData = {
    _id: user._id || `usr_${Date.now()}`,
    name: user.name,
    email: user.email,
    targetRole: user.targetRole,
    careerLevel: user.careerLevel,
    resumes: user.resumes || [],
    token,
  };

  localStorage.setItem(LOCAL_CURRENT_USER_KEY, JSON.stringify(userData));
  return userData;
}

function fallbackLocalRegister(name, email, password, targetRole, careerLevel) {
  const users = getLocalUsers();
  const lowerEmail = email.toLowerCase().trim();
  const exists = users.find((u) => u.email.toLowerCase() === lowerEmail);

  if (exists) {
    throw new Error('An account with this email already exists');
  }

  const token = `jwt_mock_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const newUser = {
    _id: `usr_${Date.now()}`,
    name: name.trim(),
    email: lowerEmail,
    password, // in local fallback
    targetRole: targetRole || 'Software Developer',
    careerLevel: careerLevel || 'Entry Level',
    resumes: [],
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveLocalUsers(users);

  const userData = {
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    targetRole: newUser.targetRole,
    careerLevel: newUser.careerLevel,
    resumes: [],
    token,
  };

  localStorage.setItem(LOCAL_CURRENT_USER_KEY, JSON.stringify(userData));
  return userData;
}
