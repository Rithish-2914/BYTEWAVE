"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Mic, Send, User, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/components/providers/language-provider";
import { aiAssistantDocumentUnderstanding } from "@/ai/flows/ai-assistant-document-understanding";
import { useDocuments } from "@/hooks/use-documents";

type Message = {
  id: number;
  text: string;
  sender: "user" | "bot";
  audio?: string;
};

export default function AiAssistantPage() {
  const { t, language } = useLanguage();
  const { documents } = useDocuments();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: t("aiAssistantPage.initialMessage"),
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [responseType, setResponseType] = useState<'text' | 'audio'>('text');

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: "user",
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsBotTyping(true);

    try {
      // Create a single context string from all documents
      const documentText = documents.map(doc => `Document Title: ${doc.title}\nSummary: ${doc.summary}`).join('\n\n---\n\n');

      const result = await aiAssistantDocumentUnderstanding({
        documentText,
        query: input,
        language: language,
        responseType: responseType,
      });

      const botResponse: Message = {
        id: Date.now() + 1,
        text: responseType === 'text' ? result.response : t("aiAssistantPage.audioResponseMessage"),
        sender: "bot",
        audio: responseType === 'audio' ? result.response : undefined
      };
      setMessages((prev) => [...prev, botResponse]);

    } catch (error) {
       console.error("Error calling AI assistant:", error);
       toast({
         variant: "destructive",
         title: t("aiAssistantPage.errorTitle"),
         description: t("aiAssistantPage.errorDescription"),
       });
       const botResponse: Message = {
        id: Date.now() + 1,
        text: t("aiAssistantPage.errorResponse"),
        sender: "bot",
      };
      setMessages((prev) => [...prev, botResponse]);
    } finally {
        setIsBotTyping(false);
    }
  };
  
  const handlePlayAudio = (audioData: string | undefined) => {
    if (!audioData) return;
    try {
      const audio = new Audio(audioData);
      audio.play();
    } catch (error) {
      console.error("Error playing audio:", error);
      toast({
        variant: "destructive",
        title: t("aiAssistantPage.audioErrorTitle"),
        description: t("aiAssistantPage.audioErrorDescription"),
      });
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          {t("AI Assistant")}
        </h1>
        <p className="text-muted-foreground">
          {t("aiAssistantPage.description")}
        </p>
      </div>

      <div className="flex-1 flex flex-col gap-4 bg-card border rounded-lg p-4">
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-start gap-3",
                  message.sender === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.sender === "bot" && (
                  <Avatar className="w-8 h-8 border-2 border-primary">
                    <AvatarFallback><Bot size={18} /></AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "max-w-md rounded-lg p-3 text-sm",
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <p>{message.text}</p>
                   {message.audio && message.sender === "bot" && (
                       <Button variant="ghost" size="icon" className="h-7 w-7 mt-2" onClick={() => handlePlayAudio(message.audio)}>
                           <Volume2 className="h-4 w-4" />
                       </Button>
                   )}
                </div>
                {message.sender === "user" && (
                  <Avatar className="w-8 h-8">
                      <AvatarImage src="https://picsum.photos/seed/user-admin/100/100" />
                      <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isBotTyping && (
               <div className="flex items-start gap-3 justify-start">
                   <Avatar className="w-8 h-8 border-2 border-primary">
                       <AvatarFallback><Bot size={18} /></AvatarFallback>
                   </Avatar>
                   <div className="bg-muted rounded-lg p-3 text-sm flex items-center gap-2">
                       <span className="h-2 w-2 bg-foreground rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                       <span className="h-2 w-2 bg-foreground rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                       <span className="h-2 w-2 bg-foreground rounded-full animate-pulse"></span>
                   </div>
               </div>
            )}
          </div>
        </ScrollArea>

        <div className="mt-auto flex items-center gap-2 border-t pt-4">
           <div className="flex items-center gap-1">
              <Button 
                variant={responseType === 'text' ? 'secondary': 'ghost'} 
                size="icon" 
                onClick={() => setResponseType('text')}
                aria-label={t('aiAssistantPage.textResponseAriaLabel')}
              >
                T
              </Button>
               <Button 
                variant={responseType === 'audio' ? 'secondary': 'ghost'} 
                size="icon" 
                onClick={() => setResponseType('audio')}
                aria-label={t('aiAssistantPage.audioResponseAriaLabel')}
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            </div>
          <div className="relative flex-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={t("aiAssistantPage.inputPlaceholder")}
              className="pr-20"
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              <Button type="button" variant="ghost" size="icon">
                <Mic className="h-4 w-4" />
              </Button>
              <Button type="submit" size="icon" onClick={handleSend} disabled={isBotTyping}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
