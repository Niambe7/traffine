import api from "./api";

export const loginUser = async (email: string, password: string) => {
  try {
    const res = await api.post("/auth/auth/login", { email, password });
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Erreur de connexion");
  }
};

export const loginWithGoogle = async (idToken: string) => {
  try {
    const res = await api.post("/oauth/auth/google/token", { idToken });
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Erreur de connexion Google");
  }
};  


/**
 * Crée un nouvel utilisateur.
 *
 * @param username - Nom d'utilisateur
 * @param email    - Adresse e-mail
 * @param password - Mot de passe en clair
 * @param role     - (Optionnel) Rôle à assigner, 'user' par défaut
 * @returns        Les données renvoyées par le serveur (message + user)
 * @throws         Erreur contenant le message renvoyé par le serveur
 */
export const registerUser = async (
  username: string,
  email: string,
  password: string,
  role?: string
) => {
  try {
    const payload = { username, email, password, role };
    const res = await api.post("/users/users", payload);
    return res.data;
  } catch (err: any) {
    throw new Error(
      err.response?.data?.message ||
      "Erreur lors de la création de l'utilisateur"
    );
  }
};