"use client";

import React, { useState } from "react";
import { Upload, Play, RotateCcw, ChevronRight } from "lucide-react";

export default function FlashcardsApp() {
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [mode, setMode] = useState("upload"); // upload, study
  const [questionType, setQuestionType] = useState("meaning"); // meaning, translation, word

  const parseTextFile = (text) => {
    const lines = text.split("\n").filter((line) => line.trim());
    const parsedCards = [];

    for (const line of lines) {
      // Formato esperado: palavra - significado - tradução
      const parts = line.split("-").map((p) => p.trim());
      if (parts.length === 3) {
        parsedCards.push({
          word: parts[0],
          meaning: parts[1],
          translation: parts[2],
        });
      }
    }

    return parsedCards;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const parsedCards = parseTextFile(text);
        setCards(parsedCards);
      };
      reader.readAsText(file);
    }
  };

  const handleTextInput = (text) => {
    const parsedCards = parseTextFile(text);
    setCards(parsedCards);
  };

  const startStudying = () => {
    if (cards.length > 0) {
      setMode("study");
      setCurrentCardIndex(0);
      setShowAnswer(false);
      setQuestionType(getRandomQuestionType());
    }
  };

  const getRandomQuestionType = () => {
    const types = ["meaning", "translation", "word"];
    return types[Math.floor(Math.random() * types.length)];
  };

  const nextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
      setQuestionType(getRandomQuestionType());
    } else {
      setMode("finished");
    }
  };

  const restart = () => {
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setMode("study");
    setQuestionType(getRandomQuestionType());
  };

  const resetAll = () => {
    setCards([]);
    setMode("upload");
    setCurrentCardIndex(0);
    setShowAnswer(false);
  };

  const getQuestion = () => {
    const card = cards[currentCardIndex];
    switch (questionType) {
      case "meaning":
        return {
          question: card.word,
          answer: card.meaning,
          label: "Qual o significado?",
        };
      case "translation":
        return {
          question: card.word,
          answer: card.translation,
          label: "Qual a tradução?",
        };
      case "word":
        return {
          question: card.translation,
          answer: card.word,
          label: "Qual a palavra em português?",
        };
      default:
        return { question: "", answer: "", label: "" };
    }
  };

  if (mode === "upload") {
    return (
      <div className="min-h-screen bg-[#2b2d30] p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Flashcards Anki
              </h1>
              <p className="text-gray-600">
                Importe seu dicionário e comece a estudar
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload de arquivo .txt
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <input
                    type="file"
                    accept=".txt"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Clique para fazer upload
                  </label>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">ou</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cole seu texto aqui
                </label>
                <textarea
                  className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
                  placeholder="palavra - significado - tradução&#10;exemplo: casa - lugar onde se vive - house&#10;aprender - adquirir conhecimento - learn"
                  onChange={(e) => handleTextInput(e.target.value)}
                />
              </div>

              {cards.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">
                    ✓ {cards.length}{" "}
                    {cards.length === 1 ? "card carregado" : "cards carregados"}
                  </p>
                </div>
              )}

              <button
                onClick={startStudying}
                disabled={cards.length === 0}
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <Play className="h-5 w-5" />
                Começar a estudar
              </button>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Formato do arquivo:</strong> palavra - significado -
                tradução
                <br />
                Uma entrada por linha
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "study") {
    const { question, answer, label } = getQuestion();

    return (
      <div className="min-h-screen bg-[#2b2d30] p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex justify-between items-center mb-8">
              <div className="text-sm text-gray-600">
                Card {currentCardIndex + 1} de {cards.length}
              </div>
              <button
                onClick={resetAll}
                className="text-gray-600 hover:text-gray-800 text-sm flex items-center gap-1"
              >
                <RotateCcw className="h-4 w-4" />
                Recomeçar
              </button>
            </div>

            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentCardIndex + 1) / cards.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="text-center mb-8">
              <p className="text-indigo-600 font-medium mb-4">{label}</p>
              <h2 className="text-5xl font-bold text-gray-800 mb-8">
                {question}
              </h2>

              {showAnswer ? (
                <div className="bg-indigo-50 rounded-xl p-8 mb-6">
                  <p className="text-2xl text-indigo-900 font-medium">
                    {answer}
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => setShowAnswer(true)}
                  className="bg-indigo-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Mostrar Resposta
                </button>
              )}
            </div>

            {showAnswer && (
              <button
                onClick={nextCard}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                Próximo Card
                <ChevronRight className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (mode === "finished") {
    return (
      <div className="min-h-screen bg-[#2b2d30] p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              🎉 Parabéns!
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Você completou todos os {cards.length} flashcards!
            </p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={restart}
                className="bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <RotateCcw className="h-5 w-5" />
                Estudar Novamente
              </button>
              <button
                onClick={resetAll}
                className="bg-gray-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Novo Deck
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
