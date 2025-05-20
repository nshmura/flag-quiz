"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Country = {
  code: string;
  name: string;
};

export default function QuizPage() {
  const router = useRouter();
  const [currentCountry, setCurrentCountry] = useState<Country | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://flagcdn.com/ja/codes.json");
        const data = await response.json();
        const countryList = Object.entries(data)
          .filter(([code]) => !code.startsWith('us-'))
          .map(([code, name]) => ({
            code,
            name: name as string,
          }));
        setRandomCountry(countryList);
      } catch (error) {
        console.error("国データの取得に失敗しました:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const setRandomCountry = (countryList: Country[]) => {
    const randomIndex = Math.floor(Math.random() * countryList.length);
    setCurrentCountry(countryList[randomIndex]);
  };

  const handleShowAnswer = () => {
    if (currentCountry) {
      router.push(`/answer?code=${currentCountry.code}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 space-y-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-6"></div>
            <div className="aspect-video bg-gray-200 rounded mb-6"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 space-y-6">
        <p className="text-xl text-center text-gray-700 font-medium">
          この国旗の国名はなんでしょう？
        </p>
        <div className="aspect-video relative">
          {currentCountry && (
            <img
              src={`https://flagcdn.com/w320/${currentCountry.code}.png`}
              alt="国旗"
              className="w-full h-full object-contain"
            />
          )}
        </div>
        <button
          onClick={handleShowAnswer}
          disabled={!currentCountry}
          className={`w-full py-3 text-white rounded-lg transition-colors ${
            !currentCountry ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          答えを見る
        </button>
      </div>
    </div>
  );
} 