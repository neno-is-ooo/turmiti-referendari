# Attivare GitHub Pages

Il codice è stato caricato con successo! Ora devi attivare GitHub Pages:

1. Vai su https://github.com/neno-is-ooo/turmiti-referendari
2. Clicca su "Settings" (in alto a destra)
3. Scorri fino a "Pages" nella sidebar sinistra
4. In "Source" seleziona:
   - Deploy from a branch
   - Branch: main
   - Folder: / (root)
5. Clicca "Save"

Dopo 2-5 minuti il sito sarà live su:
https://neno-is-ooo.github.io/turmiti-referendari/

## Fix per l'errore 500 su rationale.html

Se vedi ancora l'errore 500 per rationale.html, potrebbe essere dovuto al nome del file in conflitto con RATIONALE.txt (che abbiamo rimosso). 

Per risolvere:
1. Ricarica la pagina con Ctrl+F5 (o Cmd+Shift+R su Mac)
2. Svuota la cache del browser
3. Il link ora punta correttamente a rationale.html

## Mobile

Il simulatore Turmiti Referendari è ora ottimizzato per mobile con:
- Canvas ridimensionato automaticamente
- Pannelli di controllo adattivi
- Font e pulsanti ridimensionati
- Layout responsivo

## Aggiornamenti futuri

Per aggiornare il sito:
```bash
git add .
git commit -m "Descrizione modifiche"
git push
```