"use client"

import { useState, useRef } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Play, Pause, SkipForward, SkipBack, BookOpen, List } from "lucide-react"

interface Verse {
  number: number
  arabic: string
  translation: string
  audio: string
}

interface Surah {
  number: number
  name: string
  arabicName: string
  versesCount: number
  bismillah: string
  verses: Verse[]
}

interface SurahReaderProps {
  surah: Surah
}

const fontOptions = [
  { name: "Amiri", className: "font-[Amiri]" },
  { name: "Scheherazade", className: "font-[Scheherazade]" },
  { name: "Uthmanic", className: "font-[Uthmanic]" },
  { name: "Traditional Arabic", className: "font-[Traditional-Arabic]" },
  { name: "Noto Naskh", className: "font-[Noto-Naskh]" },
];

export function SurahReader({ surah }: SurahReaderProps) {

  const [displayMode, setDisplayMode] = useState<"arabic" | "translation" | "both">("both")
  const [viewMode, setViewMode] = useState<"compact" | "detailed">("detailed")
  const [currentVerse, setCurrentVerse] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [selectedFont, setSelectedFont] = useState(fontOptions[0].className);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Fonction pour convertir les nombres en chiffres arabes
  const convertToArabicNumerals = (num: number) => {
    const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return num
      .toString()
      .split("")
      .map((digit) => arabicNumbers[parseInt(digit, 10)])
      .join("");
  };

  const playNextVerse = () => {
    if (currentVerse < surah.verses.length - 1) {
      setCurrentVerse((prev) => prev + 1);
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play();
        }
      }, 500);
    }
  };

  const playPreviousVerse = () => {
    if (currentVerse > 0) {
      setCurrentVerse(currentVerse - 1)
    }
  }

  if (displayMode === "arabic" && viewMode === "compact") {
    return (
      <div className="space-y-6 quran-background min-h-screen p-4">
        <div className="flex flex-col sm:flex-row items-center sm:justify-between justify-center gap-4 text-center w-full">
          <Select
            value={displayMode}
            onValueChange={(value: "arabic" | "translation" | "both") => setDisplayMode(value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Mode d'affichage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="arabic">Arabe uniquement</SelectItem>
              <SelectItem value="translation">Traduction uniquement</SelectItem>
              <SelectItem value="both">Arabe et traduction</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedFont} onValueChange={(value) => setSelectedFont(value)}>
            <SelectTrigger className="min-w-[200px] w-full sm:w-[200px]">
              <SelectValue placeholder="Police du Coran" />
            </SelectTrigger>
            <SelectContent>
              {fontOptions.map((font, index) => (
                <SelectItem key={index} value={font.className}>
                  {font.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {displayMode === "arabic" && (
            <Button variant="outline" onClick={() => setViewMode(viewMode === "compact" ? "detailed" : "compact")}>
              {viewMode === "compact" ? <List className="h-4 w-4 mr-2" /> : <BookOpen className="h-4 w-4 mr-2" />}
              {viewMode === "compact" ? "Vue détaillée" : "Vue compacte"}
            </Button>
          )}

        </div>

        <Card>
          <CardContent className="p-6">
            <div className="text-center mb-8">
              <p className={`text-3xl text-center leading-loose ${selectedFont} text-[#5B4636]`}>بِسْمِ ٱللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
            </div>
            <div className="text-right space-y-2">
              <p className="text-2xl font-arabic leading-loose">
                {surah.verses.map((verse, index) => (
                  <span className={`text-3xl text-right leading-loose ${selectedFont} text-[#5B4636]`} key={verse.number}>
                    {verse.arabic}
                    <span className="inline-block mr-2 ml-2 text-sm text-gray-800">﴾{convertToArabicNumerals(verse.number)}﴿</span>
                  </span>
                ))}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 quran-background min-h-screen p-4">
      <div className="flex flex-col sm:flex-row items-center sm:justify-between justify-center gap-4 text-center w-full">
        <Select value={displayMode} onValueChange={(value: "arabic" | "translation" | "both") => setDisplayMode(value)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Mode d'affichage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="arabic">Arabe uniquement</SelectItem>
            <SelectItem value="translation">Traduction uniquement</SelectItem>
            <SelectItem value="both">Arabe et traduction</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedFont} onValueChange={(value) => setSelectedFont(value)}>
          <SelectTrigger className="min-w-[200px] w-full sm:w-[200px]">
            <SelectValue placeholder="Police du Coran" />
          </SelectTrigger>
          <SelectContent>
            {fontOptions.map((font, index) => (
              <SelectItem key={index} value={font.className}>
                {font.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-4">
          {displayMode === "arabic" && (
            <Button variant="outline" onClick={() => setViewMode(viewMode === "compact" ? "detailed" : "compact")}>
              {viewMode === "compact" ? <List className="h-4 w-4 mr-2" /> : <BookOpen className="h-4 w-4 mr-2" />}
              {viewMode === "compact" ? "Vue détaillée" : "Vue compacte"}
            </Button>
          )}

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
            <Button variant="outline" size="icon" onClick={playPreviousVerse} disabled={currentVerse === 0}>
              <SkipBack className="h-4 w-4" />
            </Button>

            <Button variant="outline" size="icon" onClick={handlePlayPause}>
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={playNextVerse}
              disabled={currentVerse === surah.verses.length - 1}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4 quran-background p-4">
        <div className="text-center mb-8">
          <p className={`text-3xl text-center leading-loose ${selectedFont} text-[#5B4636]`}>بِسْمِ ٱللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
        </div>

        {surah.verses.map((verse, index) => (
          <Card
            key={verse.number}
            className={`transition-shadow hover:shadow-md ${currentVerse === index ? "ring-2 ring-green-500" : ""}`}
          >
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Verset {verse.number}</span>
              </div>

              {(displayMode === "arabic" || displayMode === "both") && (
                <p className={`text-3xl text-right leading-loose ${selectedFont} text-[#5B4636]`}>{verse.arabic}</p>
              )}

              {(displayMode === "translation" || displayMode === "both") && (
                <p className="text-gray-600">{verse.translation}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <audio
        ref={audioRef}
        src={surah.verses[currentVerse]?.audio}
        onEnded={() => {
          if (currentVerse < surah.verses.length - 1) {
            setCurrentVerse((prev) => prev + 1);
            setTimeout(() => {
              if (audioRef.current) {
                audioRef.current.play();
              }
            }, 500);
          } else {
            setIsPlaying(false);
          }
        }}
        className="hidden"
      />
    </div>
  )
}

