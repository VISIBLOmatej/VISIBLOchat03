# 🚀 Návod pro nahrání na GitHub

## 1. Vytvoření GitHub repository

1. **Přihlaste se na GitHub**: https://github.com
2. **Klikněte na "New repository"** (nebo `+` v pravém horním rohu)
3. **Vyplňte údaje**:
   - Repository name: `visiblo-chat`
   - Description: `Profesionální real-time chat aplikace s admin funkcemi`
   - Vyberte **Public** (nebo Private podle potřeby)
   - ✅ Zaškrtněte "Add a README file"
   - ✅ Zaškrtněte "Add .gitignore" → vyberte **Node**
   - ✅ Zaškrtněte "Choose a license" → vyberte **MIT License**
4. **Klikněte "Create repository"**

## 2. Nahrání kódu na GitHub

### Varianta A: Git příkazy (doporučeno)

1. **Otevřete terminál** v root složce vašeho projektu

2. **Inicializujte Git repository**:
   ```bash
   git init
   ```

3. **Přidejte remote repository** (nahraďte `your-username`):
   ```bash
   git remote add origin https://github.com/your-username/visiblo-chat.git
   ```

4. **Přidejte všechny soubory**:
   ```bash
   git add .
   ```

5. **Commitněte změny**:
   ```bash
   git commit -m "Initial commit: VISIBLO Chat aplikace"
   ```

6. **Pushněte na GitHub**:
   ```bash
   git push -u origin main
   ```

### Varianta B: GitHub Desktop (grafické rozhraní)

1. **Stáhněte GitHub Desktop**: https://desktop.github.com/
2. **Klikněte "Add an Existing Repository from your Hard Drive"**
3. **Vyberte složku s vaším projektem**
4. **Klikněte "Publish repository"**
5. **Vyplňte název a description**
6. **Klikněte "Publish Repository"**

### Varianta C: Drag & Drop (jednoduchá metoda)

1. **Jděte na váš GitHub repository**
2. **Klikněte "uploading an existing file"**
3. **Přetáhněte všechny soubory** (kromě `node_modules/`)
4. **Napište commit message**: "Initial commit"
5. **Klikněte "Commit new files"**

## 3. Konfigurace po nahrání

### Aktualizace Firebase konfigurace

1. **Vytvořte nový Firebase projekt** (nebo použijte stávající)
2. **V `client/src/lib/firebase.ts`** aktualizujte konfiguraci
3. **Commitněte změny**:
   ```bash
   git add .
   git commit -m "Update Firebase configuration"
   git push
   ```

### Nastavení environment variables

1. **Vytvořte `.env` soubor** (lokálně):
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_DATABASE_URL=your_database_url
   # další proměnné...
   ```

2. **Pro deployment** nastavte environment variables ve vašem hosting provideru

## 4. Deployment možnosti

### GitHub Pages (statické hosting)
1. **Jděte do Settings** → **Pages**
2. **Source**: Deploy from a branch
3. **Branch**: main / docs
4. **Klikněte Save**

### Vercel (doporučeno pro React)
1. **Jděte na vercel.com**
2. **Import Git Repository**
3. **Vyberte váš GitHub repository**
4. **Deploy**

### Netlify
1. **Jděte na netlify.com**
2. **"New site from Git"**
3. **Vyberte GitHub** a váš repository
4. **Deploy site**

### Replit Deploy
1. **V Replit** klikněte tlačítko **Deploy**
2. **Vyberte typ deployment**
3. **Konfigurace se provede automaticky**

## 5. Udržování repository

### Pravidelné aktualizace
```bash
# Přidání nových změn
git add .
git commit -m "Popis změn"
git push

# Stažení změn od ostatních
git pull
```

### Branching pro funkce
```bash
# Vytvoření nové větve
git checkout -b nova-funkce

# Práce na funkci...
git add .
git commit -m "Přidána nová funkce"

# Merge zpět do main
git checkout main
git merge nova-funkce
git push
```

## 6. Bezpečnost

⚠️ **Důležité**: 
- Nikdy nepushujte API klíče přímo do kódu
- Používejte environment variables
- Přidejte `.env` do `.gitignore`
- Pro produkci nastavte Firebase pravidla

## 7. Troubleshooting

### Problem: "Permission denied"
```bash
# Ověřte remote URL
git remote -v

# Nastavte správné URL s vaším username
git remote set-url origin https://github.com/your-username/visiblo-chat.git
```

### Problem: "Authentication failed"
- Použijte Personal Access Token místo hesla
- Nebo se přihlaste přes GitHub CLI: `gh auth login`

### Problem: "Repository not found"
- Ověřte název repository
- Zkontrolujte, že repository existuje
- Zkontrolujte, že máte přístup

---

✅ **Hotovo!** Vaše VISIBLO Chat aplikace je nyní na GitHubu a připravena ke sdílení a dalšímu vývoji.