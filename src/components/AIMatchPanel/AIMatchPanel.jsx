'use client';
import { useState } from 'react';

const API_HOST =
  (process.env.NEXT_PUBLIC_API_HOST ||
    'https://dog-shelter-api-66zi.onrender.com').replace(/\/$/, '');

export default function AIMatchPanel({ onScores }) {
  const [enabled, setEnabled] = useState(false);
  const [answers, setAnswers] = useState({
    apartment: '1',
    kids: '0',
    cats: '0',
    experience: 'novice',
    activity: 'medium',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const apply = async () => {
    try {
      setLoading(true);
      setError('');
      const qs = new URLSearchParams(answers).toString();

      // ← ось тут підставляємо твій бек
      const res = await fetch(`${API_HOST}/ai/recommend?${qs}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('AI service error');
      const data = await res.json();

      onScores(enabled ? data.scores : {});
    } catch (e) {
      setError('Не вдалося отримати рекомендації');
      onScores({});
    } finally {
      setLoading(false);
    }
  };

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    if (!next) onScores({});
    else apply();
  };

  return (
    <div className="ai-panel">
      <label className="toggle">
        <input type="checkbox" checked={enabled} onChange={toggle} />
        <span>AI-підбір</span>
      </label>

      {enabled && (
        <div className="grid grid-cols-5 gap-2">
                    <select value={answers.apartment} onChange={e=>setAnswers(a=>({...a, apartment: e.target.value}))}>
            <option value="1">Квартира</option>
            <option value="0">Будинок/байдуже</option>
          </select>
          <select value={answers.kids} onChange={e=>setAnswers(a=>({...a, kids: e.target.value}))}>
            <option value="0">Без дітей</option>
            <option value="1">Є діти</option>
          </select>
          <select value={answers.cats} onChange={e=>setAnswers(a=>({...a, cats: e.target.value}))}>
            <option value="0">Без кішки</option>
            <option value="1">Є кішка</option>
          </select>
          <select value={answers.experience} onChange={e=>setAnswers(a=>({...a, experience: e.target.value}))}>
            <option value="novice">Малий досвід</option>
            <option value="experienced">Досвідчений</option>
          </select>
          <select value={answers.activity} onChange={e=>setAnswers(a=>({...a, activity: e.target.value}))}>
            <option value="low">Спокійний</option>
            <option value="medium">Середній</option>
            <option value="high">Дуже активний</option>
          </select>

          <button disabled={loading} onClick={apply} className="col-span-5">
            {loading ? 'Підбираю…' : 'Оновити підбір'}
          </button>
          {error && <div className="col-span-5 text-sm text-red-600">{error}</div>}
        </div>
      )}
    </div>
  );
}
