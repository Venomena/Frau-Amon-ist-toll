# Binnenmarkt Preisdetektiv

Eine Web-Anwendung, die zeigt, wie der EU-Binnenmarkt die Preise von Produkten beeinflusst.

## Beschreibung

Der "Binnenmarkt Preisdetektiv" ermöglicht es Nutzern, ein Bild eines Produkts hochzuladen und zu erfahren, wie viel dieses Produkt ohne den EU-Binnenmarkt kosten würde. Die Anwendung:

1. Erkennt das Produkt auf dem hochgeladenen Bild mithilfe der OpenAI GPT-4o-mini API
2. Vergleicht den aktuellen Preis mit einem geschätzten Preis ohne EU-Binnenmarkt (mit Zöllen, höheren Produktionskosten, weniger Wettbewerb)
3. Erklärt, warum der Binnenmarkt diesen Preisunterschied verursacht
4. Zeigt an, ob das Produkt wahrscheinlich in der EU produziert wird

## Technologien

- Next.js
- TypeScript
- Tailwind CSS
- OpenAI API (GPT-4o-mini)

## Lokale Entwicklung

1. Konfigurieren Sie die Umgebungsvariablen:

```
OPENAI_API_KEY=your_openai_api_key
```

2. Installieren Sie die Abhängigkeiten:

```bash
npm install
```

3. Starten Sie den Entwicklungsserver:

```bash
npm run dev
```

4. Öffnen Sie [http://localhost:3000](http://localhost:3000) in Ihrem Browser.

## Produktion

Um die Anwendung für die Produktion zu bauen:

```bash
npm run build
```

Anschließend können Sie die Anwendung starten:

```bash
npm start
```

## Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
