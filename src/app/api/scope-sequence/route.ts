// src/app/api/scope-sequence/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getScopeSequence } from '@/lib/scopeSequenceData';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const subject = searchParams.get('subject');
  const grade = searchParams.get('grade');

  if (!subject || !grade) {
    return NextResponse.json({ error: 'Missing subject or grade' }, { status: 400 });
  }

  const suggestions = getScopeSequence(subject, grade);
  if (!suggestions) {
    return NextResponse.json({ error: 'No data found for subject/grade' }, { status: 404 });
  }

  return NextResponse.json({ subject, grade, suggestions });
}
