"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getCountryInfo } from "@/lib/wikipedia";

type Country = {
  code: string;
  name: string;
};

type CountryInfo = {
  description: string | null;
  specialties: string | null;
  attractions: string | null;
};

function AnswerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [country, setCountry] = useState<Country | null>(null);
  const [countryInfo, setCountryInfo] = useState<CountryInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      router.push("/quiz");
      return;
    }

    const fetchCountryData = async () => {
      try {
        const response = await fetch("https://flagcdn.com/ja/codes.json");
        const data = await response.json();
        const countryName = data[code];
        if (countryName) {
          setCountry({ code, name: countryName });
          // Wikipediaから情報を取得
          const info = await getCountryInfo(countryName);
          setCountryInfo(info);
        }
      } catch (error) {
        console.error("データの取得に失敗しました:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountryData();
  }, [searchParams, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-start min-h-[calc(100vh-4rem)] p-4 bg-white">
        <div className="w-full max-w-md bg-orange-100 rounded-lg shadow-lg p-6 space-y-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="aspect-video bg-gray-200 rounded mb-6"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-[calc(100vh-4rem)] p-4 bg-white">
      <div className="w-full max-w-md bg-orange-100 rounded-lg shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">
          答え：{country?.name}
        </h2>
        <div className="aspect-video relative">
          {country && (
            <img
              src={`https://flagcdn.com/w320/${country.code}.png`}
              alt={`${country.name}の国旗`}
              className="w-full h-full object-contain"
            />
          )}
        </div>
        
        <button
          onClick={() => router.push("/quiz")}
          className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          次の問題へ
        </button>

        <div className="aspect-[4/3] relative">
          {country && (
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(country.name)}&zoom=3`}
              className="w-full h-full rounded-lg"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          )}
        </div>

        {countryInfo && (
          <div className="space-y-4 text-gray-700">
            {countryInfo.description && (
              <div>
                <h3 className="font-semibold mb-2">基本情報</h3>
                <p>{countryInfo.description}</p>
                {country && (
                  <a
                    href={`https://ja.wikipedia.org/wiki/${encodeURIComponent(country.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Wikipediaで詳しく見る →
                  </a>
                )}
              </div>
            )}
            {countryInfo.specialties && (
              <div>
                <h3 className="font-semibold mb-2">特産物</h3>
                <p>{countryInfo.specialties}</p>
              </div>
            )}
            {countryInfo.attractions && (
              <div>
                <h3 className="font-semibold mb-2">観光スポット</h3>
                <p>{countryInfo.attractions}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AnswerPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-start min-h-[calc(100vh-4rem)] p-4 bg-white">
        <div className="w-full max-w-md bg-orange-100 rounded-lg shadow-lg p-6 space-y-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="aspect-video bg-gray-200 rounded mb-6"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    }>
      <AnswerContent />
    </Suspense>
  );
} 