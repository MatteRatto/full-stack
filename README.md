# MR app - Applicazione di Autenticazione Sicura

Un'applicazione full-stack per l'autenticazione sicura degli utenti con gestione avanzata delle sessioni JWT.

## 🚀 Funzionalità

### Autenticazione

- **Registrazione utenti** con validazione completa dei dati
- **Login sicuro** con hashing delle password (bcrypt)
- **Logout** con pulizia delle sessioni
- **Autenticazione JWT** con token auto-rinnovabili

### Gestione Sessione Avanzata

- **Monitoraggio in tempo reale** dello stato del token
- **Notifiche di scadenza** progressive (15, 10, 5, 2, 1 minuti)
- **Refresh automatico** del token quando vicino alla scadenza
- **Indicatore visivo** dello stato della sessione
- **Modal di conferma** per estendere la sessione
- **Sincronizzazione server-client** dello stato del token

### Profilo Utente

- **Visualizzazione profilo** con informazioni dettagliate
- **Modifica profilo** (nome, email)
- **Cambio password** opzionale con validazione

### UI/UX

- **Design responsive** con Tailwind CSS
- **Interfaccia italiana** completamente localizzata
- **Notifiche toast** per feedback utente
- **Animazioni fluide** e transizioni
- **Layout mobile-friendly**

## 🛠️ Tecnologie Utilizzate

### Frontend

- **React 18** con TypeScript
- **React Router** per la navigazione
- **React Hook Form** + Zod per la validazione
- **Tailwind CSS** per lo styling
- **React Toastify** per le notifiche
- **Vite** come build tool

### Backend

- **Node.js** con Express
- **MySQL** come database
- **JWT** per l'autenticazione
- **bcrypt** per l'hashing delle password
- **express-rate-limit** per la protezione
- **helmet** per la sicurezza

## 🚦 Getting Started

### Prerequisiti

- Node.js (v16 o superiore)
- MySQL (v8 o superiore)
- npm

### Installazione

1. **Clona il repository**

```bash
git clone <repository-url>
cd Myapp
```

2. **Setup Backend**

```bash
cd backend
npm install
```

3. **Configura il database**

```bash
# Crea un database MySQL
mysql -u root -p
CREATE DATABASE Myapp_db;
```

4. **Configura le variabili d'ambiente**

```bash
# Crea file .env nella cartella backend
cp .env.example .env

# Modifica le variabili in .env:
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=Myapp_db
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:3000
```

5. **Avvia il backend**

```bash
npm run dev
```

6. **Setup Frontend**

```bash
cd ../frontend
npm install
```

7. **Configura variabili frontend**

```bash
# Crea file .env.local
VITE_API_BASE_URL=http://localhost:5000/api
```

8. **Avvia il frontend**

```bash
npm run dev
```

L'applicazione sarà disponibile su `http://localhost:3000`

## 🔐 Sicurezza

### Misure Implementate

- **Hashing delle password** con bcrypt (salt rounds: 10)
- **Token JWT** con scadenza configurabile
- **Rate limiting** (100 richieste per 15 minuti)
- **Helmet** per headers di sicurezza
- **CORS** configurato per dominio specifico
- **Validazione input** lato server e client

### Gestione Token

- **Scadenza token**: 30 minuti (configurabile)
- **Refresh automatico**: quando mancano 15 minuti
- **Controllo scadenza**: ogni minuto lato client
- **Sincronizzazione server**: ogni 2 minuti

## 📊 Features Avanzate

### Monitoraggio Sessione

- Indicatore visivo dello stato del token nella navbar
- Notifiche progressive di scadenza
- Modal per conferma estensione sessione
- Logging dettagliato per debug

### Validazione

- **Lato client**: React Hook Form + Zod schemas
- **Lato server**: express-validator

### UI Components

- Design system coerente
- Componenti riutilizzabili
- Responsive design
- Loading states e feedback visivo

## 🚀 Deploy

### Backend (Node.js)

```bash
npm run build
npm start
```

### Frontend (Static)

```bash
npm run build
# Deploy della cartella dist/
```

## 📝 API Endpoints

### Auth

- `POST /api/auth/register` - Registrazione utente
- `POST /api/auth/login` - Login utente
- `GET /api/auth/me` - Profilo utente corrente
- `PUT /api/auth/profile` - Aggiorna profilo
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/token-status` - Stato token
- `POST /api/auth/logout` - Logout

## 🎨 Customizzazione

### Colori (Tailwind)

Il progetto usa un colore primario personalizzabile in `tailwind.config.js`:

```javascript
colors: {
  primary: colors.sky;
}
```

### Configurazione JWT

Modifica `backend/src/config/config.js` per personalizzare:

- Durata token
- Soglie di scadenza
- Configurazioni di sicurezza

## 📄 Licenza

MIT License - vedi file LICENSE per dettagli

## 👨‍💻 Autore

Matteo Ratto
