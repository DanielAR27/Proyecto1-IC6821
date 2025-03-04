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

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
