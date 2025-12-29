import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY || '');

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ContextItem {
  text: string;
  page: number;
}

interface ReaderAIRequest {
  message: string;
  contextItems: ContextItem[];
  currentPage: number;
  chapterTitle: string;
  chapterId: string;
  bookId: string;
  chatHistory?: ChatMessage[];
}

// Build educational context based on chapter
function getChapterContext(chapterId: string, bookId: string): string {
  if (bookId === 'physics-9-10') {
    if (chapterId === 'ch1') {
      return `
এই অধ্যায়: ভৌত রাশি এবং পরিমাপ (Chapter 1: Physical Quantities and Measurement)

মূল বিষয়সমূহ:
- পদার্থবিজ্ঞানের পরিসর ও ক্রমবিকাশ
- ভৌত রাশি (Physical Quantities): মৌলিক ও লব্ধ রাশি
- একক (Units): SI একক ব্যবস্থা
- পরিমাপ যন্ত্র: স্লাইড ক্যালিপার্স, স্ক্রু গজ
- পরিমাপের নির্ভুলতা ও যথার্থতা
- মাত্রা বিশ্লেষণ

গুরুত্বপূর্ণ সূত্র:
- মাত্রা সমীকরণ: [M^a L^b T^c]
- শতকরা ত্রুটি = (পরম ত্রুটি / প্রকৃত মান) × ১০০%
`;
    } else if (chapterId === 'ch2') {
      return `
এই অধ্যায়: গতি (Chapter 2: Motion)

মূল বিষয়সমূহ:
- স্থিতি ও গতির ধারণা
- পরসঙ্গ কাঠামো (Frame of Reference)
- দূরত্ব ও সরণ (Distance & Displacement)
- দ্রুতি ও বেগ (Speed & Velocity)
- ত্বরণ ও মন্দন (Acceleration & Deceleration)
- সমবেগ ও অসমবেগে গতি
- পড়ন্ত বস্তুর গতি ও অভিকর্ষজ ত্বরণ

গুরুত্বপূর্ণ সূত্র:
- বেগ, v = s/t
- ত্বরণ, a = (v-u)/t
- v = u + at
- s = ut + ½at²
- v² = u² + 2as
- অভিকর্ষজ ত্বরণ, g ≈ 9.8 m/s²
`;
    }
  }

  return `এটি একটি NCTB পাঠ্যপুস্তকের অধ্যায়।`;
}

export async function POST(request: NextRequest) {
  try {
    const body: ReaderAIRequest = await request.json();
    const { message, contextItems, currentPage, chapterTitle, chapterId, bookId, chatHistory = [] } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Build the system prompt with educational context
    const chapterContext = getChapterContext(chapterId, bookId);

    // Build context from selected text
    let selectedTextContext = '';
    if (contextItems && contextItems.length > 0) {
      selectedTextContext = '\n\nশিক্ষার্থী নিম্নলিখিত অংশ(গুলো) নির্বাচন করেছে:\n';
      contextItems.forEach((item, idx) => {
        selectedTextContext += `\n[পৃষ্ঠা ${item.page}]: "${item.text}"`;
      });
    }

    const systemPrompt = `তুমি একজন বাংলাদেশের ৯ম-১০ম শ্রেণির শিক্ষার্থীদের জন্য AI শিক্ষা সহকারী। তোমার নাম "শিক্ষা AI"।

বর্তমান প্রেক্ষাপট:
- বই: ${bookId === 'physics-9-10' ? 'পদার্থবিজ্ঞান (৯ম-১০ম শ্রেণি)' : bookId}
- অধ্যায়: ${chapterTitle}
- বর্তমান পৃষ্ঠা: ${currentPage}

${chapterContext}
${selectedTextContext}

নির্দেশনা:
1. সবসময় বাংলায় উত্তর দাও
2. শিক্ষার্থীদের বোঝার উপযোগী সহজ ভাষা ব্যবহার কর
3. প্রয়োজনে উদাহরণ ও সূত্র ব্যবহার কর
4. যদি শিক্ষার্থী কোনো নির্দিষ্ট অংশ নির্বাচন করে থাকে, সেই প্রেক্ষাপটে উত্তর দাও
5. প্রশ্নের উত্তর সংক্ষিপ্ত কিন্তু তথ্যবহুল রাখ
6. গাণিতিক সূত্র বা সমীকরণ লেখার সময় সুস্পষ্টভাবে লেখ
7. শিক্ষার্থীকে উৎসাহিত কর এবং বন্ধুত্বপূর্ণ স্বরে কথা বল`;

    // Build conversation history for context
    const conversationHistory = chatHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Initialize the model
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    // Start chat with history
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: systemPrompt }]
        },
        {
          role: 'model',
          parts: [{ text: 'আমি বুঝেছি। আমি শিক্ষা AI হিসেবে বাংলায় শিক্ষার্থীদের সাহায্য করব।' }]
        },
        ...conversationHistory
      ],
    });

    // Send the message
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      response: text,
      success: true
    });

  } catch (error: unknown) {
    // Log detailed error info
    console.error('Reader AI Error:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }

    // Check if it's a Gemini API error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        error: `AI সার্ভারে সমস্যা হয়েছে: ${errorMessage}`,
        success: false
      },
      { status: 500 }
    );
  }
}
