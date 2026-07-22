import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  return NextResponse.json({ 
    success: true, 
    message: "TrialFlow API is working!",
    data: {
      patients: [],
      count: 0
    }
  });
}

export async function GET() {
  return NextResponse.json({ 
    status: "ok", 
    message: "TrialFlow API is ready" 
  });
}
