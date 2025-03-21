const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const express = require("express");
const app = express();

app.use(express.json()); // ✅ Permite leer JSON en las peticiones

app.post("/createDeck", async (req, res) => {
    const { deckName } = req.body;
    
    console.log("🔹 Recibida solicitud para crear baraja:", deckName);

    try {
        const response = await fetch("http://127.0.0.1:8765", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "createDeck",
                version: 6,
                params: { deck: deckName }
            }),
        });

        const data = await response.json();
        console.log("🔹 Respuesta de AnkiConnect:", data); // 🔍 Verifica la respuesta de AnkiConnect

        if (data.error) {
            res.status(500).json({ error: "Error desde Anki: " + data.error });
        } else {
            res.json({ success: true, result: data.result });
        }
    } catch (error) {
        console.error("❌ Error comunicándose con Anki:", error);
        res.status(500).json({ error: "Error comunicándose con Anki" });
    }
});

app.listen(3000, () => {
    console.log("🚀 Servidor corriendo en http://localhost:3000");
});
app.post("/addNote", async (req, res) => {
  const { deckName, front, back } = req.body;

  console.log("🔹 Agregando nota a la baraja:", deckName);

  try {
      const response = await fetch("http://127.0.0.1:8765", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              action: "addNote",
              version: 6,
              params: {
                  note: {
                      deckName: deckName,
                      modelName: "Basic",
                      fields: {
                          Front: front,
                          Back: back
                      },
                      tags: ["API", "AnkiConnect"],
                      options: {
                          allowDuplicate: false
                      }
                  }
              }
          }),
      });

      const data = await response.json();
      console.log("🔹 Respuesta de AnkiConnect:", data); // 🔍 Verifica la respuesta

      if (data.error) {
          res.status(500).json({ error: "Error desde Anki: " + data.error });
      } else {
          res.json({ success: true, result: data.result });
      }
  } catch (error) {
      console.error("❌ Error comunicándose con Anki:", error);
      res.status(500).json({ error: "Error comunicándose con Anki" });
  }
});

