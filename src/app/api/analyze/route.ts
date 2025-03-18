import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize the OpenAI client with API key from environment variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Convert the image to base64
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    // Call OpenAI API with GPT-4o-mini
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a product analyzer for the "Binnenmarkt Preisdetektiv" app. 
          Your job is to:
          1. Identify the product in the image.
          2. Estimate the current market price in the EU.
          3. Estimate what the price would be without the EU internal market (with tariffs, higher production costs, less competition).
          4. Provide a brief explanation (2-3 sentences) of why the EU internal market causes this price difference.
          5. If the product is likely not produced in the EU, indicate that.

          Format your response as JSON with the following fields:
          {
            "productName": "Product name",
            "currentPrice": "Estimated current price with currency",
            "withoutEUPrice": "Estimated price without EU internal market",
            "priceIncrease": "Percentage increase",
            "explanation": "Brief explanation",
            "madeInEU": true/false
          }
          
          Du musst die Antwort auf Deutsch geben. Alle Felder müssen auf Deutsch sein. Preise sollten in Euro angegeben werden.`
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Identifiziere dieses Produkt und analysiere seinen Preis im EU-Binnenmarkt im Vergleich zu ohne EU-Binnenmarkt.' },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
          ]
        }
      ],
      response_format: { type: 'json_object' }
    });

    // Return the analysis
    return NextResponse.json(JSON.parse(response.choices[0].message.content || '{}'));
  } catch (error: unknown) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 