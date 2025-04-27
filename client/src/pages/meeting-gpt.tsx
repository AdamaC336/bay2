import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, Upload, Calendar, Clock, FileText, Download, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function MeetingGPT() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [meetingText, setMeetingText] = useState("");
  const [generatedSummary, setGeneratedSummary] = useState<string | null>(null);
  
  // Mock function to simulate processing meeting audio/text
  const processMeeting = () => {
    if (!meetingText.trim()) return;
    
    setIsProcessing(true);
    setTimeout(() => {
      setGeneratedSummary(`# Meeting Summary

## Key Points
- Team agreed on Q2 marketing budget allocation with emphasis on TikTok ads
- New product launch timeline set for July 15th
- Inventory challenges discussed; action items assigned to operations team
- Customer feedback themes: shipping speed concerns and packaging improvements

## Action Items
1. **Sarah (Marketing):** Finalize TikTok campaign creative by June 1
2. **David (Product):** Complete product packaging designs by June 15
3. **Alex (Operations):** Resolve shipping carrier issues by end of month
4. **Jamie (Customer Service):** Compile detailed customer feedback report

## Decisions Made
- Approved $50,000 budget increase for Q2 marketing
- Selected "Summer Hydration" as the theme for the July campaign
- Decided to maintain current pricing despite increased costs

## Follow-up
- Schedule follow-up meeting in 2 weeks to review progress
- Share meeting notes with leadership team`);
      setIsProcessing(false);
    }, 3000);
  };
  
  // Sample recent meetings
  const recentMeetings = [
    {
      id: 1,
      title: "Marketing Strategy Review",
      date: "Apr 24, 2023",
      duration: "45 min",
      attendees: 6,
      type: "internal"
    },
    {
      id: 2,
      title: "Supplier Negotiation - PawPrint Packaging",
      date: "Apr 22, 2023",
      duration: "60 min",
      attendees: 4,
      type: "external"
    },
    {
      id: 3,
      title: "Q2 Planning Session",
      date: "Apr 18, 2023",
      duration: "90 min",
      attendees: 8,
      type: "internal"
    }
  ];

  return (
    <div>
      <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold mt-2 md:mt-0">Meeting GPT</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" /> Meetings
          </Button>
          <Button className="gap-2">
            <Mic className="h-4 w-4" /> New Recording
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="transcribe" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="transcribe">Transcribe & Summarize</TabsTrigger>
          <TabsTrigger value="history">Meeting History</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Meetings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transcribe">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle>Meeting Input</CardTitle>
                <CardDescription>Upload an audio file or paste meeting notes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col gap-3">
                    <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center hover:bg-slate-800/50 transition-colors cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto text-slate-500 mb-2" />
                      <p className="text-sm text-slate-400">Drop your audio file here or click to browse</p>
                      <p className="text-xs text-slate-500 mt-1">Supports MP3, WAV, M4A (Max 2 hours)</p>
                    </div>
                    
                    <div className="text-center text-sm text-slate-500">or</div>
                    
                    <Textarea 
                      placeholder="Paste meeting transcript or notes here..." 
                      className="h-48 resize-none bg-slate-800 border-slate-700"
                      value={meetingText}
                      onChange={(e) => setMeetingText(e.target.value)}
                    />
                    
                    <Button 
                      onClick={processMeeting} 
                      disabled={isProcessing || !meetingText.trim()}
                      className="w-full"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Generate Summary'
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle>AI Summary</CardTitle>
                <CardDescription>Key points, action items, and decisions</CardDescription>
              </CardHeader>
              <CardContent>
                {generatedSummary ? (
                  <div className="prose prose-invert max-w-none">
                    <div className="bg-slate-800 rounded-lg p-4 whitespace-pre-line">
                      {generatedSummary}
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button variant="outline" className="gap-2">
                        <Download className="h-4 w-4" /> Download as PDF
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-80 text-center">
                    <FileText className="h-12 w-12 text-slate-600 mb-4" />
                    <p className="text-slate-400">Your meeting summary will appear here</p>
                    <p className="text-sm text-slate-500 mt-1 max-w-xs">Upload an audio file or paste meeting transcript to generate a summary</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="history">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle>Recent Meetings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMeetings.map((meeting) => (
                  <div key={meeting.id} className="bg-slate-800 p-4 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-white">{meeting.title}</h3>
                        <div className="flex items-center mt-1 text-sm text-slate-400">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span className="mr-3">{meeting.date}</span>
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{meeting.duration}</span>
                        </div>
                      </div>
                      <Badge variant={meeting.type === 'internal' ? 'default' : 'secondary'}>
                        {meeting.type}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-sm text-slate-500">{meeting.attendees} attendees</span>
                      <Button size="sm" variant="outline">View Summary</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="scheduled">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle>Upcoming Meetings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-60 text-center">
                <Calendar className="h-12 w-12 text-slate-600 mb-4" />
                <p className="text-slate-400">Calendar integration coming soon</p>
                <p className="text-sm text-slate-500 mt-1 max-w-xs">
                  Connect your Google Calendar or Microsoft Outlook to automatically record and summarize your meetings
                </p>
                <Button className="mt-4" variant="outline">Connect Calendar</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Feature Preview */}
      <Card className="bg-indigo-900 bg-opacity-30 border-indigo-700">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="mr-4 p-3 bg-indigo-500 bg-opacity-20 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-indigo-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Real-time Voice Transcription Coming Soon</h3>
              <p className="text-indigo-200 mt-1">Join a meeting and let our AI transcribe, summarize, and extract action items in real-time.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}