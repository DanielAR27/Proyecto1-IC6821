const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Conectado a MongoDB Atlas"))
  .catch(err => console.error("Error conectando a MongoDB:", err));

// Modelo de usuario
const userSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  favoriteMovies: { type: [String], default: [] },
});

const User = mongoose.model("User", userSchema);

// Ruta para manejar autenticación de usuario
app.post("/auth", async (req, res) => {
  const { googleId, name, favoriteMovies } = req.body;

  try {
    let user = await User.findOne({ googleId });

    if (!user) {
      // Si el usuario no existe, lo creamos
      user = new User({ googleId, name, favoriteMovies });
      await user.save();
    }

    res.json(user);
  } catch (error) {
    console.error("Error en autenticación:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// Nueva ruta para verificar si una película está en favoritos
app.get("/is-favorite", async (req, res) => {
  const { userId, movieId } = req.query;

  if (!userId || !movieId) {
    return res.status(400).json({ error: "Faltan parámetros: userId y movieId son requeridos" });
  }

  try {
    const user = await User.findOne({ googleId: userId });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Verificar si la película está en la lista de favoritas
    const isFavorite = user.favoriteMovies.includes(movieId);
    res.json({ isFavorite });
  } catch (error) {
    console.error("Error al verificar favorito:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// Ruta para agregar una película a favoritos
app.post("/add-favorite", async (req, res) => {
  const { userId, movieId } = req.body;

  if (!userId || !movieId) {
    return res.status(400).json({ error: "Faltan parámetros: userId y movieId son requeridos" });
  }

  try {
    const user = await User.findOne({ googleId: userId });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Verificar si la película ya está en favoritos
    if (!user.favoriteMovies.includes(movieId)) {
      user.favoriteMovies.push(movieId);
      await user.save();
    }

    res.json({ message: "Película agregada a favoritos", favoriteMovies: user.favoriteMovies });
  } catch (error) {
    console.error("Error al agregar favorito:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// Ruta para quitar una película de favoritos
app.delete("/remove-favorite", async (req, res) => {
  const { userId, movieId } = req.body;

  if (!userId || !movieId) {
    return res.status(400).json({ error: "Faltan parámetros: userId y movieId son requeridos" });
  }

  try {
    const user = await User.findOne({ googleId: userId });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Filtrar para eliminar la película
    user.favoriteMovies = user.favoriteMovies.filter(id => id !== movieId);
    await user.save();

    res.json({ message: "Película eliminada de favoritos", favoriteMovies: user.favoriteMovies });
  } catch (error) {
    console.error("Error al eliminar favorito:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// Ruta para obtener las películas favoritas de un usuario
app.get("/favorites/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ googleId: userId });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ favoriteMovies: user.favoriteMovies });
  } catch (error) {
    console.error("Error al obtener favoritos:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});


// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));