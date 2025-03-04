import { useGoogleLogin } from "@react-oauth/google";

export default function GoogleButton({ language, navigate, setUserId }) {
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      if (tokenResponse.access_token) {
        try {
          const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          });

          if (!res.ok) throw new Error(`Error en la solicitud: ${res.statusText}`);

          // Obtener el JSON con la información correspondiente al usuario.
          const userInfo = await res.json();
          setUserId(userInfo.sub, userInfo.name); // Guardamos el ID único del usuario
          setTimeout(() => navigate("/search-view"), 1000);
        } catch (error) {
          console.error("Error al obtener el perfil del usuario:", error);
        }
      } else {
        console.error("No se recibió el access_token de Google.");
      }
    },
    onError: () => {
      console.log("Login Fallido");
    },
  });

  return (
    <button
      onClick={googleLogin}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "90%",
        backgroundColor: "white",
        color: "black",
        border: "1px solid #ccc",
        borderRadius: "5px",
        padding: "12px 0",
        cursor: "pointer",
        fontSize: "16px",
        gap: "10px",
      }}
    >
      <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" style={{ width: "20px" }} />
      {language === "es" ? "Iniciar sesión con Google" : "Sign in with Google"}
    </button>
  );
}
