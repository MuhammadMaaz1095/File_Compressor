import { NextRequest, NextResponse } from 'next/server';

interface ContactPayload {
  name?: string;
  email: string;
  topic: string;
  subject: string;
  message: string;
  honeypot?: string;
}

const ALLOWED_TOPICS = [
  'general',
  'bug_report',
  'feature_request',
  'format_support',
  'accessibility',
  'privacy',
];

export async function POST(req: NextRequest) {
  try {
    const body: ContactPayload = await req.json();

    // 1. Spam check via honeypot
    if (body.honeypot && body.honeypot.trim().length > 0) {
      // Silently discard bot spam
      return NextResponse.json({ success: true, message: 'Message received.' });
    }

    // 2. Server-side validation
    const email = body.email ? body.email.trim() : '';
    const name = body.name ? body.name.trim() : '';
    const topic = body.topic ? body.topic.trim() : 'general';
    const subject = body.subject ? body.subject.trim() : '';
    const message = body.message ? body.message.trim() : '';

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    if (!subject || subject.length < 3 || subject.length > 200) {
      return NextResponse.json(
        { success: false, error: 'Subject must be between 3 and 200 characters.' },
        { status: 400 }
      );
    }

    if (!message || message.length < 10 || message.length > 5000) {
      return NextResponse.json(
        { success: false, error: 'Message must be between 10 and 5000 characters.' },
        { status: 400 }
      );
    }

    if (!ALLOWED_TOPICS.includes(topic)) {
      return NextResponse.json(
        { success: false, error: 'Please select a recognized feedback topic.' },
        { status: 400 }
      );
    }

    // 3. Integration boundary:
    // If an external email provider webhook or SMTP is configured in .env, forward here.
    const webhookUrl = process.env.CONTACT_EMAIL_WEBHOOK;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            topic,
            subject,
            message,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (webhookErr) {
        console.error('Contact webhook delivery error:', webhookErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your feedback has been received and verified by our system.',
      referenceId: `FC-${Date.now().toString(36).toUpperCase()}`,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'An unexpected server error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
