# VISIBLO Chat

Profesionální real-time komunikační platforma s admin funkcemi a thread-based messagingem.

## 🚀 Funkce

- **Real-time chat** s Firebase Realtime Database
- **Admin panel** pro správu konverzací
- **Automatické mazání** zpráv starších 10 dní
- **Responsivní design** pro mobily i desktop
- **České rozhraní** s VISIBLO brandingem
- **Thread management** pro organizaci konverzací
- **Bezpečný admin přístup** s heslem

## 🛠️ Technologie

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: shadcn/ui komponenty + Tailwind CSS
- **Database**: Firebase Realtime Database
- **Backend**: Express.js + Node.js
- **Routing**: Wouter
- **Forms**: React Hook Form + Zod validation

## 📦 Instalace

1. **Naklonujte repository**:
   ```bash
   git clone https://github.com/your-username/visiblo-chat.git
   cd visiblo-chat
   ```

2. **Nainstalujte závislosti**:
   ```bash
   npm install
   ```

3. **Spusťte development server**:
   ```bash
   npm run dev
   ```

4. **Otevřete v prohlížeči**:
   ```
   http://localhost:5000
   ```

## 🔧 Konfigurace

### Firebase Setup

Aplikace používá tyto Firebase konfigurace:
- **Project ID**: `visiblo-web-chat`
- **Database URL**: `https://visiblo-web-chat-default-rtdb.europe-west1.firebasedatabase.app`
- **Region**: Europe West 1

Pro vlastní Firebase projekt:
1. Vytvořte nový Firebase projekt
2. Aktivujte Realtime Database
3. Nastavte databázová pravidla podle potřeby
4. Upravte konfiguraci v `client/src/lib/firebase.ts`

### Environment Variables

Můžete použít environment variables pro Firebase konfiguraci:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_DATABASE_URL=your_database_url
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 👤 Admin přístup

**Admin uživatel**: `Matěj Podhola`  
**Heslo**: `Palecek2009`

Admin funkce:
- Přepínání mezi uživatelskými vlákny
- Mazání celých konverzací
- Správa všech chatů

## 📱 Použití

1. **Přihlášení**: Zadejte jméno nebo firmu
2. **Chat**: Pište zprávy v real-time
3. **Admin**: Přihlaste se jako admin pro správu

## 🏗️ Struktura projektu

```
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   └── chat/           # Chat komponenty
│   │   ├── lib/
│   │   │   └── firebase.ts     # Firebase konfigurace
│   │   ├── pages/
│   │   │   └── chat.tsx        # Hlavní stránka
│   │   ├── types/
│   │   │   └── chat.ts         # TypeScript typy
│   │   └── index.css           # Styly a CSS proměnné
├── server/                     # Express.js backend
├── shared/                     # Sdílené typy a schémata
├── package.json               # Dependencies
└── README.md                  # Dokumentace
```

## 🎨 Customizace

### Barvy a styling

Upravte CSS proměnné v `client/src/index.css`:

```css
:root {
  --visiblo-primary: hsl(213, 100%, 56%);
  --visiblo-secondary: hsl(345, 62%, 53%);
  --visiblo-surface: hsl(213, 100%, 97%);
  /* další barvy... */
}
```

### Firebase pravidla

Doporučená databázová pravidla:

```json
{
  "rules": {
    "threads": {
      ".read": true,
      ".write": true,
      "$threadId": {
        "$messageId": {
          ".validate": "newData.hasChildren(['name', 'text', 'time'])"
        }
      }
    }
  }
}
```

## 📦 Build a Deployment

```bash
# Build pro produkci
npm run build

# Spuštění produkční verze
npm start

# Type checking
npm run check
```

## 🤝 Přispívání

1. Fork repository
2. Vytvořte feature branch (`git checkout -b feature/nova-funkce`)
3. Commit změny (`git commit -am 'Přidána nová funkce'`)
4. Push do branch (`git push origin feature/nova-funkce`)
5. Vytvořte Pull Request

## 📄 Licence

MIT License - viz [LICENSE](LICENSE) soubor.

## 🔗 Odkazy

- [Firebase Console](https://console.firebase.google.com/)
- [Tailwind CSS Dokumentace](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [React Dokumentace](https://react.dev/)

---

**VISIBLO Chat** - Profesionální komunikační řešení pro moderní firmy.