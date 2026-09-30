import React, { createContext, useContext, useState, useEffect } from 'react';
import { playPopSound, playPowSound, playSuccessFanfare } from '../utils/sound';
import confetti from 'canvas-confetti';

const AuthContext = createContext();

const INITIAL_DEFAULT_ADDRESSES = [
  {
    id: 'addr-1',
    tag: 'HOME HQ',
    receiver: 'Captain Priya',
    phone: '9876543210',
    addressLine: 'Flat 402, Krypton Heights, Indiranagar',
    city: 'Bengaluru',
    pincode: '560038',
    landmark: 'Near Comic Con Central',
    isDefault: true,
  },
  {
    id: 'addr-2',
    tag: 'PARTY ARENA',
    receiver: 'Captain Priya',
    phone: '9876543210',
    addressLine: 'Wonderland Banquet Hall, 100ft Road',
    city: 'Bengaluru',
    pincode: '560008',
    landmark: 'Opposite Metro Station',
    isDefault: false,
  }
];

// Pre-registered accounts so user can log in immediately or create their own
const DEFAULT_REGISTERED_USERS = [
  {
    id: 'usr-1',
    username: 'Techwithakash',
    password: '123456789',
    name: 'akash',
    email: 'akash@bommicake.com',
    phone: '86*********',
    avatar: '🦸‍♀️',
    addresses: INITIAL_DEFAULT_ADDRESSES,
  },
  {
    id: 'usr-2',
    username: 'alex_baker',
    password: 'ComicCake@2026',
    name: 'Alex Wonder',
    email: 'alex@bommicake.com',
    phone: '9123456789',
    avatar: '🦸‍♂️',
    addresses: [
      {
        id: 'addr-alex-1',
        tag: 'STUDIO HQ',
        receiver: 'Alex Wonder',
        phone: '9123456789',
        addressLine: 'Studio 12, Marvel Art Lane, Bandra West',
        city: 'Mumbai',
        pincode: '400050',
        landmark: 'Opposite Comic Hub',
        isDefault: true,
      }
    ],
  },
];

export const AuthProvider = ({ children }) => {
  // Registered accounts stored in localStorage
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('bommi_registered_users');
      return saved ? JSON.parse(saved) : DEFAULT_REGISTERED_USERS;
    } catch (e) {
      return DEFAULT_REGISTERED_USERS;
    }
  });

  // Current logged in user (null by default if not logged in, or loaded from session)
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('bommi_active_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [initialModalMode, setInitialModalMode] = useState('login'); // 'login' | 'register'
  const [postLoginAction, setPostLoginAction] = useState(null);

  // Sync registered users to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bommi_registered_users', JSON.stringify(registeredUsers));
    } catch (e) {}
  }, [registeredUsers]);

  // Sync active user to localStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('bommi_active_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('bommi_active_user');
      }
    } catch (e) {}
  }, [user]);

  /**
   * Log in an existing user with username & password
   */
  const loginWithCredentials = (username, password) => {
    const cleanUsername = username.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Check if username exists
    const foundUser = registeredUsers.find(
      (u) => u.username.toLowerCase() === cleanUsername
    );

    if (!foundUser) {
      return {
        success: false,
        error: 'USER_NOT_FOUND',
        message: `No registered account found for "${username}". Would you like to create a new account?`,
      };
    }

    // Check password
    if (foundUser.password !== cleanPassword) {
      return {
        success: false,
        error: 'INVALID_PASSWORD',
        message: 'Incorrect password! Please check your credentials and try again.',
      };
    }

    // Login successful
    playSuccessFanfare();
    setUser(foundUser);
    setIsLoginModalOpen(false);

    if (postLoginAction) {
      postLoginAction(foundUser);
      setPostLoginAction(null);
    }

    return {
      success: true,
      user: foundUser,
    };
  };

  /**
   * Register a new user with validation:
   * 1. Unique username
   * 2. Security password rules: min 6 chars, at least 1 letter, at least 1 number
   */
  const registerUser = ({ username, password, name, phone, email, avatar }) => {
    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    // Validation 1: Username empty or format
    if (!cleanUsername || cleanUsername.length < 3) {
      return {
        success: false,
        error: 'INVALID_USERNAME',
        message: 'Username must be at least 3 characters long (letters, numbers, underscores).',
      };
    }

    // Validation 2: Username uniqueness
    const isTaken = registeredUsers.some(
      (u) => u.username.toLowerCase() === cleanUsername.toLowerCase()
    );
    if (isTaken) {
      return {
        success: false,
        error: 'USERNAME_TAKEN',
        message: `Holy frosting! The username "${cleanUsername}" is already taken. Please choose another username or log in.`,
      };
    }

    // Validation 3: Password security rules
    // Rule: At least 6 characters, contains at least one letter and at least one number
    if (cleanPassword.length < 6) {
      return {
        success: false,
        error: 'PASSWORD_TOO_SHORT',
        message: 'Password must be at least 6 characters long.',
      };
    }

    const hasLetter = /[a-zA-Z]/.test(cleanPassword);
    const hasNumber = /[0-9]/.test(cleanPassword);

    if (!hasLetter || !hasNumber) {
      return {
        success: false,
        error: 'PASSWORD_WEAK',
        message: 'Password must contain at least one letter and one number for superhero security!',
      };
    }

    // Create new account
    const newUser = {
      id: 'usr-' + Date.now(),
      username: cleanUsername,
      password: cleanPassword,
      name: name?.trim() || cleanUsername,
      email: email?.trim() || `${cleanUsername.toLowerCase()}@bommicake.com`,
      phone: phone?.trim() || '9876543210',
      avatar: avatar || '🦸‍♂️',
      addresses: [
        {
          id: 'addr-' + Date.now(),
          tag: 'HOME HQ',
          receiver: name?.trim() || cleanUsername,
          phone: phone?.trim() || '9876543210',
          addressLine: '100 ft Road, Indiranagar',
          city: 'Bengaluru',
          pincode: '560038',
          landmark: 'Near Cake Central',
          isDefault: true,
        }
      ],
    };

    // Save to registered list
    setRegisteredUsers((prev) => [...prev, newUser]);

    // Automatically log the new user in
    setUser(newUser);
    setIsLoginModalOpen(false);
    playSuccessFanfare();

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    if (postLoginAction) {
      postLoginAction(newUser);
      setPostLoginAction(null);
    }

    return {
      success: true,
      user: newUser,
    };
  };

  const logout = () => {
    playPopSound();
    setUser(null);
  };

  const addAddress = (newAddress) => {
    if (!user) return;
    const updatedAddresses = [
      ...user.addresses,
      {
        ...newAddress,
        id: 'addr-' + Date.now(),
        isDefault: user.addresses.length === 0,
      }
    ];
    const updatedUser = { ...user, addresses: updatedAddresses };
    setUser(updatedUser);

    // Update in registeredUsers list as well
    setRegisteredUsers((prev) =>
      prev.map((u) => (u.id === user.id ? updatedUser : u))
    );
  };

  const openLogin = (callback, mode = 'login') => {
    if (callback) setPostLoginAction(() => callback);
    setInitialModalMode(mode);
    setIsLoginModalOpen(true);
  };

  const closeLogin = () => {
    setIsLoginModalOpen(false);
    setPostLoginAction(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        registeredUsers,
        loginWithCredentials,
        registerUser,
        logout,
        addAddress,
        isLoginModalOpen,
        initialModalMode,
        openLogin,
        closeLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
