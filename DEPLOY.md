# Deploy su GitHub Pages

## 1. Crea un nuovo repository su GitHub

1. Vai su https://github.com/new
2. Nome repository: `referendum-2025` (o quello che preferisci)
3. Descrizione: "Simulatori interattivi Referendum Italia 2025"
4. Lascia PUBLIC
5. NON inizializzare con README (l'abbiamo già)
6. Clicca "Create repository"

## 2. Carica i file

Dalla cartella del progetto sul tuo computer:

```bash
cd /Users/euge/Desktop/referendum-github-page

# Inizializza git
git init

# Aggiungi tutti i file
git add .

# Commit iniziale
git commit -m "Prima pubblicazione simulatori referendum 2025"

# Collega al tuo repository (sostituisci TUO_USERNAME)
git remote add origin https://github.com/TUO_USERNAME/referendum-2025.git

# Carica su GitHub
git push -u origin main
```

## 3. Attiva GitHub Pages

1. Vai nelle Settings del repository su GitHub
2. Scorri fino a "Pages" nella sidebar sinistra
3. In "Source" seleziona: Deploy from a branch
4. Branch: main
5. Folder: / (root)
6. Clicca Save

## 4. Accedi al sito

Dopo 2-5 minuti il sito sarà live su:
`https://TUO_USERNAME.github.io/referendum-2025/`

## File inclusi

- `index.html` - Homepage con link ai simulatori
- `simulatore-personale.html` - Simulatore impatto personale
- `hyperstition-mode.html` - Visualizzazione esagonale Lotka-Volterra
- `rationale.html` - Documentazione tecnica
- `RATIONALE.txt` - Documentazione ASCII originale
- `README.md` - Descrizione progetto
- Cartelle con i modelli e dati di supporto

## Aggiornamenti futuri

Per aggiornare il sito:

```bash
git add .
git commit -m "Descrizione modifiche"
git push
```

Le modifiche saranno live in pochi minuti.

## Note

- I simulatori utilizzano solo JavaScript vanilla, nessuna dipendenza esterna
- Font Monaspace Krypton caricato da CDN
- Completamente responsive e funzionante su mobile