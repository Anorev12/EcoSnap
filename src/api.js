const BASE_URL = "http://localhost:8080/api/users";

// ─── Helper: extract readable error message from response ─────────
const extractError = async (response, fallback) => {
  try {
    const data = await response.json();
    return data.message || fallback;
  } catch {
    return fallback;
  }
};

export const registerUser = async (userData) => {
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    const message = await extractError(response, "Registration failed. Please try again.");
    throw new Error(message);
  }
  return response.json();
};

export const loginUser = async (email, password) => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const message = await extractError(response, "Invalid email or password.");
    throw new Error(message);
  }
  return response.json();
};

export const updateUserProfile = async (id, userData) => {
  const response = await fetch(`${BASE_URL}/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    const message = await extractError(response, "Update failed. Please try again.");
    throw new Error(message);
  }
  return response.json();
};

export const getUserById = async (id) => {
  const response = await fetch(`${BASE_URL}/get/${id}`);
  if (!response.ok) {
    const message = await extractError(response, "User not found.");
    throw new Error(message);
  }
  return response.json();
};